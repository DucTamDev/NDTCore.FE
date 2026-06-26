export interface OrderFilterDto {
    PageNumber: number
    PageSize: number
    StoreId?: number | null
    Status?: string | null
    Channel?: string | null
    FromDate?: string | null
    ToDate?: string | null
    Keyword?: string | null
    SortBy?: string | null
    SortDirection?: string | null
}
