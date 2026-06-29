import type {
    StoreRevenueListItemDto,
    RevenueBucketDto,
    StoreRevenueDetailDto,
} from '@/modules/report/models/dtos/store-revenue.dto'
import type {
    StoreRevenueListItemViewModel,
    RevenueBucketViewModel,
    StoreRevenueDetailViewModel,
} from '@/modules/report/models/view-models/store-revenue.view-model'

export const storeRevenueMapper = {
    toListItemViewModels(dtos: StoreRevenueListItemDto[]): StoreRevenueListItemViewModel[] {
        return (dtos ?? []).map((dto) => this.toListItemViewModel(dto))
    },

    toListItemViewModel(dto: StoreRevenueListItemDto): StoreRevenueListItemViewModel {
        return {
            storeId: dto.StoreId,
            storeName: dto.StoreName,
            storeCode: dto.StoreCode,
            revenue: dto.Revenue,
            orderCount: dto.OrderCount,
        }
    },

    toBucketViewModel(dto: RevenueBucketDto): RevenueBucketViewModel {
        return {
            bucketStart: dto.BucketStart,
            revenue: dto.Revenue,
            orderCount: dto.OrderCount,
            averageOrderValue: dto.AverageOrderValue,
        }
    },

    toDetailViewModel(dto: StoreRevenueDetailDto): StoreRevenueDetailViewModel {
        return {
            storeId: dto.StoreId,
            storeName: dto.StoreName,
            storeCode: dto.StoreCode,
            brandName: dto.BrandName ?? null,
            franchiseeName: dto.FranchiseeName ?? null,
            totalRevenue: dto.TotalRevenue,
            totalOrderCount: dto.TotalOrderCount,
            averageOrderValue: dto.AverageOrderValue,
            growthPercent: dto.GrowthPercent ?? null,
            currentPeriodBuckets: (dto.CurrentPeriodBuckets ?? []).map((bucket) =>
                this.toBucketViewModel(bucket),
            ),
            previousPeriodBuckets: (dto.PreviousPeriodBuckets ?? []).map((bucket) =>
                this.toBucketViewModel(bucket),
            ),
        }
    },
}
