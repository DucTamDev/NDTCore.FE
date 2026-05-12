export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  width?: string | number
  minWidth?: string
  align?: 'start' | 'center' | 'end'
  hideBelow?: 'sm' | 'md' | 'lg'
}

export interface SortState {
  key: string
  order: 'asc' | 'desc'
}
