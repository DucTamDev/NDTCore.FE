import type { FilterField, TableColumn, StatusConfig, RowAction } from '@/components/ui'
import type { OrderViewModel } from '@/modules/order/models/view-models/order.view-model'

export const ORDER_STATUS = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
} as const

export const ORDER_STATUS_CONFIG: Record<string, StatusConfig> = {
    [ORDER_STATUS.PENDING]: { label: 'Chờ xác nhận', color: 'warning', icon: 'mdi-clock-outline', variant: 'tonal' },
    [ORDER_STATUS.CONFIRMED]: { label: 'Đã xác nhận', color: 'info', icon: 'mdi-progress-clock', variant: 'tonal' },
    [ORDER_STATUS.COMPLETED]: { label: 'Hoàn thành', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
    [ORDER_STATUS.CANCELLED]: { label: 'Đã huỷ', color: 'error', icon: 'mdi-close-circle-outline', variant: 'tonal' },
}

const UNKNOWN_ORDER_STATUS_CONFIG: StatusConfig = { label: 'Không xác định', color: 'default', variant: 'tonal' }

// noUncheckedIndexedAccess makes ORDER_STATUS_CONFIG[status] possibly undefined; this guards against an unrecognized status.
export function resolveOrderStatusConfig(status: string): StatusConfig {
    return ORDER_STATUS_CONFIG[status] ?? UNKNOWN_ORDER_STATUS_CONFIG
}

export const ORDER_ROW_ACTION = {
    VIEW: 'view',
} as const

export const ORDER_LIST_ROW_ACTIONS: RowAction<OrderViewModel>[] = [
    { key: ORDER_ROW_ACTION.VIEW, label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
]

export const ORDER_LIST_COLUMNS: TableColumn[] = [
    { key: 'orderNumber', title: 'Mã đơn', sortable: true, minWidth: '140px' },
    { key: 'status', title: 'Trạng thái', width: '140px', align: 'center' },
    { key: 'storeCode', title: 'Mã cửa hàng', width: '120px', hideBelow: 'md' },
    { key: 'channel', title: 'Kênh', width: '110px', hideBelow: 'md' },
    { key: 'totalAmount', title: 'Tổng tiền', width: '130px', align: 'end' },
    { key: 'createdAt', title: 'Thời gian tạo', width: '170px', sortable: true },
    { key: 'actions', title: 'Hành động', width: '110px', align: 'end' },
]

export function buildOrderFilterFields(): FilterField[] {
    return [
        { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Mã đơn, khách hàng, SĐT...' },
        {
            key: 'status',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { label: 'Tất cả', value: null },
                { label: 'Chờ xác nhận', value: ORDER_STATUS.PENDING },
                { label: 'Đã xác nhận', value: ORDER_STATUS.CONFIRMED },
                { label: 'Hoàn thành', value: ORDER_STATUS.COMPLETED },
                { label: 'Đã huỷ', value: ORDER_STATUS.CANCELLED },
            ],
        },
        {
            key: 'channel',
            label: 'Kênh',
            type: 'select',
            options: [
                { label: 'Tất cả', value: null },
                { label: 'POS', value: 'Pos' },
                { label: 'Online', value: 'Online' },
                { label: 'Kiosk', value: 'Kiosk' },
            ],
        },
        { key: 'dateRange', label: 'Ngày tạo', type: 'daterange' },
    ]
}
