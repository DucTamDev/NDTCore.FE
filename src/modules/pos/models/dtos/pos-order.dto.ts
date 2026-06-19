import type { PaymentMethod, PaymentStatus, ServiceType } from '../../enums/_index'

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
    DeliveryFee: number
    PaymentMethod: PaymentMethod
    PaymentStatus: PaymentStatus
    AmountReceived: number | null
    ServiceType: ServiceType
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

export interface GetOrderItemOptionDto {
    Id: number
    OptionId: number
    GroupName: string | null
    OptionName: string
    Price: number
}

export interface GetOrderItemDto {
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
    Note: string | null
    Options: GetOrderItemOptionDto[]
}

export interface GetOrderDetailDto {
    Id: number
    TenantId: string
    StoreId: number
    OrderNumber: string
    Status: string
    Channel: string | null
    ServiceType: string
    CustomerName: string | null
    CustomerPhone: string | null
    Note: string | null
    Subtotal: number
    DiscountAmount: number
    TaxAmount: number
    DeliveryFee: number
    TotalAmount: number
    PaymentMethod: string | null
    PaymentStatus: string | null
    AmountReceived: number | null
    ChangeAmount: number | null
    PaidAt: string | null
    CancelledAt: string | null
    CancelledReason: string | null
    CreatedAt: string | null
    CreatedBy: string | null
    UpdatedAt: string | null
    UpdatedBy: string | null
    Items: GetOrderItemDto[]
}
