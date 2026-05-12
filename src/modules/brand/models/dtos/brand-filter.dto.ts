export interface BrandFilterDto {
    PageNumber: number
    PageSize: number
    Keyword?: string | null
    IsActive?: boolean | null
    CreatedAfter?: string | null
    CreatedBefore?: string | null
    SortBy?: string | null
    SortDescending?: boolean | null
}
