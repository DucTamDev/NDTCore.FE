import { ref } from 'vue'
import { useToastNotification } from '@/composables/useToastNotification'
import { reportService } from '@/modules/report/services/report.service'
import type { StoreRevenueDetailViewModel } from '@/modules/report/models/view-models/store-revenue.view-model'
import type { BucketGranularityDto } from '@/modules/report/models/dtos/store-revenue.dto'

export function useStoreRevenueDetail() {
    const toast = useToastNotification()
    const detail = ref<StoreRevenueDetailViewModel | null>(null)
    const loading = ref(false)

    async function fetchDetail(storeId: number, from: string, to: string, granularity: BucketGranularityDto) {
        loading.value = true
        try {
            detail.value = await reportService.getStoreRevenueDetailAsync(storeId, from, to, granularity)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết doanh thu cửa hàng.')
            throw error
        } finally {
            loading.value = false
        }
    }

    async function exportDetail(storeId: number, from: string, to: string, granularity: BucketGranularityDto, format: 'excel' | 'csv'): Promise<Blob> {
        try {
            return await reportService.exportStoreRevenueDetailAsync(storeId, from, to, granularity, format)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xuất file thất bại.')
            throw error
        }
    }

    return { detail, loading, fetchDetail, exportDetail }
}
