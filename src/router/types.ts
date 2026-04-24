import type { Permission } from '@/models/auth.models'
import type { BreadcrumbItem } from '@/models/breadcrumb.models'

export type LayoutType = 'default' | 'auth' | 'blank' | 'admin'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutType
    title?: string
    requiresAuth?: boolean
    permissions?: Permission[]
    roles?: string[]
    breadcrumbs?: BreadcrumbItem[]
  }
}
