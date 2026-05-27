export interface FranchiseeDto {
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
    CreatedAt?: string | null
    CreatedBy?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
