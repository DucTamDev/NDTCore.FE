import type { TableColumn } from '@/components/ui'

export const FRANCHISEE_MEMBER_LIST_EMIT = {
    ROW_ACTION: 'row-action',
    ASSIGN: 'assign',
    REFRESH: 'refresh',
} as const

export const FRANCHISEE_MEMBER_LIST_COLUMNS: TableColumn[] = [
    { key: 'userId', title: 'User ID', minWidth: '200px' },
    { key: 'actions', title: '', width: '80px', align: 'end' },
]
