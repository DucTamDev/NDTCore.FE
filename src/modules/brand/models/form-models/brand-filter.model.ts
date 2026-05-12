export interface BrandFilterModel {
    pageNumber: number
    pageSize: number
    keyword?: string | null
    isActive?: boolean | null
    createdAfter?: string | null
    createdBefore?: string | null
}
