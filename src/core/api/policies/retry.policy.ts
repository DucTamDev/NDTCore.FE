import type { AxiosError, AxiosInstance } from 'axios'
import type { ApiInternalConfig } from '@/core/api/types/api.types'
import { HTTP_CONFIG } from '@/core/api/config/http.config'
import { createLogger } from '@/core/logger/logger'

const log = createLogger('api')

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const RETRYABLE_STATUSES = new Set([
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
])

const IDEMPOTENT_METHODS = new Set(['get', 'head', 'options', 'put', 'delete'])

export function shouldRetry(error: AxiosError): boolean {
    if (!HTTP_CONFIG.enableRetry) return false

    const config = error.config as ApiInternalConfig | undefined
    if (!config) return false

    const retryCount = config.retryCount ?? 0
    if (retryCount >= HTTP_CONFIG.maxRetries) return false

    const method = config.method?.toLowerCase() ?? ''
    if (!IDEMPOTENT_METHODS.has(method)) return false

    if (!error.response) return true

    return RETRYABLE_STATUSES.has(error.response.status)
}

export async function retryRequest(error: AxiosError, client: AxiosInstance): Promise<unknown> {
    const config = error.config as ApiInternalConfig

    config.retryCount = (config.retryCount ?? 0) + 1

    const delay = 2 ** config.retryCount * 1_000

    log.warn(`Retry ${config.retryCount}/${HTTP_CONFIG.maxRetries} after ${delay}ms`, config.url)

    await sleep(delay)

    return client.request(config)
}
