export interface BreadcrumbItem {
    title: string
    to?: string
    disabled?: boolean
}

export type LayoutType = 'default' | 'auth' | 'blank' | 'admin'

declare module 'vue-router' {
    interface RouteMeta {
        layout?: LayoutType
        title?: string
        requiresAuth?: boolean
        breadcrumbs?: BreadcrumbItem[]
    }
}
