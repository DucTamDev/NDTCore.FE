import type {
    FilterField,
    TableColumn,
    RowAction,
    SortState,
    ActiveFilters,
} from '@/components/ui'
import { SYSTEM_ROLES } from '@/core/constants/app.constants'
import type { UserViewModel } from '@/modules/user/models/view-models/user.view-model'

export const USER_LIST_EMIT = {
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

export type UserListEmits = {
    (event: typeof USER_LIST_EMIT.UPDATE_ACTIVE_FILTERS, value: ActiveFilters): void
    (event: typeof USER_LIST_EMIT.SEARCH): void
    (event: typeof USER_LIST_EMIT.RESET): void
    (event: typeof USER_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof USER_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof USER_LIST_EMIT.SORT_CHANGE, state: SortState | null): void
    (event: typeof USER_LIST_EMIT.ROW_ACTION, key: string, item: UserViewModel): void
    (event: typeof USER_LIST_EMIT.CREATE): void
    (event: typeof USER_LIST_EMIT.REFRESH): void
}

export const USER_ROW_ACTION = {
    EDIT: 'edit',
    DELETE: 'delete',
} as const

export function buildUserFilterFields(): FilterField[] {
    return [
        { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Họ tên, email, username...' },
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
        {
            key: 'isLocked',
            label: 'Khóa tài khoản',
            type: 'select',
            options: [
                { label: 'Tất cả', value: null },
                { label: 'Đang bị khóa', value: 'true' },
                { label: 'Không bị khóa', value: 'false' },
            ],
        },
    ]
}

export const USER_LIST_COLUMNS: TableColumn[] = [
    { key: 'fullName', title: 'Họ tên', sortable: true, minWidth: '200px' },
    { key: 'email', title: 'Email', minWidth: '200px', hideBelow: 'md' },
    { key: 'userName', title: 'Username', width: '140px', hideBelow: 'lg' },
    { key: 'roles', title: 'Roles', width: '200px' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'lastLoginAt', title: 'Đăng nhập gần nhất', width: '170px', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '100px', align: 'end' },
]

export const USER_LIST_ROW_ACTIONS: RowAction<UserViewModel>[] = [
    { key: USER_ROW_ACTION.EDIT, label: 'Sửa', icon: 'mdi-pencil-outline' },
    {
        key: USER_ROW_ACTION.DELETE,
        label: 'Xóa',
        icon: 'mdi-delete-outline',
        color: 'error',
        hidden: (item) => item.roles.includes(SYSTEM_ROLES.SUPER_ADMIN),
    },
]
