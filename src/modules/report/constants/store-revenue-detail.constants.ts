import type { TableColumn } from '@/components/ui'
import type { BucketGranularityDto } from '@/modules/report/models/dtos/store-revenue.dto'

export const STORE_REVENUE_BUCKET_COLUMNS: TableColumn[] = [
    { key: 'bucketStart', title: 'Thời gian' },
    { key: 'revenue', title: 'Doanh thu', align: 'end' },
    { key: 'orderCount', title: 'Số đơn', align: 'end' },
    { key: 'averageOrderValue', title: 'AOV', align: 'end' },
]

export interface GranularityTabOption {
    value: BucketGranularityDto
    label: string
}

export const GRANULARITY_TAB_OPTIONS: GranularityTabOption[] = [
    { value: 'Day', label: 'Ngày' },
    { value: 'Week', label: 'Tuần' },
    { value: 'Month', label: 'Tháng' },
]

export type DatePreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'custom'

export interface DatePresetOption {
    value: DatePreset
    label: string
}

export const DATE_PRESET_OPTIONS: DatePresetOption[] = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'last7', label: '7 ngày gần nhất' },
    { value: 'last30', label: '30 ngày gần nhất' },
    { value: 'thisMonth', label: 'Tháng này' },
    { value: 'custom', label: 'Tùy chỉnh' },
]
