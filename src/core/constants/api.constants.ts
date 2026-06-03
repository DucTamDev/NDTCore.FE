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
        FRANCHISEE_API: {
            GET_PAGED: '/admin/franchisee',
            GET_BY_ID: (id: number) => `/admin/franchisee/${id}`,
            GET_BY_USER_ID: (userId: string) => `/admin/franchisee/by-user/${userId}`,
            GET_BY_BRAND_ID: (brandId: number) => `/admin/franchisee/by-brand/${brandId}`,
            CREATE: '/admin/franchisee',
            UPDATE: (id: number) => `/admin/franchisee/${id}`,
            DELETE: (id: number) => `/admin/franchisee/${id}`,
            GET_MEMBERS: (id: number) => `/admin/franchisee/${id}/users`,
            ASSIGN_USERS: (id: number) => `/admin/franchisee/${id}/users`,
            REMOVE_USER: (id: number, userId: string) => `/admin/franchisee/${id}/users/${userId}`,
        },
    },
    STORE: {
        STORE_API: {
            GET_PAGED: '/admin/store',
            CREATE: '/admin/store',
            GET_BY_ID: (id: number) => `/admin/store/${id}`,
            UPDATE: (id: number) => `/admin/store/${id}`,
            DELETE: (id: number) => `/admin/store/${id}`,
        },
        STORE_MEMBER_API: {
            GET_BY_STORE: (storeId: number) => `/admin/store/${storeId}/members`,
            ASSIGN: (storeId: number) => `/admin/store/${storeId}/members`,
            REMOVE: (storeId: number, userId: string) => `/admin/store/${storeId}/members/${userId}`,
        },
    },
    ORDER: {
        ORDER_API: {},
    },
    PRODUCT: {
        CATEGORY_API: {
            GET_PAGED: '/admin/category',
            GET_PARENTS: '/admin/category/parents',
            CREATE: '/admin/category',
            GET_BY_ID: (id: number) => `/admin/category/${id}`,
            UPDATE: (id: number) => `/admin/category/${id}`,
            DELETE: (id: number) => `/admin/category/${id}`,
        },
        TAG_API: {
            GET_PAGED: '/admin/tag',
            CREATE: '/admin/tag',
            GET_BY_ID: (id: number) => `/admin/tag/${id}`,
            UPDATE: (id: number) => `/admin/tag/${id}`,
            DELETE: (id: number) => `/admin/tag/${id}`,
        },
        OPTION_GROUP_API: {
            GET_PAGED: '/admin/option-group',
            CREATE: '/admin/option-group',
            GET_BY_ID: (id: number) => `/admin/option-group/${id}`,
            GET_OPTIONS: (id: number) => `/admin/option-group/${id}/options`,
            UPDATE: (id: number) => `/admin/option-group/${id}`,
            DELETE: (id: number) => `/admin/option-group/${id}`,
        },
        OPTION_API: {
            GET_PAGED: '/admin/option',
            CREATE: '/admin/option',
            GET_BY_ID: (id: number) => `/admin/option/${id}`,
            UPDATE: (id: number) => `/admin/option/${id}`,
            DELETE: (id: number) => `/admin/option/${id}`,
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
        },
    },
} as const
