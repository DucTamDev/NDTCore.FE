export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NDTCore'

export const USER_ROLES = {
    SUPER_ADMIN: 'superadmin',
    ORG_ADMIN: 'orgadmin',
    ORG_CASHIER: 'orgcashier',
    USER: 'user',
    GUEST: 'guest',
} as const

export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 10,
    LIMIT_OPTIONS: [10, 25, 50, 100],
} as const

export const CONFIRM_DIALOG_DEFAULTS = {
    CONFIRM_TEXT: 'Xác nhận',
    CANCEL_TEXT: 'Hủy',
    CONFIRM_COLOR: 'error',
} as const
