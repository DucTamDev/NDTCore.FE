import type { Permission, UserRole } from '@/types/auth.types'
import type { BreadcrumbItem } from '@/models/breadcrumb.models'

export type LayoutType = 'default' | 'auth' | 'blank' | 'admin'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutType
    title?: string
    requiresAuth?: boolean
    permissions?: Permission[]
    roles?: UserRole[]
    breadcrumb?: BreadcrumbItem[]
    breadcrumbs?: BreadcrumbItem[]
  }
}
