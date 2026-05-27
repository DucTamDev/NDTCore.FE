export interface BrandViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    name: string
    code: string
    isActive: boolean
    legalName?: string | null
    taxCode?: string | null
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
}
