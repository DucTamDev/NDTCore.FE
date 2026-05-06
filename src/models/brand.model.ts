export interface BrandModel {
    id: number
    tenantId: string
    name: string
    code: string
    legalName: string | null
    taxCode: string | null
    currency: string
    timeZone: string | null
    isActive: boolean
    createdAt: string | null
    createdBy: string | null
    updatedAt: string | null
    updatedBy: string | null
}

export interface BrandMemberModel {
    brandId: number
    tenantId: string
    userId: string
}

export interface BrandListResultModel {
    items: BrandModel[]
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}
