export const API_ENDPOINTS = {
    IDENTITY: {
        AUTH_API: {
            LOGIN: '/admin/auth/login',
            REFRESH: '/admin/auth/refresh',
            REGISTER: 'admin/auth/register',
        },
        USERS_API: {
            GET_PAGED: '/admin/users',
            GET_ME: 'admin/users/me',
        },
    },
    STORE: {
        STORE_API: {
            GET_PAGED: '/stores',
        },
    },
    ORDER: {
        ORDER_API: {},
    },
} as const
