export interface StoreViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    brandId: number
    brandName?: string | null
    franchiseeId?: number | null
    franchiseeName?: string | null
    name: string
    code: string
    slug?: string | null
    logoUrl?: string | null
    isActive: boolean
    isAcceptingOrders: boolean
    phone?: string | null
    email?: string | null
    address?: string | null
    city?: string | null
    ward?: string | null
    district?: string | null
    province?: string | null
    country?: string | null
    latitude?: number | null
    longitude?: number | null
    openTime?: string | null
    closeTime?: string | null
    timeZone?: string | null
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
}
