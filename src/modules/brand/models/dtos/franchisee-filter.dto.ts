export interface FranchiseeFilterDto {
    PageNumber: number
    PageSize: number
    BrandId?: number | null
    UserId?: string | null
    Keyword?: string | null
    IsActive?: boolean | null
    JoinedAfter?: string | null
    JoinedBefore?: string | null
}
