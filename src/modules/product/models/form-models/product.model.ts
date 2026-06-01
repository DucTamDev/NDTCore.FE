export interface ProductFormModel {
    categoryId: number | null
    sku: string
    name: string
    slug: string
    description: string
    shortDescription: string
    basePrice: number
    costPrice: number | null
    isActive: boolean
    displayOrder: number
    isFeatured: boolean
}

export function createEmptyProductForm(): ProductFormModel {
    return {
        categoryId: null,
        sku: '',
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        basePrice: 0,
        costPrice: null,
        isActive: true,
        displayOrder: 0,
        isFeatured: false,
    }
}
