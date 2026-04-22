import type { ApiClientConfig } from '../types/api.types'

export const API_CONFIG: ApiClientConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
    enableLogging: import.meta.env.DEV,
    enableRetry: true,
    maxRetries: 3,
}
