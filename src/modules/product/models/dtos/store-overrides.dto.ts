export interface ProductStoreDto {
    StoreId: number
    ProductId: number
    IsAvailable: boolean
}

export interface UpsertProductStoreRequest {
    StoreId: number
    IsAvailable: boolean
}

export interface ProductStorePriceDto {
    StoreId: number
    ProductId: number
    Price: number
}

export interface UpsertProductStorePriceRequest {
    StoreId: number
    Price: number
}

export interface OptionStoreAvailabilityDto {
    StoreId: number
    OptionId: number
    IsAvailable: boolean
}

export interface UpsertOptionStoreAvailabilityRequest {
    StoreId: number
    IsAvailable: boolean
}

export interface OptionStorePriceDto {
    StoreId: number
    OptionId: number
    Price: number
}

export interface UpsertOptionStorePriceRequest {
    StoreId: number
    Price: number
}

export interface ProductStoreOverviewDto {
    Availability: { StoreId: number; IsAvailable: boolean }[]
    Prices: { StoreId: number; Price: number }[]
}

export interface OptionStoreOverviewDto {
    Availability: { StoreId: number; IsAvailable: boolean }[]
    Prices: { StoreId: number; Price: number }[]
}

export interface StoreOverrideItemDto {
    StoreId: number
    IsAvailable: boolean | null
    Price: number | null
}
