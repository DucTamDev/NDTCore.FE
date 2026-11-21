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
            GET_BY_ID: (id: string) => `/admin/users/${id}`,
            CREATE: '/admin/users',
            UPDATE: (id: string) => `/admin/users/${id}`,
            DELETE: (id: string) => `/admin/users/${id}`,
            ASSIGN_ROLES: (id: string) => `/admin/users/${id}/roles`,
        },
    },
    BRAND: {
        BRAND_API: {
            GET_PAGED: '/admin/brands',
            CREATE: '/admin/brands',
            GET_BY_ID: (id: number) => `/admin/brands/${id}`,
            UPDATE: (id: number) => `/admin/brands/${id}`,
            UPDATE_STATUS: (id: number) => `/admin/brands/${id}/status`,
            DELETE: (id: number) => `/admin/brands/${id}`,
            GET_BY_USER_ID: (userId: string) => `/admin/brands/by-user/${userId}`,
            GET_MEMBERS: (id: number) => `/admin/brands/${id}/users`,
            ASSIGN_USERS: (id: number) => `/admin/brands/${id}/users`,
            REMOVE_USER: (id: number, userId: string) => `/admin/brands/${id}/users/${userId}`,
        },
        FRANCHISEE_API: {
            GET_PAGED: '/admin/franchisees',
            GET_BY_ID: (id: number) => `/admin/franchisees/${id}`,
            GET_BY_USER_ID: (userId: string) => `/admin/franchisees/by-user/${userId}`,
            GET_BY_BRAND_ID: (brandId: number) => `/admin/franchisees/by-brand/${brandId}`,
            CREATE: '/admin/franchisees',
            UPDATE: (id: number) => `/admin/franchisees/${id}`,
            DELETE: (id: number) => `/admin/franchisees/${id}`,
            GET_MEMBERS: (id: number) => `/admin/franchisees/${id}/users`,
            ASSIGN_USERS: (id: number) => `/admin/franchisees/${id}/users`,
            REMOVE_USER: (id: number, userId: string) => `/admin/franchisees/${id}/users/${userId}`,
        },
    },
    STORE: {
        STORE_API: {
            GET_PAGED: '/admin/stores',
            CREATE: '/admin/stores',
            GET_BY_ID: (id: number) => `/admin/stores/${id}`,
            UPDATE: (id: number) => `/admin/stores/${id}`,
            DELETE: (id: number) => `/admin/stores/${id}`,
        },
        STORE_MEMBER_API: {
            GET_BY_STORE: (storeId: number) => `/admin/stores/${storeId}/members`,
            ASSIGN: (storeId: number) => `/admin/stores/${storeId}/members`,
            REMOVE: (storeId: number, userId: string) => `/admin/stores/${storeId}/members/${userId}`,
        },
    },
    ORDER: {
        POS_API: {
            GET_STORE_STATUS: (storeId: number) => `/pos/store/${storeId}/status`,
            GET_CATALOG: (storeId: number) => `/pos/store/${storeId}/catalog`,
            GET_NEXT_ORDER_NUMBER: (storeId: number) => `/pos/store/${storeId}/next-order-number`,
            CREATE_ORDER: '/pos/orders',
            GET_ORDER_HISTORY: (storeId: number) => `/pos/store/${storeId}/orders`,
            GET_ORDER_BY_ID: (id: number) => `/pos/orders/${id}`,
        },
        ADMIN_API: {
            GET_PAGED: '/admin/orders',
            GET_BY_ID: (id: number) => `/admin/orders/${id}`,
            UPDATE_STATUS: (id: number) => `/admin/orders/${id}/status`,
            CANCEL: (id: number) => `/admin/orders/${id}/cancel`,
        },
    },
    PRODUCT: {
        CATEGORY_API: {
            GET_PAGED: '/admin/categories',
            GET_PARENTS: '/admin/categories/parents',
            CREATE: '/admin/categories',
            GET_BY_ID: (id: number) => `/admin/categories/${id}`,
            UPDATE: (id: number) => `/admin/categories/${id}`,
            DELETE: (id: number) => `/admin/categories/${id}`,
        },
        TAG_API: {
            GET_PAGED: '/admin/tags',
            CREATE: '/admin/tags',
            GET_BY_ID: (id: number) => `/admin/tags/${id}`,
            UPDATE: (id: number) => `/admin/tags/${id}`,
            DELETE: (id: number) => `/admin/tags/${id}`,
        },
        OPTION_GROUP_API: {
            GET_PAGED: '/admin/option-groups',
            CREATE: '/admin/option-groups',
            GET_BY_ID: (id: number) => `/admin/option-groups/${id}`,
            GET_OPTIONS: (id: number) => `/admin/option-groups/${id}/options`,
            UPDATE: (id: number) => `/admin/option-groups/${id}`,
            DELETE: (id: number) => `/admin/option-groups/${id}`,
        },
        OPTION_API: {
            GET_PAGED: '/admin/options',
            CREATE: '/admin/options',
            GET_BY_ID: (id: number) => `/admin/options/${id}`,
            UPDATE: (id: number) => `/admin/options/${id}`,
            DELETE: (id: number) => `/admin/options/${id}`,
            // Plan E — store overrides
            GET_STORE_AVAILABILITY: (id: number) => `/admin/options/${id}/store-availability`,
            UPSERT_STORE_AVAILABILITY: (id: number) => `/admin/options/${id}/store-availability`,
            REMOVE_STORE_AVAILABILITY: (id: number, storeId: number) => `/admin/options/${id}/store-availability/${storeId}`,
            UPSERT_STORE_PRICE: (id: number) => `/admin/options/${id}/store-prices`,
            REMOVE_STORE_PRICE: (id: number, storeId: number) => `/admin/options/${id}/store-prices/${storeId}`,
        },
        PRODUCT_API: {
            GET_PAGED: '/admin/products',
            CREATE: '/admin/products',
            GET_BY_ID: (id: number) => `/admin/products/${id}`,
            UPDATE: (id: number) => `/admin/products/${id}`,
            DELETE: (id: number) => `/admin/products/${id}`,
            ADD_IMAGE: (id: number) => `/admin/products/${id}/images`,
            DELETE_IMAGE: (id: number, imageId: number) => `/admin/products/${id}/images/${imageId}`,
            // Plan D — relations
            GET_TAGS: (id: number) => `/admin/products/${id}/tags`,
            ASSIGN_TAG: (id: number) => `/admin/products/${id}/tags`,
            REMOVE_TAG: (id: number, tagId: number) => `/admin/products/${id}/tags/${tagId}`,
            GET_OPTION_GROUPS: (id: number) => `/admin/products/${id}/option-groups`,
            ASSIGN_OPTION_GROUP: (id: number) => `/admin/products/${id}/option-groups`,
            UPDATE_OPTION_GROUP: (id: number, groupId: number) => `/admin/products/${id}/option-groups/${groupId}`,
            REMOVE_OPTION_GROUP: (id: number, groupId: number) => `/admin/products/${id}/option-groups/${groupId}`,
            GET_OPTION_CONFIGS: (id: number) => `/admin/products/${id}/option-configs`,
            UPSERT_OPTION_CONFIG: (id: number) => `/admin/products/${id}/option-configs`,
            REMOVE_OPTION_CONFIG: (id: number, optionId: number) => `/admin/products/${id}/option-configs/${optionId}`,
        },
        STORE_OVERRIDE_API: {
            GET_PRODUCT_OVERVIEW: (productId: number) =>
                `/admin/store-overrides/products/${productId}/overview`,
            UPSERT_PRODUCT_AVAILABILITY: (productId: number, storeId: number) =>
                `/admin/store-overrides/products/${productId}/stores/${storeId}/availability`,
            REMOVE_PRODUCT_AVAILABILITY: (productId: number, storeId: number) =>
                `/admin/store-overrides/products/${productId}/stores/${storeId}/availability`,
            UPSERT_PRODUCT_PRICE: (productId: number, storeId: number) =>
                `/admin/store-overrides/products/${productId}/stores/${storeId}/price`,
            REMOVE_PRODUCT_PRICE: (productId: number, storeId: number) =>
                `/admin/store-overrides/products/${productId}/stores/${storeId}/price`,
            GET_OPTION_OVERVIEW: (optionId: number) =>
                `/admin/store-overrides/options/${optionId}/overview`,
            UPSERT_OPTION_AVAILABILITY: (optionId: number, storeId: number) =>
                `/admin/store-overrides/options/${optionId}/stores/${storeId}/availability`,
            REMOVE_OPTION_AVAILABILITY: (optionId: number, storeId: number) =>
                `/admin/store-overrides/options/${optionId}/stores/${storeId}/availability`,
            UPSERT_OPTION_PRICE: (optionId: number, storeId: number) =>
                `/admin/store-overrides/options/${optionId}/stores/${storeId}/price`,
            REMOVE_OPTION_PRICE: (optionId: number, storeId: number) =>
                `/admin/store-overrides/options/${optionId}/stores/${storeId}/price`,
            GET_PRODUCT_PAGED: (productId: number) =>
                `/admin/store-overrides/products/${productId}/paged`,
            GET_OPTION_PAGED: (optionId: number) =>
                `/admin/store-overrides/options/${optionId}/paged`,
        },
    },
    REPORT: {
        STORE_REVENUE_API: {
            GET_PAGED: '/reports/store-revenue',
            GET_DETAIL: (storeId: number) => `/reports/store-revenue/${storeId}`,
            EXPORT_LIST: '/reports/store-revenue/export',
            EXPORT_DETAIL: (storeId: number) => `/reports/store-revenue/${storeId}/export`,
        },
    },
} as const
