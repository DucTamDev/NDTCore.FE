import type { Permission } from '@/modules/auth/types/auth.types'
import type { BreadcrumbItem } from '@/shared/types/breadcrumb.types'

export type LayoutType = 'dashboard' | 'auth' | 'blank'

declare module 'vue-router' {
    interface RouteMeta {
        layout?: LayoutType
        title?: string
        requiresAuth?: boolean
        permissions?: Permission[]
        breadcrumbs?: BreadcrumbItem[]
        showBreadcrumbs?: boolean
        showFooter?: boolean
    }
}
