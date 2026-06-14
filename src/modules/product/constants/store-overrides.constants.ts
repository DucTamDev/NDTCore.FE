import type { TableColumn, RowAction } from '@/components/ui'

export const STORE_OVERRIDE_ROW_ACTION = {
    EDIT:   'edit',
    DELETE: 'delete',
} as const

export const STORE_OVERRIDE_LIST_COLUMNS: TableColumn[] = [
    { key: 'StoreId',     title: 'Store ID',     width: '100px' },
    { key: 'IsAvailable', title: 'Khả dụng',     width: '120px', align: 'center' },
    { key: 'OverridePrice', title: 'Giá override',  width: '150px', align: 'end', hideBelow: 'sm' },
    { key: 'actions',     title: '',             width: '90px',  align: 'end' },
]

export const STORE_OVERRIDE_ROW_ACTIONS: RowAction<Record<string, unknown>>[] = [
    { key: STORE_OVERRIDE_ROW_ACTION.EDIT,   label: 'Chỉnh sửa', icon: 'mdi-pencil-outline', color: 'secondary' },
    { key: STORE_OVERRIDE_ROW_ACTION.DELETE, label: 'Xóa',       icon: 'mdi-delete-outline',  color: 'error' },
]
