export interface OrderItemOptionViewModel {
    id: number
    optionId: number
    groupName?: string | null
    optionName: string
    price: number
}

export interface OrderItemViewModel {
    id: number
    productId: number
    productCode: string
    productName: string
    regularPrice: number
    optionsAmount: number
    salePrice: number
    quantity: number
    lineAmount: number
    discountAmount: number
    lineNetAmount: number
    note?: string | null
    options: OrderItemOptionViewModel[]
}

export interface OrderViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    storeId: number
    orderNumber: string
    status: string
    channel?: string | null
    serviceType: string
    customerName?: string | null
    customerPhone?: string | null
    note?: string | null
    subtotal: number
    discountAmount: number
    taxAmount: number
    deliveryFee: number
    deliveryAddress?: string | null
    totalAmount: number
    paymentMethod?: string | null
    paymentStatus?: string | null
    amountReceived?: number | null
    changeAmount?: number | null
    paidAt?: string | null
    cancelledAt?: string | null
    cancelledReason?: string | null
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
    items: OrderItemViewModel[]
}
