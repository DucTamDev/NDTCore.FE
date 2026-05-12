export interface BreadcrumbItem {
  title: string
  to?: string | Record<string, unknown>
  disabled?: boolean
  icon?: string
}
