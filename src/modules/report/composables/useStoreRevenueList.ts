import { useToastNotification } from '@/composables/useToastNotification'
import { reportService } from '@/modules/report/services/report.service'
import type { StoreRevenueFilterDto } from '@/modules/report/models/dtos/store-revenue.dto'

export function useStoreRevenueList() {
    const toast = useToastNotification()

    async function getPagedStoreRevenue(filter: StoreRevenueFilterDto) {
        try {
            return await reportService.getPagedStoreRevenueAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải báo cáo doanh thu.')
            throw error
        }
    }

    async function exportStoreRevenueList(filter: StoreRevenueFilterDto & { format: 'excel' | 'csv' }) {
        try {
            await reportService.exportStoreRevenueListAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xuất file thất bại.')
            throw error
        }
    }

    return { getPagedStoreRevenue, exportStoreRevenueList }
}
