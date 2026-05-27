import type { StoreDto } from './store.dto'

export interface UpdateStoreRequest {
    Name: string
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
}

export type UpdateStoreResponse = StoreDto
