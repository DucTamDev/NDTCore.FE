export interface CreatePosOrderItemOptionRequest {
    OptionId: number
    GroupName: string | null
    OptionName: string
    Price: number
}

export interface CreatePosOrderItemRequest {
    ProductId: number
    ProductCode: string
    ProductName: string
    RegularPrice: number
    Quantity: number
    DiscountAmount: number
    Note: string | null
    Options: CreatePosOrderItemOptionRequest[]
}

export interface CreatePosOrderRequest {
    StoreId: number
    Channel: string | null
    CustomerName: string | null
    CustomerPhone: string | null
    Note: string | null
    DiscountAmount: number
    TaxAmount: number
    Items: CreatePosOrderItemRequest[]
}

export interface CreatePosOrderResponse {
    Id: number
    OrderNumber: string
    Status: string
    TotalAmount: number
    CreatedAt: string
}

export interface PosOrderHistoryItemDto {
    Id: number
    OrderNumber: string
    Status: string
    TotalAmount: number
    ItemSummary: string
    CreatedAt: string
}
