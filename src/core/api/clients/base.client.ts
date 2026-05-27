import axios, {
    AxiosError,
    AxiosHeaders,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'

import type { ApiResponse } from '@/core/models/common.dto'

import { tokenStorageService } from '@/core/storage/token-storage.service'
import { HTTP_HEADER, ERROR_CODES } from '@/core/constants/http.constants'
import { CLIENT_ID, CLIENT_TYPE } from '@/core/constants/client-type.constants'
import { API_EVENT, apiEvents } from '@/core/events/api.events'
import { createLogger } from '@/core/logger/logger'
import { refreshTokenApi } from './refresh-token.api'

// ─── Env ──────────────────────────────────────────────────────────────────────

const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

if (!ENV_API_BASE_URL) throw new Error('[BaseClient] VITE_API_BASE_URL is not defined')

const API_BASE_URL: string = ENV_API_BASE_URL

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RequestConfig extends InternalAxiosRequestConfig {
    skipAuth?: boolean
    skipAuthRefresh?: boolean
    retryCount?: number
    isRetryAfterRefresh?: boolean
    maxRetries?: number
    retryableStatuses?: Set<number>
    idempotentMethods?: Set<string>
}

export type QueryPrimitive = string | number | boolean
export type QueryParams = Record<string, QueryPrimitive | QueryPrimitive[] | null | undefined>

// ─── Constants ────────────────────────────────────────────────────────────────

const log = createLogger('api')

const DEFAULT_TIMEOUT = 30_000
const RETRY_BASE_DELAY_MS = 1_000

// PATCH intentionally excluded — non-idempotent per RFC 5789
const DEFAULT_RETRY_POLICY = Object.freeze({
    maxRetries: 3,
    retryableStatuses: new Set([408, 429, 500, 502, 503, 504]),
    idempotentMethods: new Set(['get', 'head', 'options', 'put', 'delete']),
})

export const DEFAULT_HEADERS: Readonly<Record<string, string>> = Object.freeze({
    [HTTP_HEADER.CONTENT_TYPE]: 'application/json',
    [HTTP_HEADER.ACCEPT]: 'application/json',
    [HTTP_HEADER.CLIENT_TYPE]: CLIENT_TYPE.WEB,
    [HTTP_HEADER.CLIENT_ID]: CLIENT_ID.WEB_APP,
})

export type ClientDefaults = Required<
    Pick<
        RequestConfig,
        | 'baseURL'
        | 'timeout'
        | 'withCredentials'
        | 'headers'
        | 'maxRetries'
        | 'retryableStatuses'
        | 'idempotentMethods'
    >
>

export const DEFAULT_CLIENT_CONFIG: Readonly<ClientDefaults> = Object.freeze({
    baseURL: API_BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: false,
    headers: new AxiosHeaders(DEFAULT_HEADERS),
    ...DEFAULT_RETRY_POLICY,
})

// ─── Module-level refresh lock ────────────────────────────────────────────────

let sharedRefreshPromise: Promise<string> | null = null
let sessionExpiredEmitted: boolean = false

// ─── Utils ────────────────────────────────────────────────────────────────────

function backoffDelay(retryCount: number): number {
    const base = 2 ** retryCount * RETRY_BASE_DELAY_MS
    const jitter = base * 0.25 * (Math.random() * 2 - 1)
    return Math.round(base + jitter)
}

function sleep(ms: number, signal?: AbortSignal | null): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'))
            return
        }

        const cleanup = () => signal?.removeEventListener('abort', onAbort)

        const onAbort = () => {
            clearTimeout(timer)
            cleanup()
            reject(new DOMException('Aborted', 'AbortError'))
        }
        const timer = setTimeout(() => {
            cleanup()
            resolve()
        }, ms)

        signal?.addEventListener('abort', onAbort, { once: true })
    })
}

function parseErrorCode(response: AxiosResponse | undefined): string | undefined {
    return (response?.data as ApiResponse | undefined)?.Error?.ErrorCode
}

function toHeadersRecord(headers: unknown): Record<string, string> {
    if (!headers) return {}
    if (headers instanceof AxiosHeaders) return headers.toJSON() as Record<string, string>
    return headers as Record<string, string>
}

function serializeParams(params: unknown): string {
    const sp = new URLSearchParams()
    for (const [key, value] of Object.entries(params as QueryParams)) {
        if (value == null) continue
        if (Array.isArray(value)) value.forEach((v) => sp.append(key, String(v)))
        else sp.append(key, String(value))
    }
    return sp.toString()
}

// ─── Config resolver ──────────────────────────────────────────────────────────

type ResolvedConfig = RequestConfig & { readonly policy: typeof DEFAULT_RETRY_POLICY }

function resolveConfig(
    config: Partial<ClientDefaults>,
    override: Partial<ClientDefaults> = {},
): ResolvedConfig {
    const merged = {
        ...DEFAULT_CLIENT_CONFIG,
        ...config,
        ...override,
        headers: new AxiosHeaders({
            ...DEFAULT_CLIENT_CONFIG.headers.toJSON(),
            ...toHeadersRecord(config.headers),
            ...toHeadersRecord(override.headers),
        }),
    }
    return {
        ...merged,
        policy: Object.freeze({
            maxRetries: merged.maxRetries,
            retryableStatuses: new Set(merged.retryableStatuses),
            idempotentMethods: new Set(merged.idempotentMethods),
        }),
    } as ResolvedConfig
}

// ─── BaseClient ───────────────────────────────────────────────────────────────

export class BaseClient {
    protected readonly resolved: ResolvedConfig

    protected instance: AxiosInstance | null = null

    constructor(config: Partial<ClientDefaults> = {}) {
        this.resolved = resolveConfig(config)
    }

    resetSession(): void {
        sessionExpiredEmitted = false
    }

    protected get http(): AxiosInstance {
        if (!this.instance) {
            const { baseURL, timeout, withCredentials, headers } = this.resolved
            this.instance = axios.create({ baseURL, timeout, withCredentials, headers })
            this.instance.interceptors.request.use((c) => this.handleRequest(c as RequestConfig))
            this.instance.interceptors.response.use(
                (res) => res,
                (err: unknown) => this.runErrorPipeline(err),
            )
        }
        return this.instance
    }

    // ─── Request interceptor ──────────────────────────────────────────────────

    private async handleRequest(reqConfig: RequestConfig): Promise<RequestConfig> {
        const headers =
            reqConfig.headers instanceof AxiosHeaders
                ? reqConfig.headers
                : new AxiosHeaders(reqConfig.headers as Record<string, string> | undefined)

        headers.set(HTTP_HEADER.REQUEST_ID, crypto.randomUUID())
        headers.set(HTTP_HEADER.TIMEZONE, Intl.DateTimeFormat().resolvedOptions().timeZone)

        const token = tokenStorageService.getAccessToken()
        if (token && !reqConfig.skipAuth) headers.set(HTTP_HEADER.AUTHORIZATION, `Bearer ${token}`)

        reqConfig.headers = headers
        log.debug(`→ ${reqConfig.method?.toUpperCase()} ${reqConfig.url}`)

        return this.onRequest(reqConfig)
    }

    protected async onRequest(reqConfig: RequestConfig): Promise<RequestConfig> {
        return reqConfig
    }

    // ─── Error pipeline ───────────────────────────────────────────────────────

    private async runErrorPipeline(error: unknown): Promise<AxiosResponse> {
        if (!(error instanceof AxiosError) || !error.config) return Promise.reject(error)

        const reqConfig = error.config as RequestConfig

        try {
            await this.beforeError(error)
        } catch (hookError) {
            return Promise.reject(hookError)
        }

        const isTokenExpired =
            error.response?.status === 401 &&
            parseErrorCode(error.response) === ERROR_CODES.ACCESS_TOKEN_EXPIRED &&
            !reqConfig.skipAuthRefresh

        if (isTokenExpired) return this.handleRefresh(error, reqConfig)
        if (this.shouldRetry(reqConfig, error)) return this.scheduleRetry(error, reqConfig)

        return Promise.reject(error)
    }

    protected async beforeError(_error: AxiosError): Promise<void> {}

    // ─── Retry ────────────────────────────────────────────────────────────────

    private shouldRetry(reqConfig: RequestConfig, error: AxiosError): boolean {
        const policy = this.resolved.policy
        const maxRetries = reqConfig.maxRetries ?? policy.maxRetries
        const idempotentMethods = reqConfig.idempotentMethods ?? policy.idempotentMethods
        const retryableStatuses = reqConfig.retryableStatuses ?? policy.retryableStatuses
        const method = reqConfig.method?.toLowerCase() ?? ''
        return (
            (reqConfig.retryCount ?? 0) < maxRetries &&
            idempotentMethods.has(method) &&
            (!error.response || retryableStatuses.has(error.response.status))
        )
    }

    private async scheduleRetry(
        error: AxiosError,
        reqConfig: RequestConfig,
    ): Promise<AxiosResponse> {
        reqConfig.retryCount = (reqConfig.retryCount ?? 0) + 1
        const delay = backoffDelay(reqConfig.retryCount)
        const maxRetries = reqConfig.maxRetries ?? this.resolved.policy.maxRetries
        log.warn(`↻ Retry ${reqConfig.retryCount}/${maxRetries} +${delay}ms — ${reqConfig.url}`)
        await sleep(delay, reqConfig.signal as AbortSignal | null)
        return this.http.request(reqConfig)
    }

    // ─── Token refresh ────────────────────────────────────────────────────────

    private async handleRefresh(
        error: AxiosError,
        reqConfig: RequestConfig,
    ): Promise<AxiosResponse> {
        if (reqConfig.isRetryAfterRefresh) {
            this.expireSession()
            return Promise.reject(error)
        }

        reqConfig.isRetryAfterRefresh = true
        sharedRefreshPromise ??= this.doRefreshToken().finally(() => {
            sharedRefreshPromise = null
        })

        const token = await sharedRefreshPromise
        if (!(reqConfig.headers instanceof AxiosHeaders)) {
            reqConfig.headers = new AxiosHeaders(
                reqConfig.headers as Record<string, string> | undefined,
            )
        }
        reqConfig.headers.set(HTTP_HEADER.AUTHORIZATION, `Bearer ${token}`)
        reqConfig.retryCount = 0
        return this.http.request(reqConfig)
    }

    private async doRefreshToken(): Promise<string> {
        try {
            return await refreshTokenApi.refreshToken()
        } catch (err) {
            log.error('[BaseClient] Token refresh failed', err)
            this.expireSession()
            throw err
        }
    }

    protected expireSession(): void {
        if (sessionExpiredEmitted) return
        sessionExpiredEmitted = true
        tokenStorageService.clear()
        apiEvents.emit(API_EVENT.SESSION_EXPIRED)
    }

    // ─── HTTP Methods ─────────────────────────────────────────────────────────

    get<T>(url: string, params?: object, reqConfig?: Partial<RequestConfig>): Promise<T> {
        const serializer = reqConfig?.paramsSerializer ?? (params ? serializeParams : undefined)
        return this.http
            .get<T>(url, { params, paramsSerializer: serializer, ...reqConfig })
            .then((r) => r.data)
    }

    post<T, D = unknown>(url: string, data?: D, reqConfig?: Partial<RequestConfig>): Promise<T> {
        return this.http.post<T>(url, data, reqConfig).then((r) => r.data)
    }

    put<T, D = unknown>(url: string, data?: D, reqConfig?: Partial<RequestConfig>): Promise<T> {
        return this.http.put<T>(url, data, reqConfig).then((r) => r.data)
    }

    patch<T, D = unknown>(url: string, data?: D, reqConfig?: Partial<RequestConfig>): Promise<T> {
        return this.http.patch<T>(url, data, reqConfig).then((r) => r.data)
    }

    delete<T>(url: string, reqConfig?: Partial<RequestConfig>): Promise<T> {
        return this.http.delete<T>(url, reqConfig).then((r) => r.data)
    }
}

export const baseClient = new BaseClient()
