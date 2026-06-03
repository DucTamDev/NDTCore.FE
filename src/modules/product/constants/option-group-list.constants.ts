import type { TableColumn, RowAction, StatusConfig } from '@/components/ui'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'

export const OPTION_GROUP_LIST_EMIT = {
    PAGE_CHANGE: 'page-change',
    PAGE_SIZE_CHANGE: 'page-size-change',
    ROW_ACTION: 'row-action',
} as const

export type OptionGroupListEmits = {
    (event: typeof OPTION_GROUP_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof OPTION_GROUP_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof OPTION_GROUP_LIST_EMIT.ROW_ACTION, key: string, item: OptionGroupViewModel): void
}

export const OPTION_GROUP_ROW_ACTION = {
    DETAIL: 'detail',
    DELETE: 'delete',
} as const

export const OPTION_GROUP_LIST_COLUMNS: TableColumn[] = [
    { key: 'id', title: 'ID', width: '70px' },
    { key: 'name', title: 'Tên nhóm option', minWidth: '180px' },
    { key: 'uiType', title: 'Kiểu UI', width: '150px' },
    { key: 'displayOrder', title: 'Thứ tự', width: '90px', align: 'center', hideBelow: 'lg' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'actions', title: '', width: '100px', align: 'end' },
]

export const OPTION_GROUP_ROW_ACTIONS: RowAction<OptionGroupViewModel>[] = [
    { key: OPTION_GROUP_ROW_ACTION.DETAIL, label: 'Xem chi tiết', icon: 'mdi-eye-outline', color: 'secondary' },
    { key: OPTION_GROUP_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const OPTION_GROUP_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
    active: { label: 'Hiển thị', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
    inactive: { label: 'Ẩn', color: 'default', icon: 'mdi-minus-circle-outline', variant: 'tonal' },
}

export const UI_TYPE_LABELS: Record<string, string> = {
    SingleSelect: 'Chọn một',
    MultiSelect: 'Chọn nhiều',
}
