import type { ApiResponse, PagedApiResponse } from './common.dtos'

export interface BrandFilterDto {
    PageNumber: number
    PageSize: number
    Keyword?: string | null
    IsActive?: boolean | null
    CreatedAfter?: string | null
    CreatedBefore?: string | null
}

export interface CreateBrandRequest {
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
    Currency?: string | null
    TimeZone?: string | null
}

export interface UpdateBrandRequest {
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
    Currency?: string | null
    TimeZone?: string | null
}

export interface UpdateBrandStatusRequest {
    IsActive: boolean
}

export interface AssignUsersToBrandRequest {
    UserIds: string[]
}

export interface GetBrandResponse {
    Id: number
    TenantId: string
    Name: string
    Code: string
    LegalName: string | null
    TaxCode: string | null
    Currency: string
    TimeZone: string | null
    IsActive: boolean
    CreatedAt: string | null
    CreatedBy: string | null
    UpdatedAt: string | null
    UpdatedBy: string | null
}

export interface BrandMemberResponse {
    BrandId: number
    TenantId: string
    UserId: string
}

export type CreateBrandResponse = GetBrandResponse

export type UpdateBrandResponse = GetBrandResponse

export type UpdateBrandStatusResponse = GetBrandResponse

export interface DeleteBrandResponse {
    Id?: number
}

export interface AssignUsersToBrandResponse {
    BrandId?: number
    UserIds?: string[]
}

export interface RemoveUserFromBrandResponse {
    BrandId?: number
    UserId?: string
}

export type BrandResponseEnvelope<T> = ApiResponse<T>
export type BrandPagedResponse = PagedApiResponse<GetBrandResponse>
