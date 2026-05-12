export type FilterType = 'text' | 'select' | 'date' | 'daterange' | 'multiselect'

export type FilterValue = string | string[] | [string, string] | null

export type ActiveFilters = Record<string, FilterValue>

export interface FilterOption {
  label: string
  value: string | number | null
}

export interface FilterField {
  key: string
  label: string
  type: FilterType
  placeholder?: string
  options?: FilterOption[]
}
