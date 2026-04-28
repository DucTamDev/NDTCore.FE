import type { InternalAxiosRequestConfig } from 'axios'

export interface ApiInternalConfig extends InternalAxiosRequestConfig {
    skipAuth?: boolean
    skipAuthRefresh?: boolean
    skipGlobalError?: boolean

    _isRetry?: boolean
    retryCount?: number

    timeout?: number
    requestId?: string

    metadata?: Record<string, unknown>
}

export interface QueueItem {
    resolve: (value: unknown) => void
    reject: (error?: unknown) => void
}

export type QueryPrimitive = string | number | boolean

export type QueryParams = {
    [key: string]: QueryPrimitive | QueryPrimitive[] | null | undefined
}
