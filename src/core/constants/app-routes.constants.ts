export const APP_ROUTES = {
    HOME: {
        NAME: 'home',
        PATH: '/',
    },

    AUTH: {
        BASE: {
            NAME: 'auth',
            PATH: '/auth',
        },
        CHILDREN: {
            LOGIN: {
                NAME: 'auth:login',
                PATH: 'login',
            },
            REGISTER: {
                NAME: 'auth:register',
                PATH: 'register',
            },
        },
    },

    ADMIN: {
        BASE: {
            NAME: 'admin',
            PATH: '/admin',
        },
        CHILDREN: {
            DASHBOARD: {
                NAME: 'admin:dashboard',
                PATH: '',
            },
            USERS: {
                NAME: 'admin:users',
                PATH: 'users',
            },
            USER_DETAIL: {
                NAME: 'admin:user-detail',
                PATH: 'users/:id',
            },
            BRANDS: {
                NAME: 'admin:brands',
                PATH: 'brands',
            },
            BRAND_DETAIL: {
                NAME: 'admin:brand-detail',
                PATH: 'brands/:id',
            },
        },
    },

    NOT_FOUND: {
        NAME: 'not-found',
        PATH: '/:pathMatch(.*)*',
    },
} as const
