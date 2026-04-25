import type { AxiosRequestConfig } from 'axios'

export type QueryParams = Record<string, string | number | boolean | null | undefined>

export interface ApiError {
  ErrorCode: string
  Message: string | null
  StackTrace: string | null
  Meta: Record<string, string> | null
}

export interface ApiResponseMetadata {
  TraceId: string | null
  Timestamp: string | null
}

export interface ApiResponse<T = unknown> {
  IsSuccess: boolean
  IsFailure: boolean
  Data: T | null
  Message: string | null
  Error: ApiError | null
  Metadata: ApiResponseMetadata | null
}

export interface PagedApiResponse<T> extends ApiResponse<T[]> {
  PageNumber: number
  PageSize: number
  TotalCount: number
  TotalPages: number
  HasPreviousPage: boolean
  HasNextPage: boolean
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorNotification?: boolean
  showLoading?: boolean
  cache?: boolean
  cacheTime?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}
