export const STORAGE_TYPE = {
    LOCAL: 'local',
    SESSION: 'session',
} as const

export type StorageType = (typeof STORAGE_TYPE)[keyof typeof STORAGE_TYPE]

export const STORAGE_KEYS = {
    AUTH_TOKENS: 'auth.tokens',
    USER: 'auth.user',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
