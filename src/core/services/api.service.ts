// core/services/api.service.ts
import axios, {
    type AxiosInstance,
    type AxiosResponse,
    AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiResponse, PagedApiResponse, RequestConfig, QueryParams } from '../types/api.types'
import { API_CONFIG } from '../config/api.config'
import { AuthService } from './auth.service.ts'
import { LoadingService } from './loading.service'
import { ErrorHandler } from '../utils/error-handler'
import { Logger } from '../utils/logger'

class ApiService {
    private readonly axiosInstance: AxiosInstance
    private readonly tokenService: AuthService
    private readonly loadingService: LoadingService
    private readonly logger: Logger
    private requestCache: Map<string, { data: any; timestamp: number }>

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.baseURL,
            timeout: API_CONFIG.timeout,
            headers: API_CONFIG.headers,
            withCredentials: API_CONFIG.withCredentials,
        })

        this.tokenService = AuthService.getInstance()
        this.loadingService = LoadingService.getInstance()
        this.logger = new Logger('ApiService')
        this.requestCache = new Map()

        this.setupInterceptors()
    }

    private setupInterceptors(): void {
        // Request Interceptor
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const customConfig = config as RequestConfig

                // Add authorization token
                if (!customConfig.skipAuth) {
                    const token = this.tokenService.getAccessToken()
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`
                    }
                }

                // Add request tracking
                config.headers['X-Request-ID'] = this.generateRequestId()
                config.headers['X-Client-Version'] = import.meta.env.VITE_APP_VERSION || '1.0.0'

                // Show loading
                if (customConfig.showLoading !== false) {
                    this.loadingService.show()
                }

                // Logging
                if (API_CONFIG.enableLogging) {
                    this.logger.info('Request', {
                        method: config.method?.toUpperCase(),
                        url: config.url,
                        params: config.params,
                        data: config.data,
                    })
                }

                return config
            },
            (error: AxiosError) => {
                this.loadingService.hide()
                this.logger.error('Request Error', error)
                return Promise.reject(error)
            },
        )

        // Response Interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                this.loadingService.hide()

                if (API_CONFIG.enableLogging) {
                    this.logger.info('Response', {
                        status: response.status,
                        data: response.data,
                    })
                }

                return response
            },
            async (error: AxiosError<ApiResponse>) => {
                this.loadingService.hide()

                const config = error.config as RequestConfig

                // Handle token refresh
                if (error.response?.status === 401 && !config?.skipAuth) {
                    return this.handleTokenRefresh(error)
                }

                // Handle retry logic
                if (this.shouldRetry(error)) {
                    return this.retryRequest(error)
                }

                // Handle errors
                if (!config?.skipErrorNotification) {
                    ErrorHandler.handle(error)
                }

                this.logger.error('Response Error', error)
                return Promise.reject(error)
            },
        )
    }

    private async handleTokenRefresh(error: AxiosError): Promise<any> {
        try {
            const refreshToken = this.tokenService.getRefreshToken()
            if (!refreshToken) {
                this.tokenService.clearTokens()
                window.location.href = '/login'
                return Promise.reject(error)
            }

            // Refresh token
            const response = await this.axiosInstance.post<
                ApiResponse<{ accessToken: string; refreshToken: string }>
            >('/auth/refresh-token', { refreshToken }, { skipAuth: true } as RequestConfig)

            if (response.data.isSuccess && response.data.Data) {
                this.tokenService.setTokens(
                    response.data.Data.accessToken,
                    response.data.Data.refreshToken,
                )

                // Retry original request
                const originalRequest = error.config!
                originalRequest.headers.Authorization = `Bearer ${response.data.Data.accessToken}`
                return this.axiosInstance(originalRequest)
            }

            throw new Error('Token refresh failed')
        } catch (refreshError) {
            this.tokenService.clearTokens()
            window.location.href = '/login'
            return Promise.reject(refreshError)
        }
    }

    private shouldRetry(error: AxiosError): boolean {
        if (!API_CONFIG.enableRetry) return false

        const config = error.config as any
        const retryCount = config.__retryCount || 0

        return (
            retryCount < API_CONFIG.maxRetries && (!error.response || error.response.status >= 500)
        )
    }

    private async retryRequest(error: AxiosError): Promise<any> {
        const config = error.config as any
        config.__retryCount = (config.__retryCount || 0) + 1

        const delay = Math.pow(2, config.__retryCount) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))

        this.logger.warn(`Retrying request (${config.__retryCount}/${API_CONFIG.maxRetries})`, {
            url: config.url,
        })

        return this.axiosInstance(config)
    }

    private generateRequestId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    private getCacheKey(url: string, params?: QueryParams): string {
        return `${url}-${JSON.stringify(params || {})}`
    }

    private getFromCache(key: string, cacheTime: number = 300000): any | null {
        const cached = this.requestCache.get(key)
        if (!cached) return null

        const isExpired = Date.now() - cached.timestamp > cacheTime
        if (isExpired) {
            this.requestCache.delete(key)
            return null
        }

        return cached.data
    }

    private setCache(key: string, data: any): void {
        this.requestCache.set(key, {
            data,
            timestamp: Date.now(),
        })
    }

    // Public Methods

    public async get<T = any>(
        url: string,
        params?: QueryParams,
        config?: RequestConfig,
    ): Promise<ApiResponse<T>> {
        // Check cache
        if (config?.cache) {
            const cacheKey = this.getCacheKey(url, params)
            const cached = this.getFromCache(cacheKey, config.cacheTime)
            if (cached) {
                this.logger.info('Cache hit', { url, params })
                return cached
            }
        }

        const response = await this.axiosInstance.get<ApiResponse<T>>(url, {
            params,
            ...config,
        })

        // Set cache
        if (config?.cache) {
            const cacheKey = this.getCacheKey(url, params)
            this.setCache(cacheKey, response.data)
        }

        return response.data
    }

    public async getPaged<T = any>(
        url: string,
        params?: QueryParams,
        config?: RequestConfig,
    ): Promise<PagedApiResponse<T>> {
        const response = await this.axiosInstance.get<PagedApiResponse<T>>(url, {
            params,
            ...config,
        })
        return response.data
    }

    public async post<T = any, D = any>(
        url: string,
        data?: D,
        config?: RequestConfig,
    ): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config)
        return response.data
    }

    public async put<T = any, D = any>(
        url: string,
        data?: D,
        config?: RequestConfig,
    ): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config)
        return response.data
    }

    public async patch<T = any, D = any>(
        url: string,
        data?: D,
        config?: RequestConfig,
    ): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config)
        return response.data
    }

    public async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config)
        return response.data
    }

    public clearCache(): void {
        this.requestCache.clear()
        this.logger.info('Cache cleared')
    }
}

export const apiService = new ApiService()
