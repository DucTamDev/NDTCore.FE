// core/types/api.types.ts
import type { AxiosRequestConfig } from 'axios'

/**
 * API Response Metadata
 */
export interface ApiResponseMetadata {
    readonly traceId?: string | null
    readonly timestamp?: Date | null
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
    readonly errorCode: string
    readonly message: string | null
    readonly stackTrace?: string | null
    readonly details?: Record<string, any> | null
}

/**
 * Base API Response
 */
export interface ApiResponse<T = object> {
    readonly isSuccess: boolean
    readonly message: string | null
    readonly Data: T | null
    readonly Error: ApiErrorResponse | null
    readonly Metadata: ApiResponseMetadata | null
}

/**
 * Pagination Metadata
 */
export interface PaginationMetadata {
    readonly currentPage: number
    readonly pageSize: number
    readonly totalRecords: number
    readonly totalPages: number
    readonly hasPreviousPage: boolean
    readonly hasNextPage: boolean
}

/**
 * Paginated Collection
 */
export interface PaginatedCollection<T> {
    readonly items: T[]
    readonly paginationMetadata: PaginationMetadata
}

/**
 * Paged API Response
 */
export interface PagedApiResponse<T> extends ApiResponse<T[]> {
    readonly pageNumber: number
    readonly pageSize: number
    readonly totalCount: number
    readonly totalPages: number
    readonly hasPreviousPage: boolean
    readonly hasNextPage: boolean
}

/**
 * Pagination Request Parameters
 */
export interface PaginationRequest {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

/**
 * API Client Configuration
 */
export interface ApiClientConfig {
    baseURL: string
    timeout: number
    headers: Record<string, string>
    withCredentials: boolean
    enableLogging: boolean
    enableRetry: boolean
    maxRetries: number
}

/**
 * Request Configuration (extends Axios config)
 */
export interface RequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean
    skipErrorNotification?: boolean
    showLoading?: boolean
    cache?: boolean
    cacheTime?: number
}

/**
 * Query Parameters
 */
export interface QueryParams extends Record<string, any> {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
    [key: string]: any
}
