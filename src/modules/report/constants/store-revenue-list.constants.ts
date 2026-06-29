import type { FilterField, TableColumn, RowAction } from '@/components/ui'
import type { StoreRevenueListItemViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'

export const STORE_REVENUE_ROW_ACTION = {
    VIEW: 'view',
} as const

export const STORE_REVENUE_LIST_ROW_ACTIONS: RowAction<StoreRevenueListItemViewModel>[] = [
    { key: STORE_REVENUE_ROW_ACTION.VIEW, label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
]

export const STORE_REVENUE_LIST_COLUMNS: TableColumn[] = [
    { key: 'storeCode', title: 'Mã cửa hàng', width: '120px' },
    { key: 'storeName', title: 'Cửa hàng', sortable: true, minWidth: '200px' },
    { key: 'revenue', title: 'Doanh thu', sortable: true, width: '160px', align: 'end' },
    { key: 'orderCount', title: 'Số đơn', sortable: true, width: '110px', align: 'end' },
    { key: 'actions', title: 'Hành động', width: '110px', align: 'end' },
]

export function buildStoreRevenueFilterFields(): FilterField[] {
    return [
        { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Mã cửa hàng, tên cửa hàng...' },
        { key: 'dateRange', label: 'Khoảng thời gian', type: 'daterange' },
    ]
}
