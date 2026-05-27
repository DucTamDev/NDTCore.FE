export interface StoreFilterDto {
    PageNumber: number
    PageSize: number
    BrandId?: number | null
    FranchiseeId?: number | null
    IsActive?: boolean | null
    Province?: string | null
    District?: string | null
    Keyword?: string | null
    SortBy?: string | null
    SortDirection?: string | null
}
