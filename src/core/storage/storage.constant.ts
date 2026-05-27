export const STORAGE_KEYS = {
    AUTH_TOKENS: 'auth.tokens',
    USER: 'auth.user',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]