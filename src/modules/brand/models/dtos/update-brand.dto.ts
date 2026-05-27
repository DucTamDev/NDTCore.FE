export interface UpdateBrandRequest {
    Name: string
    IsActive: boolean
    LegalName?: string | null
    TaxCode?: string | null
}

export interface UpdateBrandResponse {
    Id: number
    TenantId: string
    Name: string
    Code: string
    IsActive: boolean
    LegalName?: string | null
    TaxCode?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
