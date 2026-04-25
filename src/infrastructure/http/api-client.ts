import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, PagedApiResponse, QueryParams, RequestConfig, TokenPair } from '@/models/api.models'
import { CLIENT_ID } from '@/constants/client-id'
import { CLIENT_TYPE } from '@/constants/client-type'
import { tokenService } from '@/infrastructure/auth/token.service'
import { API_CONFIG } from '@/infrastructure/config/api.config'
import { handleApiError } from '@/infrastructure/errors/api-error-handler'
import { HTTP_HEADER } from '@/infrastructure/http/http-headers'
import { LoadingService } from '@/infrastructure/http/loading.service'

interface CacheEntry {
  data: unknown
  expiresAt: number
}

interface InternalConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean
  skipErrorNotification?: boolean
  showLoading?: boolean
  __retryCount?: number
}

function log(label: string, data?: unknown): void {
  if (API_CONFIG.enableLogging) console.log(`[API] ${label}`, data ?? '')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface RefreshTokenApiResponse {
  AccessToken: string
  RefreshToken: string
  AccessTokenExpiration: string
  RefreshTokenExpiration: string
}

class ApiClient {
  private readonly http: AxiosInstance
  private readonly loading = LoadingService.getInstance()
  private readonly cache = new Map<string, CacheEntry>()
  private refreshPromise: Promise<TokenPair> | null = null

  constructor() {
    this.http = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: { ...API_CONFIG.headers },
      withCredentials: API_CONFIG.withCredentials,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.http.interceptors.request.use((raw) => {
      const config = raw as InternalConfig

      if (!config.skipAuth) {
        const token = tokenService.getAccessToken()
        if (token) config.headers.Authorization = `Bearer ${token}`
      }

      config.headers[HTTP_HEADER.CLIENT_TYPE] = CLIENT_TYPE.WEB
      config.headers[HTTP_HEADER.CLIENT_ID] = CLIENT_ID.WEB_APP
      config.headers[HTTP_HEADER.REQUEST_ID] = crypto.randomUUID()
      config.headers[HTTP_HEADER.TIMEZONE] = Intl.DateTimeFormat().resolvedOptions().timeZone

      if (config.showLoading !== false) {
        this.loading.show()
      }

      log(`-> ${config.method?.toUpperCase()} ${config.url}`, config.params)
      return config
    })

    this.http.interceptors.response.use(
      (response) => {
        const config = response.config as InternalConfig
        if (config.showLoading !== false) {
          this.loading.hide()
        }
        log(`<- ${response.status} ${response.config.url}`)
        return response
      },
      async (error: AxiosError<ApiResponse>) => {
        const config = error.config as InternalConfig | undefined

        if (config?.showLoading !== false) {
          this.loading.hide()
        }

        if (error.response?.status === 401 && !config?.skipAuth) {
          return this.handle401(error)
        }

        if (this.shouldRetry(error)) {
          return this.retry(error)
        }

        if (!config?.skipErrorNotification) {
          handleApiError(error)
        }

        return Promise.reject(error)
      },
    )
  }

  private async handle401(error: AxiosError): Promise<unknown> {
    const original = error.config as InternalConfig

    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefresh().finally(() => {
        this.refreshPromise = null
      })
    }

    try {
      const tokens = await this.refreshPromise
      original.headers.Authorization = `Bearer ${tokens.accessToken}`
      return this.http(original)
    } catch {
      tokenService.clear()
      window.location.href = '/auth/login'
      return Promise.reject(error)
    }
  }

  private async doRefresh(): Promise<TokenPair> {
    const accessToken = tokenService.getAccessToken()
    const refreshToken = tokenService.getRefreshToken()
    if (!accessToken || !refreshToken) throw new Error('Missing auth tokens')

    const response = await this.http.post<ApiResponse<RefreshTokenApiResponse>>(
      '/api/admin/auth/refresh',
      { AccessToken: accessToken, RefreshToken: refreshToken },
      { skipAuth: true, skipErrorNotification: true, showLoading: false } as RequestConfig,
    )

    if (!response.data.IsSuccess || !response.data.Data) {
      throw new Error(response.data.Message ?? 'Refresh failed')
    }

    const tokens = {
      accessToken: response.data.Data.AccessToken,
      refreshToken: response.data.Data.RefreshToken,
    }

    tokenService.setTokens(tokens)
    return tokens
  }

  private shouldRetry(error: AxiosError): boolean {
    if (!API_CONFIG.enableRetry) return false
    const config = error.config as InternalConfig | undefined
    const retryCount = config?.__retryCount ?? 0
    const isServerError = !error.response || error.response.status >= 500
    return retryCount < API_CONFIG.maxRetries && isServerError
  }

  private async retry(error: AxiosError): Promise<unknown> {
    const config = error.config as InternalConfig
    config.__retryCount = (config.__retryCount ?? 0) + 1

    const waitMs = 2 ** config.__retryCount * 1000
    log(`Retry ${config.__retryCount}/${API_CONFIG.maxRetries} after ${waitMs}ms`, config.url)

    await sleep(waitMs)
    return this.http(config)
  }

  private cacheKey(url: string, params?: QueryParams): string {
    return `${url}::${JSON.stringify(params ?? {})}`
  }

  private fromCache<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry || Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    return entry.data as T
  }

  private toCache(key: string, data: unknown, ttl: number): void {
    this.cache.set(key, { data, expiresAt: Date.now() + ttl })
  }

  async get<T>(url: string, params?: QueryParams, config?: RequestConfig): Promise<ApiResponse<T>> {
    if (config?.cache) {
      const key = this.cacheKey(url, params)
      const hit = this.fromCache<ApiResponse<T>>(key)
      if (hit) return hit
    }

    const response = await this.http.get<ApiResponse<T>>(url, { params, ...config })

    if (config?.cache) {
      this.toCache(this.cacheKey(url, params), response.data, config.cacheTime ?? 300_000)
    }

    return response.data
  }

  async getPaged<T>(
    url: string,
    params?: QueryParams,
    config?: RequestConfig,
  ): Promise<PagedApiResponse<T>> {
    const response = await this.http.get<PagedApiResponse<T>>(url, { params, ...config })
    return response.data
  }

  async post<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async patch<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const apiClient = new ApiClient()
