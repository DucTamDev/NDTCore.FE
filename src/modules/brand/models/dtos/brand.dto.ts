export interface BrandDto {
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
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
