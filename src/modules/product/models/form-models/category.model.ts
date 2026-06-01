export interface CategoryFormModel {
    name: string
    slug: string
    description: string
    imageUrl: string
    parentId: number | null
    displayOrder: number
    isActive: boolean
}

export function createEmptyCategoryForm(): CategoryFormModel {
    return {
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        parentId: null,
        displayOrder: 0,
        isActive: true,
    }
}
