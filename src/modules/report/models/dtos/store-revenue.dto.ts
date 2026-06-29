export interface StoreRevenueFilterDto {
    PageNumber: number
    PageSize: number
    From: string
    To: string
    Keyword?: string | null
    SortBy?: string | null
    SortDirection?: string | null
}

export interface StoreRevenueListItemDto {
    StoreId: number
    StoreName: string
    StoreCode: string
    Revenue: number
    OrderCount: number
}

export type BucketGranularityDto = 'Day' | 'Week' | 'Month'

export interface RevenueBucketDto {
    BucketStart: string
    Revenue: number
    OrderCount: number
    AverageOrderValue: number
}

export interface StoreRevenueDetailDto {
    StoreId: number
    StoreName: string
    StoreCode: string
    BrandName?: string | null
    FranchiseeName?: string | null
    TotalRevenue: number
    TotalOrderCount: number
    AverageOrderValue: number
    GrowthPercent: number | null
    CurrentPeriodBuckets: RevenueBucketDto[]
    PreviousPeriodBuckets: RevenueBucketDto[]
}
