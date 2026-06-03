import type {
    FilterField,
    TableColumn,
    RowAction,
    StatusConfig,
    SortState,
    ActiveFilters,
} from '@/components/ui'
import { BrandStatus } from '@/modules/brand/enums/_index'
import type { BrandViewModel } from '@/modules/brand/models/view-models/brand.view-model'

export const BRAND_LIST_EMIT = {
    UPDATE_ACTIVE_FILTERS: 'update:activeFilters',
    SEARCH: 'search',
    RESET: 'reset',
    PAGE_CHANGE: 'page-change',
    PAGE_SIZE_CHANGE: 'page-size-change',
    SORT_CHANGE: 'sort-change',
    ROW_ACTION: 'row-action',
    CREATE: 'create',
    REFRESH: 'refresh',
} as const

export type BrandListEmits = {
    (event: typeof BRAND_LIST_EMIT.UPDATE_ACTIVE_FILTERS, value: ActiveFilters): void
    (event: typeof BRAND_LIST_EMIT.SEARCH): void
    (event: typeof BRAND_LIST_EMIT.RESET): void
    (event: typeof BRAND_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof BRAND_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof BRAND_LIST_EMIT.SORT_CHANGE, state: SortState | null): void
    (event: typeof BRAND_LIST_EMIT.ROW_ACTION, key: string, item: BrandViewModel): void
    (event: typeof BRAND_LIST_EMIT.CREATE): void
    (event: typeof BRAND_LIST_EMIT.REFRESH): void
}

export const BRAND_ROW_ACTION = {
    VIEW: 'view',
    DELETE: 'delete',
} as const

export type BrandRowActionKey = (typeof BRAND_ROW_ACTION)[keyof typeof BRAND_ROW_ACTION]

export const BRAND_LIST_FILTER_FIELDS: FilterField[] = [
    { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Tên, mã thương hiệu...' },
    {
        key: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { label: 'Tất cả', value: null },
            { label: 'Đang hoạt động', value: BrandStatus.Active },
            { label: 'Ngừng hoạt động', value: BrandStatus.Inactive },
        ],
    },
]

export const BRAND_LIST_COLUMNS: TableColumn[] = [
    { key: 'name', title: 'Thương hiệu', sortable: true, minWidth: '200px' },
    { key: 'code', title: 'Mã', width: '110px' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'updatedAt', title: 'Cập nhật', width: '150px', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '120px', align: 'end' },
]

export const BRAND_LIST_ROW_ACTIONS: RowAction<BrandViewModel>[] = [
    { key: BRAND_ROW_ACTION.VIEW, label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
    { key: BRAND_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const BRAND_STATUS_CONFIG: Record<BrandStatus, StatusConfig> = {
    [BrandStatus.Active]: {
        label: 'Hoạt động',
        color: 'success',
        icon: 'mdi-check-circle-outline',
        variant: 'tonal',
    },
    [BrandStatus.Inactive]: {
        label: 'Ngừng',
        color: 'error',
        icon: 'mdi-close-circle-outline',
        variant: 'tonal',
    },
}
