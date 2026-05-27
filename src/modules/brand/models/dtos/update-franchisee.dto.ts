export interface UpdateFranchiseeRequest {
    Name: string
    IsActive: boolean
    LegalName?: string | null
    TaxCode?: string | null
    BankAccount?: string | null
    BankName?: string | null
    JoinedDate?: string | null
    TerminatedDate?: string | null
}

export interface UpdateFranchiseeResponse {
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
    TerminatedDate?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
