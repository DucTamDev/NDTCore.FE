declare module 'vuetify/styles'
declare module '*.scss'
declare module '*.css'

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_IDENTITY_API_URL: string
    readonly VITE_STORE_API_URL: string
    readonly VITE_ORDER_API_URL: string
    readonly VITE_TENANT_API_URL: string
    readonly VITE_API_TIMEOUT: number
    readonly VITE_API_WITH_CREDS: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
