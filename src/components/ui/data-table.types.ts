export interface DataTableHeader {
    key: string
    title: string
    sortable?: boolean
    align?: 'start' | 'center' | 'end'
    width?: string | number
}
