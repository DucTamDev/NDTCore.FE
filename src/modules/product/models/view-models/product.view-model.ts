export interface ProductViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    categoryId: number | null
    categoryName: string | null
    sku: string
    name: string
    slug: string | null
    description: string | null
    shortDescription: string | null
    regularPrice: number
    costPrice: number | null
    isActive: boolean
    displayOrder: number
    isFeatured: boolean
    createdAt: string | null
    updatedAt: string | null
    createdBy: string | null
    updatedBy: string | null
}
