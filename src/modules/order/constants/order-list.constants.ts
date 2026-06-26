import type { FilterField, FilterOption, TableColumn, StatusConfig } from '@/components/ui'
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

export const ORDER_LIST_COLUMNS: TableColumn[] = [
    { key: 'orderNumber', title: 'Mã đơn', sortable: true, minWidth: '140px' },
    { key: 'status', title: 'Trạng thái', width: '140px', align: 'center' },
    { key: 'channel', title: 'Kênh', width: '110px', hideBelow: 'md' },
    { key: 'customerName', title: 'Khách hàng', minWidth: '160px', hideBelow: 'md' },
    { key: 'totalAmount', title: 'Tổng tiền', width: '130px', align: 'end' },
    { key: 'createdAt', title: 'Thời gian tạo', width: '170px', sortable: true },
]

export function buildOrderFilterFields(
    storeOptions: FilterOption[],
    brandOptions: FilterOption[] | null,
): FilterField[] {
    const fields: FilterField[] = []

    if (brandOptions) {
        fields.push({
            key: 'brandId',
            label: 'Thương hiệu',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...brandOptions],
        })
    }

    fields.push(
        {
            key: 'storeId',
            label: 'Cửa hàng',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...storeOptions],
        },
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
    )

    return fields
}

export type OrderRowClickHandler = (item: OrderViewModel) => void
