export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30_000,
    withCredentials: import.meta.env.VITE_API_WITH_CREDS === 'true',
    enableLogging: import.meta.env.DEV,
    enableRetry: true,
    maxRetries: 3,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
} as const
