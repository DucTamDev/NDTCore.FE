import { reportApi } from '@/modules/report/api/report.api'
import { storeRevenueMapper } from '@/modules/report/mappers/store-revenue.mapper'
import type { StoreRevenueFilterDto, BucketGranularityDto } from '@/modules/report/models/dtos/store-revenue.dto'
import type {
    StoreRevenueListItemViewModel,
    StoreRevenueDetailViewModel,
} from '@/modules/report/models/view-models/store-revenue.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class ReportService {
    async getPagedStoreRevenueAsync(
        filter: StoreRevenueFilterDto,
    ): Promise<PagedResult<StoreRevenueListItemViewModel>> {
        const response = await reportApi.getPagedStoreRevenueAsync(filter)
        return {
            items: storeRevenueMapper.toListItemViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getStoreRevenueDetailAsync(
        storeId: number,
        from: string,
        to: string,
        granularity: BucketGranularityDto,
    ): Promise<StoreRevenueDetailViewModel | null> {
        const response = await reportApi.getStoreRevenueDetailAsync(storeId, from, to, granularity)
        return response.Data ? storeRevenueMapper.toDetailViewModel(response.Data) : null
    }

    async exportStoreRevenueListAsync(
        params: StoreRevenueFilterDto & { format: 'excel' | 'csv' },
    ): Promise<Blob> {
        return reportApi.exportStoreRevenueListAsync(params)
    }

    async exportStoreRevenueDetailAsync(
        storeId: number,
        from: string,
        to: string,
        granularity: BucketGranularityDto,
        format: 'excel' | 'csv',
    ): Promise<Blob> {
        return reportApi.exportStoreRevenueDetailAsync(storeId, from, to, granularity, format)
    }
}

export const reportService = new ReportService()
