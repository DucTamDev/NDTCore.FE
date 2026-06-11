export interface CreatePosOrderItemRequest {
    ProductId: number
    Quantity: number
    Note: string | null
    SelectedOptionIds: number[]
}

export interface CreatePosOrderRequest {
    StoreId: number
    ShiftId: number
    CustomerName: string | null
    CustomerPhone: string | null
    Note: string | null
    Items: CreatePosOrderItemRequest[]
}

export interface CreatePosOrderResponse {
    OrderId: number
    OrderNumber: string
    Status: string
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
