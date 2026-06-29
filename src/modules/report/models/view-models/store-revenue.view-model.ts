export interface StoreRevenueListItemViewModel extends Record<string, unknown> {
    storeId: number
    storeName: string
    storeCode: string
    revenue: number
    orderCount: number
}

export interface RevenueBucketViewModel extends Record<string, unknown> {
    bucketStart: string
    revenue: number
    orderCount: number
    averageOrderValue: number
}

export interface StoreRevenueDetailViewModel extends Record<string, unknown> {
    storeId: number
    storeName: string
    storeCode: string
    brandName?: string | null
    franchiseeName?: string | null
    totalRevenue: number
    totalOrderCount: number
    averageOrderValue: number
    growthPercent: number | null
    currentPeriodBuckets: RevenueBucketViewModel[]
    previousPeriodBuckets: RevenueBucketViewModel[]
}
