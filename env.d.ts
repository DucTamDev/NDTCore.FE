declare module 'vuetify/styles'
declare module '*.scss'
declare module '*.css'

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_IDENTITY_BASE_URL: string
    readonly VITE_BRAND_BASE_URL: string
    readonly VITE_STORE_BASE_URL: string
    readonly VITE_PRODUCT_BASE_URL: string
    readonly VITE_ORDER_BASE_URL: string
    readonly VITE_TENANT_BASE_URL: string
    readonly VITE_REPORT_BASE_URL: string
    readonly VITE_API_TIMEOUT: number
    readonly VITE_API_WITH_CREDS: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
