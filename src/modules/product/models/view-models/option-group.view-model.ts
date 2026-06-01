export interface OptionGroupViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    name: string
    uiType: string
    description: string | null
    displayOrder: number
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
    createdBy: string | null
    updatedBy: string | null
}
