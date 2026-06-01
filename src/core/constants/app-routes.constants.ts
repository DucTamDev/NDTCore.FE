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
            FRANCHISEES: {
                NAME: 'admin:franchisees',
                PATH: 'franchisees',
            },
            FRANCHISEE_DETAIL: {
                NAME: 'admin:franchisee-detail',
                PATH: 'franchisees/:id',
            },
            STORES: {
                NAME: 'admin:stores',
                PATH: 'stores',
            },
            STORE_DETAIL: {
                NAME: 'admin:store-detail',
                PATH: 'stores/:id',
            },
            STORE_MEMBERS: {
                NAME: 'admin:store-members',
                PATH: 'store-members',
            },
        },
    },

    PRODUCT: {
        PRODUCTS: {
            NAME: 'admin:products',
            PATH: 'products',
        },
        PRODUCT_DETAIL: {
            NAME: 'admin:product-detail',
            PATH: 'products/:id',
        },
        CATEGORIES: {
            NAME: 'admin:product-categories',
            PATH: 'product/categories',
        },
        TAGS: {
            NAME: 'admin:product-tags',
            PATH: 'product/tags',
        },
        OPTION_GROUPS: {
            NAME: 'admin:product-option-groups',
            PATH: 'product/option-groups',
        },
        OPTIONS: {
            NAME: 'admin:product-options',
            PATH: 'product/options',
        },
    },

    NOT_FOUND: {
        NAME: 'not-found',
        PATH: '/:pathMatch(.*)*',
    },
} as const
