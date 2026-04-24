export const CLIENT_TYPE = {
    WEB: 'web',
    MOBILE: 'mobile',
    POS: 'pos',
} as const

export type ClientType = (typeof CLIENT_TYPE)[keyof typeof CLIENT_TYPE]
