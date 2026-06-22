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
    OverridePrice: number
}

export interface UpsertProductStorePriceRequest {
    StoreId: number
    OverridePrice: number
}

export interface OptionStoreDto {
    StoreId: number
    OptionId: number
    IsAvailable: boolean
}

export interface UpsertOptionStoreRequest {
    StoreId: number
    IsAvailable: boolean
}

export interface OptionStorePriceDto {
    StoreId: number
    OptionId: number
    OverridePrice: number
}

export interface UpsertOptionStorePriceRequest {
    StoreId: number
    OverridePrice: number
}

export interface ProductStoreOverviewDto {
    Availability: { StoreId: number; IsAvailable: boolean }[]
    Prices: { StoreId: number; OverridePrice: number }[]
}

export interface OptionStoreOverviewDto {
    Availability: { StoreId: number; IsAvailable: boolean }[]
    Prices: { StoreId: number; OverridePrice: number }[]
}

export interface StoreOverrideItemDto {
    StoreId: number
    IsAvailable: boolean | null
    OverridePrice: number | null
}
