export interface FranchiseeFormModel {
    brandId: number | null
    name: string
    legalName: string | null
    taxCode: string | null
    bankAccount: string | null
    bankName: string | null
    joinedDate: string | null
    terminatedDate: string | null
    isActive: boolean
}
