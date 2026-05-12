export interface RowAction<T = unknown> {
  key: string
  label: string
  icon?: string
  color?: string
  hidden?: (item: T) => boolean
  disabled?: (item: T) => boolean
}

export interface BulkAction {
  key: string
  label: string
  icon?: string
  color?: string
}
