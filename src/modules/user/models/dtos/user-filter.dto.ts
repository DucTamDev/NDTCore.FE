export interface UserFilterDto {
    PageNumber: number
    PageSize: number
    Keyword?: string | null
    IsActive?: boolean | null
    IsLocked?: boolean | null
    RoleNames?: string[] | null
    SortBy?: string | null
    SortDirection?: string | null
}
