import type { TableColumn, RowAction, StatusConfig } from '@/components/ui'
import type { ProductViewModel } from '../models/view-models/product.view-model'

export const PRODUCT_LIST_EMIT = {
    PAGE_CHANGE: 'page-change',
    PAGE_SIZE_CHANGE: 'page-size-change',
    ROW_ACTION: 'row-action',
} as const

export type ProductListEmits = {
    (event: typeof PRODUCT_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof PRODUCT_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof PRODUCT_LIST_EMIT.ROW_ACTION, key: string, item: ProductViewModel): void
}

export const PRODUCT_ROW_ACTION = {
    DETAIL: 'detail',
    DELETE: 'delete',
} as const

export const PRODUCT_LIST_COLUMNS: TableColumn[] = [
    { key: 'id', title: 'ID', width: '70px' },
    { key: 'sku', title: 'SKU', width: '120px' },
    { key: 'name', title: 'Tên sản phẩm', minWidth: '180px' },
    { key: 'categoryName', title: 'Danh mục', minWidth: '140px', hideBelow: 'md' },
    { key: 'basePrice', title: 'Giá', width: '130px', align: 'end', hideBelow: 'sm' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'isFeatured', title: 'Nổi bật', width: '100px', align: 'center', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '100px', align: 'end' },
]

export const PRODUCT_ROW_ACTIONS: RowAction<ProductViewModel>[] = [
    { key: PRODUCT_ROW_ACTION.DETAIL, label: 'Xem chi tiết', icon: 'mdi-eye-outline', color: 'secondary' },
    { key: PRODUCT_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const PRODUCT_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
    active: { label: 'Hiển thị', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
    inactive: { label: 'Ẩn', color: 'default', icon: 'mdi-minus-circle-outline', variant: 'tonal' },
}
