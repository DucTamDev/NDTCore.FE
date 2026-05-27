export interface CreateFranchiseeRequest {
    BrandId: number
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
    BankAccount?: string | null
    BankName?: string | null
    JoinedDate?: string | null
}

export interface CreateFranchiseeResponse {
    Id: number
    TenantId: string
    BrandId: number
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
    BankAccount?: string | null
    BankName?: string | null
    IsActive: boolean
    JoinedDate?: string | null
    CreatedAt?: string | null
    CreatedBy?: string | null
}
