import type { BreadcrumbItem } from '@/core/types'

export type LayoutType = 'default' | 'auth' | 'blank' | 'admin'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutType
    title?: string
    requiresAuth?: boolean
    breadcrumb?: BreadcrumbItem[]
    breadcrumbs?: BreadcrumbItem[]
  }
}
