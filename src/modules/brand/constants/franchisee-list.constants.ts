import type {
    FilterField,
    FilterOption,
    TableColumn,
    RowAction,
    StatusConfig,
    SortState,
    ActiveFilters,
} from '@/components/ui'
import { FranchiseeStatus } from '@/modules/brand/enums/_index'
import type { FranchiseeViewModel } from '@/modules/brand/models/view-models/franchisee.view-model'

export const FRANCHISEE_LIST_EMIT = {
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

export type FranchiseeListEmits = {
    (event: typeof FRANCHISEE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, value: ActiveFilters): void
    (event: typeof FRANCHISEE_LIST_EMIT.SEARCH): void
    (event: typeof FRANCHISEE_LIST_EMIT.RESET): void
    (event: typeof FRANCHISEE_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof FRANCHISEE_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof FRANCHISEE_LIST_EMIT.SORT_CHANGE, state: SortState | null): void
    (event: typeof FRANCHISEE_LIST_EMIT.ROW_ACTION, key: string, item: FranchiseeViewModel): void
    (event: typeof FRANCHISEE_LIST_EMIT.CREATE): void
    (event: typeof FRANCHISEE_LIST_EMIT.REFRESH): void
}

export const FRANCHISEE_ROW_ACTION = {
    VIEW: 'view',
    DELETE: 'delete',
} as const

export type FranchiseeRowActionKey = (typeof FRANCHISEE_ROW_ACTION)[keyof typeof FRANCHISEE_ROW_ACTION]

export function buildFranchiseeFilterFields(brandOptions: FilterOption[]): FilterField[] {
    return [
        { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Tên, mã số thuế...' },
        {
            key: 'brandId',
            label: 'Thương hiệu',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...brandOptions],
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
    ]
}

export const FRANCHISEE_LIST_COLUMNS: TableColumn[] = [
    { key: 'name', title: 'Nhà nhượng quyền', sortable: false, minWidth: '200px' },
    { key: 'taxCode', title: 'MST', width: '130px' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'joinedDate', title: 'Ngày tham gia', width: '150px', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '120px', align: 'end' },
]

export const FRANCHISEE_LIST_ROW_ACTIONS: RowAction<FranchiseeViewModel>[] = [
    { key: FRANCHISEE_ROW_ACTION.VIEW, label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
    { key: FRANCHISEE_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const FRANCHISEE_STATUS_CONFIG: Record<FranchiseeStatus, StatusConfig> = {
    [FranchiseeStatus.Active]: {
        label: 'Hoạt động',
        color: 'success',
        icon: 'mdi-check-circle-outline',
        variant: 'tonal',
    },
    [FranchiseeStatus.Inactive]: {
        label: 'Ngừng',
        color: 'error',
        icon: 'mdi-close-circle-outline',
        variant: 'tonal',
    },
}
