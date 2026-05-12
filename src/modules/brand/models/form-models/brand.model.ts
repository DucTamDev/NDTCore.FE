export interface BrandFormModel {
    name: string
    isActive: boolean
    legalName?: string | null
    taxCode?: string | null
    currency?: string | null
    timeZone?: string | null
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
}
