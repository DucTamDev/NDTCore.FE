export interface PosCartOption {
    optionId: number
    optionName: string
    groupId: number
    groupName: string
    resolvedPrice: number
}

export interface PosCartItem {
    uid: string
    productId: number
    productCode: string
    productName: string
    imageUrl: string | null
    resolvedPrice: number
    quantity: number
    note: string
    selectedOptions: PosCartOption[]
}
