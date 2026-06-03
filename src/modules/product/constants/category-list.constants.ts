import type { TableColumn, RowAction, StatusConfig } from '@/components/ui'
import type { CategoryViewModel } from '../models/view-models/category.view-model'

export const CATEGORY_LIST_EMIT = {
    PAGE_CHANGE: 'page-change',
    PAGE_SIZE_CHANGE: 'page-size-change',
    ROW_ACTION: 'row-action',
    CREATE: 'create',
} as const

export type CategoryListEmits = {
    (event: typeof CATEGORY_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof CATEGORY_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof CATEGORY_LIST_EMIT.ROW_ACTION, key: string, item: CategoryViewModel): void
    (event: typeof CATEGORY_LIST_EMIT.CREATE): void
}

export const CATEGORY_ROW_ACTION = {
    DETAIL: 'detail',
    EDIT: 'edit',
    DELETE: 'delete',
} as const

export const CATEGORY_LIST_COLUMNS: TableColumn[] = [
    { key: 'id', title: 'ID', width: '70px' },
    { key: 'name', title: 'Tên danh mục', minWidth: '180px' },
    { key: 'slug', title: 'Slug', minWidth: '150px', hideBelow: 'md' },
    { key: 'displayOrder', title: 'Thứ tự', width: '90px', align: 'center', hideBelow: 'lg' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'createdAt', title: 'Ngày tạo', width: '150px', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '100px', align: 'end' },
]

export const CATEGORY_ROW_ACTIONS: RowAction<CategoryViewModel>[] = [
    { key: CATEGORY_ROW_ACTION.DETAIL, label: 'Xem chi tiết', icon: 'mdi-eye-outline', color: 'default' },
    { key: CATEGORY_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const CATEGORY_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
    active: { label: 'Hiển thị', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
    inactive: { label: 'Ẩn', color: 'default', icon: 'mdi-minus-circle-outline', variant: 'tonal' },
}
