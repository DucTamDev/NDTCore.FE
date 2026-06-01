import type { TableColumn, RowAction, StatusConfig } from '@/components/ui'
import type { TagViewModel } from '../models/view-models/tag.view-model'

export const TAG_LIST_EMIT = {
    PAGE_CHANGE: 'page-change',
    PAGE_SIZE_CHANGE: 'page-size-change',
    ROW_ACTION: 'row-action',
    CREATE: 'create',
} as const

export type TagListEmits = {
    (event: typeof TAG_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof TAG_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof TAG_LIST_EMIT.ROW_ACTION, key: string, item: TagViewModel): void
    (event: typeof TAG_LIST_EMIT.CREATE): void
}

export const TAG_ROW_ACTION = {
    EDIT: 'edit',
    DELETE: 'delete',
} as const

export const TAG_LIST_COLUMNS: TableColumn[] = [
    { key: 'id', title: 'ID', width: '70px' },
    { key: 'name', title: 'Tên nhãn', minWidth: '150px' },
    { key: 'colorHex', title: 'Màu sắc', width: '130px' },
    { key: 'displayOrder', title: 'Thứ tự', width: '90px', align: 'center', hideBelow: 'lg' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'actions', title: '', width: '100px', align: 'end' },
]

export const TAG_ROW_ACTIONS: RowAction<TagViewModel>[] = [
    { key: TAG_ROW_ACTION.EDIT, label: 'Chỉnh sửa', icon: 'mdi-pencil-outline', color: 'primary' },
    { key: TAG_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const TAG_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
    active: { label: 'Hiển thị', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
    inactive: { label: 'Ẩn', color: 'default', icon: 'mdi-minus-circle-outline', variant: 'tonal' },
}
