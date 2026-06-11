export interface PosCartOption {
    optionId: number
    optionName: string
    groupId: number
    resolvedPrice: number
}

export interface PosCartItem {
    uid: string
    productId: number
    productName: string
    resolvedPrice: number
    quantity: number
    note: string
    selectedOptions: PosCartOption[]
}
