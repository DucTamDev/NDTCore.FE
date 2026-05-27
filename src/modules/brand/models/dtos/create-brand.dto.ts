export interface CreateBrandRequest {
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
}

export interface CreateBrandResponse {
    Id: number
    TenantId: string
    Name: string
    Code: string
    IsActive: boolean
    LegalName?: string | null
    TaxCode?: string | null
    CreatedAt?: string | null
    CreatedBy?: string | null
}
