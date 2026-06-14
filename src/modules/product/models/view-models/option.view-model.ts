export interface OptionViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    groupId: number
    name: string
    price: number
    description: string | null
    imageUrl: string | null
    displayOrder: number
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
    createdBy: string | null
    updatedBy: string | null
}
