import type { TableColumn } from '@/components/ui'

export const STORE_MEMBER_LIST_EMIT = {
    REFRESH: 'refresh',
} as const

export const STORE_MEMBER_LIST_COLUMNS: TableColumn[] = [
    { key: 'userId', title: 'User ID', minWidth: '200px' },
    { key: 'storeId', title: 'Store', width: '120px' },
]
