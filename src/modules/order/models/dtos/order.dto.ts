export interface OrderItemOptionDto {
    Id: number
    OptionId: number
    GroupName?: string | null
    OptionName: string
    Price: number
}

export interface OrderItemDto {
    Id: number
    ProductId: number
    ProductCode: string
    ProductName: string
    RegularPrice: number
    OptionsAmount: number
    SalePrice: number
    Quantity: number
    LineAmount: number
    DiscountAmount: number
    LineNetAmount: number
    Note?: string | null
    Options: OrderItemOptionDto[]
}

export interface OrderDto {
    Id: number
    TenantId: string
    StoreId: number
    OrderNumber: string
    Status: string
    Channel?: string | null
    ServiceType: string
    CustomerName?: string | null
    CustomerPhone?: string | null
    Note?: string | null
    Subtotal: number
    DiscountAmount: number
    TaxAmount: number
    DeliveryFee: number
    DeliveryAddress?: string | null
    TotalAmount: number
    PaymentMethod?: string | null
    PaymentStatus?: string | null
    AmountReceived?: number | null
    ChangeAmount?: number | null
    PaidAt?: string | null
    CancelledAt?: string | null
    CancelledReason?: string | null
    CreatedAt?: string | null
    CreatedBy?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
    Items: OrderItemDto[]
}

export interface UpdateOrderStatusRequest {
    Status: string
}

export interface UpdateOrderStatusResponse {
    Id: number
    OrderNumber: string
    Status: string
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}

export interface CancelOrderRequest {
    CancelledReason?: string | null
}

export interface CancelOrderResponse {
    Id: number
    OrderNumber: string
    Status: string
    CancelledAt?: string | null
    CancelledReason?: string | null
}
