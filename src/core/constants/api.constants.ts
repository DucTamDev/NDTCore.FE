export const API_ENDPOINTS = {
    IDENTITY: {
        AUTH_API: {
            LOGIN: '/admin/auth/login',
            REFRESH: '/admin/auth/refresh',
            REGISTER: 'admin/auth/register',
        },
        USERS_API: {
            GET_PAGED: '/admin/users',
            GET_PROFILE: 'admin/users/profile',
        },
    },
    BRAND: {
        BRAND_API: {
            GET_PAGED: '/admin/brand',
            CREATE: '/admin/brand',
            GET_BY_ID: (id: number) => `/admin/brand/${id}`,
            UPDATE: (id: number) => `/admin/brand/${id}`,
            UPDATE_STATUS: (id: number) => `/admin/brand/${id}/status`,
            DELETE: (id: number) => `/admin/brand/${id}`,
            GET_BY_USER_ID: (userId: string) => `/admin/brand/by-user/${userId}`,
            GET_MEMBERS: (id: number) => `/admin/brand/${id}/users`,
            ASSIGN_USERS: (id: number) => `/admin/brand/${id}/users`,
            REMOVE_USER: (id: number, userId: string) => `/admin/brand/${id}/users/${userId}`,
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
