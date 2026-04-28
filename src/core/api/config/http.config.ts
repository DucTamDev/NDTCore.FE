const getEnvNumber = (value: unknown, fallback: number): number => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

const getEnvString = (value: unknown, fallback = ''): string => {
    return typeof value === 'string' && value.length > 0 ? value : fallback
}

export const HTTP_CONFIG = {
    baseURL: getEnvString(import.meta.env.VITE_API_BASE_URL),
    timeout: getEnvNumber(import.meta.env.VITE_API_TIMEOUT, 30000),

    enableRetry: true,
    maxRetries: 3,

    withCredentials: false,
} as const
