import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type {
    StoreRevenueFilterDto,
    StoreRevenueListItemDto,
    StoreRevenueDetailDto,
    BucketGranularityDto,
} from '@/modules/report/models/dtos/store-revenue.dto'
import { reportClient } from '@/core/api/clients/report.client'

export const reportApi = {
    getPagedStoreRevenueAsync(params: StoreRevenueFilterDto): Promise<PagedApiResponse<StoreRevenueListItemDto>> {
        return reportClient.get(API_ENDPOINTS.REPORT.STORE_REVENUE_API.GET_PAGED, params)
    },

    getStoreRevenueDetailAsync(
        storeId: number,
        from: string,
        to: string,
        granularity: BucketGranularityDto,
    ): Promise<ApiResponse<StoreRevenueDetailDto>> {
        return reportClient.get(API_ENDPOINTS.REPORT.STORE_REVENUE_API.GET_DETAIL(storeId), {
            from,
            to,
            granularity,
        })
    },

    exportStoreRevenueListAsync(params: StoreRevenueFilterDto & { format: 'excel' | 'csv' }): Promise<Blob> {
        return reportClient.get(API_ENDPOINTS.REPORT.STORE_REVENUE_API.EXPORT_LIST, params, {
            responseType: 'blob',
        })
    },

    exportStoreRevenueDetailAsync(
        storeId: number,
        from: string,
        to: string,
        granularity: BucketGranularityDto,
        format: 'excel' | 'csv',
    ): Promise<Blob> {
        return reportClient.get(
            API_ENDPOINTS.REPORT.STORE_REVENUE_API.EXPORT_DETAIL(storeId),
            { from, to, granularity, format },
            { responseType: 'blob' },
        )
    },
}
