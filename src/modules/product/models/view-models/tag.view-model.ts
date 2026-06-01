export interface TagViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    name: string
    textColor: string | null
    colorHex: string | null
    iconUrl: string | null
    displayOrder: number
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
    createdBy: string | null
    updatedBy: string | null
}
