import type {
    FilterField,
    FilterOption,
    TableColumn,
    RowAction,
    StatusConfig,
    SortState,
    ActiveFilters,
} from '@/components/ui'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'

export const STORE_LIST_EMIT = {
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

export type StoreListEmits = {
    (event: typeof STORE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, value: ActiveFilters): void
    (event: typeof STORE_LIST_EMIT.SEARCH): void
    (event: typeof STORE_LIST_EMIT.RESET): void
    (event: typeof STORE_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof STORE_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof STORE_LIST_EMIT.SORT_CHANGE, state: SortState | null): void
    (event: typeof STORE_LIST_EMIT.ROW_ACTION, key: string, item: StoreViewModel): void
    (event: typeof STORE_LIST_EMIT.CREATE): void
    (event: typeof STORE_LIST_EMIT.REFRESH): void
}

export const STORE_ROW_ACTION = {
    VIEW: 'view',
    DELETE: 'delete',
} as const

export function buildStoreFilterFields(
    brandOptions: FilterOption[],
    franchiseeOptions: FilterOption[],
): FilterField[] {
    return [
        { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Tên, mã cửa hàng...' },
        {
            key: 'brandId',
            label: 'Thương hiệu',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...brandOptions],
        },
        {
            key: 'franchiseeId',
            label: 'Nhà nhượng quyền',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...franchiseeOptions],
        },
        {
            key: 'isActive',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { label: 'Tất cả', value: null },
                { label: 'Đang hoạt động', value: 'true' },
                { label: 'Ngừng hoạt động', value: 'false' },
            ],
        },
        { key: 'province', label: 'Tỉnh/Thành', type: 'text', placeholder: 'Lọc theo tỉnh...' },
    ]
}

export const STORE_LIST_COLUMNS: TableColumn[] = [
    { key: 'name', title: 'Cửa hàng', sortable: true, minWidth: '200px' },
    { key: 'code', title: 'Mã', width: '110px' },
    { key: 'province', title: 'Tỉnh/Thành', width: '140px', hideBelow: 'md' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'isAcceptingOrders', title: 'Nhận đơn', width: '110px', align: 'center', hideBelow: 'lg' },
    { key: 'updatedAt', title: 'Cập nhật', width: '150px', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '120px', align: 'end' },
]

export const STORE_LIST_ROW_ACTIONS: RowAction<StoreViewModel>[] = [
    { key: STORE_ROW_ACTION.VIEW, label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
    { key: STORE_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const STORE_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
    active: { label: 'Hoạt động', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
    inactive: { label: 'Ngừng', color: 'error', icon: 'mdi-close-circle-outline', variant: 'tonal' },
}
