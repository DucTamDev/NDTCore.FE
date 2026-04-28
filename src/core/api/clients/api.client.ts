// src/core/api/clients/api.client.ts
import axios, {
    AxiosError,
    AxiosHeaders,
    type AxiosInstance,
    type AxiosRequestConfig,
    type CreateAxiosDefaults,
} from 'axios'

import type { QueryParams, ApiInternalConfig, QueueItem } from '@/core/api/types/api.types'
import { HTTP_CONFIG } from '@/core/api/config/http.config'
import { retryRequest, shouldRetry } from '@/core/api/policies/retry.policy'
import type { ApiResponse } from '@/core/api/dtos/common.dtos'
import { tokenStorageService } from '@/core/storage/token-storage.service'
import { ERROR_CODES, HTTP_HEADER } from '@/core/constants/http.constants'
import { CLIENT_ID, CLIENT_TYPE } from '@/core/constants/client-type.constants'
import { createLogger } from '@/core/logger/logger'
import { API_EVENT, apiEvents } from '@/core/events/api.events'
import type { AuthTokenModel } from '@/models/auth.model'
import { STORAGE_TYPE } from '@/core/storage/storage.keys'
import type { RefreshTokenRequest, RefreshTokenResponse } from '@/core/api/dtos/auth.dtos'
import { API_ENDPOINTS } from '@/core/constants/api.constants'

const log = createLogger('api')

export type OnTokenRefreshed = (token: AuthTokenModel) => void

export class ApiClient {
    protected readonly httpClient: AxiosInstance

    private isRefreshing = false
    private readonly queue: QueueItem[] = []
    private readonly onTokenRefreshed?: OnTokenRefreshed

    constructor(config?: Partial<CreateAxiosDefaults>, onTokenRefreshed?: OnTokenRefreshed) {
        this.httpClient = axios.create({ ...HTTP_CONFIG, ...config })
        this.onTokenRefreshed = onTokenRefreshed
        this.setupRequestInterceptor()
        this.setupResponseInterceptor()
    }

    // ─────────────────────────────────────────────
    // PRIVATE
    // ─────────────────────────────────────────────

    private flushQueue(error: unknown, token: string | null = null): void {
        while (this.queue.length) {
            const item = this.queue.shift()!
            token ? item.resolve(token) : item.reject(error)
        }
    }

    private setAuthHeader(config: ApiInternalConfig, token: string): void {
        config.headers ??= new AxiosHeaders()
        config.headers.set(HTTP_HEADER.AUTHORIZATION, `Bearer ${token}`)
    }

    private async callRefreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
        const accessToken = tokenStorageService.getAccessToken()
        const refreshToken = tokenStorageService.getRefreshToken()

        if (!refreshToken) throw new Error('Missing refresh token')

        const payload: RefreshTokenRequest = {
            AccessToken: accessToken,
            RefreshToken: refreshToken,
        }

        const { data } = await axios.post<ApiResponse<RefreshTokenResponse>>(
            `${import.meta.env.VITE_IDENTITY_API_URL}${API_ENDPOINTS.IDENTITY.AUTH_API.REFRESH}`,
            payload,
            { headers: { [HTTP_HEADER.CONTENT_TYPE]: 'application/json' } },
        )

        return data
    }

    private async handleRefresh(error: AxiosError<ApiResponse>): Promise<unknown> {
        const failedConfig = error.config as ApiInternalConfig

        if (failedConfig._isRetry) return Promise.reject(error)
        failedConfig._isRetry = true

        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.queue.push({
                    resolve: (token) => {
                        this.setAuthHeader(failedConfig, token as string)
                        resolve(this.httpClient.request(failedConfig))
                    },
                    reject,
                })
            })
        }

        this.isRefreshing = true

        try {
            const response = await this.callRefreshToken()
            const data = response.Data

            if (
                !data?.AccessToken ||
                !data?.RefreshToken ||
                !data?.AccessTokenExpiration ||
                !data?.RefreshTokenExpiration
            ) {
                throw new Error('Invalid refresh response')
            }

            const authToken: AuthTokenModel = {
                accessToken: data.AccessToken,
                refreshToken: data.RefreshToken,
                accessTokenExpiration: data.AccessTokenExpiration,
                refreshTokenExpiration: data.RefreshTokenExpiration,
            }

            tokenStorageService.save(authToken)
            log.info('Token refreshed')

            this.onTokenRefreshed?.(authToken)
            this.flushQueue(null, data.AccessToken)
            this.setAuthHeader(failedConfig, data.AccessToken)

            return this.httpClient.request(failedConfig)
        } catch (err) {
            log.warn('Refresh token failed', err)
            tokenStorageService.clear() // 1. clear token
            this.flushQueue(err) // 2. reject queue
            apiEvents.emit(API_EVENT.SESSION_EXPIRED) // 3. notify app
            return Promise.reject(err)
        } finally {
            this.isRefreshing = false
        }
    }

    // ─────────────────────────────────────────────
    // INTERCEPTORS
    // ─────────────────────────────────────────────

    private setupRequestInterceptor(): void {
        this.httpClient.interceptors.request.use((raw) => {
            const config = raw as ApiInternalConfig
            config.headers ??= new AxiosHeaders()

            config.headers.set(HTTP_HEADER.CONTENT_TYPE, 'application/json')
            config.headers.set(HTTP_HEADER.ACCEPT, 'application/json')
            config.headers.set(HTTP_HEADER.CLIENT_TYPE, CLIENT_TYPE.WEB)
            config.headers.set(HTTP_HEADER.CLIENT_ID, CLIENT_ID.WEB_APP)
            config.headers.set(
                HTTP_HEADER.TIMEZONE,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
            )
            config.headers.set(HTTP_HEADER.REQUEST_ID, crypto.randomUUID())

            const token = tokenStorageService.getAccessToken()
            if (token && !config.skipAuth) {
                this.setAuthHeader(config, token)
            }

            log.request(`→ ${config.method?.toUpperCase()?.padEnd(6)} ${config.url}`, config.params)
            return config
        })
    }

    private setupResponseInterceptor(): void {
        this.httpClient.interceptors.response.use(
            (response) => {
                log.response(`← ${response.status} ${response.config.url}`)
                return response
            },
            async (error: AxiosError<ApiResponse>) => {
                const config = error.config as ApiInternalConfig | undefined
                const status = error.response?.status
                const errorCode = error.response?.data?.Error?.ErrorCode

                const shouldRefresh =
                    config &&
                    !config.skipAuthRefresh &&
                    status === 401 &&
                    errorCode === ERROR_CODES.TOKEN_EXPIRED

                if (shouldRefresh) return this.handleRefresh(error)
                if (shouldRetry(error)) return retryRequest(error, this.httpClient)

                return Promise.reject(error)
            },
        )
    }

    // ─────────────────────────────────────────────
    // HTTP METHODS
    // ─────────────────────────────────────────────

    async get<T>(
        url: string,
        params?: QueryParams,
        config?: Partial<ApiInternalConfig>,
    ): Promise<T> {
        return (await this.httpClient.get<T>(url, { params, ...config })).data
    }

    async post<T, D = unknown>(
        url: string,
        data?: D,
        config?: Partial<ApiInternalConfig>,
    ): Promise<T> {
        return (await this.httpClient.post<T>(url, data, config)).data
    }

    async put<T, D = unknown>(
        url: string,
        data?: D,
        config?: Partial<ApiInternalConfig>,
    ): Promise<T> {
        return (await this.httpClient.put<T>(url, data, config)).data
    }

    async patch<T, D = unknown>(
        url: string,
        data?: D,
        config?: Partial<ApiInternalConfig>,
    ): Promise<T> {
        return (await this.httpClient.patch<T>(url, data, config)).data
    }

    async delete<T>(url: string, config?: Partial<ApiInternalConfig>): Promise<T> {
        return (await this.httpClient.delete<T>(url, config)).data
    }
}

export const apiClient = new ApiClient()
