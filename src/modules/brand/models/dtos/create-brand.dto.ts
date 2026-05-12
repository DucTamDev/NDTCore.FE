export interface CreateBrandRequest {
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
    Currency?: string | null
    TimeZone?: string | null
}

export interface CreateBrandResponse {
    Id: number
    TenantId: string
    Name: string
    Code: string
    IsActive: boolean
    LegalName?: string | null
    TaxCode?: string | null
    Currency?: string | null
    TimeZone?: string | null
    CreatedAt?: string | null
    CreatedBy?: string | null
}
