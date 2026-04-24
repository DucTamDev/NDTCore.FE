export const CLIENT_ID = {
    WEB_APP: 'web_app',
    POS_APP: 'pos_app',
    MOBILE_APP: 'mobile_app',
} as const

export type ClientId = (typeof CLIENT_ID)[keyof typeof CLIENT_ID]
