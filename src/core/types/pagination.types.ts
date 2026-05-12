export interface PaginationOptions {
    initialPage?: number
    initialPageSize?: number
    total?: number
}

export type PagedResult<T> = {
    items: T[]
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}
