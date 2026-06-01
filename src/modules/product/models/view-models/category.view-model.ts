export interface CategoryViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    parentId: number | null
    name: string
    slug: string | null
    description: string | null
    imageUrl: string | null
    displayOrder: number
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
    createdBy: string | null
    updatedBy: string | null
}
