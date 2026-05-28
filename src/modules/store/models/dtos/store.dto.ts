export interface StoreDto {
    Id: number
    TenantId: string
    BrandId: number
    BrandName?: string | null
    FranchiseeId?: number | null
    FranchiseeName?: string | null
    Name: string
    Code: string
    Slug?: string | null
    LogoUrl?: string | null
    IsActive: boolean
    IsAcceptingOrders: boolean
    Phone?: string | null
    Email?: string | null
    Address?: string | null
    City?: string | null
    Ward?: string | null
    District?: string | null
    Province?: string | null
    Country?: string | null
    Latitude?: number | null
    Longitude?: number | null
    OpenTime?: string | null
    CloseTime?: string | null
    TimeZone?: string | null
    CreatedAt?: string | null
    CreatedBy?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
