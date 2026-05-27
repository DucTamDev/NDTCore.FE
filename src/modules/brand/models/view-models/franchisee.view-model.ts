export interface FranchiseeViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    brandId: number
    name: string
    legalName?: string | null
    taxCode?: string | null
    bankAccount?: string | null
    bankName?: string | null
    isActive: boolean
    joinedDate?: string | null
    terminatedDate?: string | null
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
}
