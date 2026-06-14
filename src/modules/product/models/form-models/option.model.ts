export interface OptionFormModel {
    groupId: number | null
    name: string
    price: number
    description: string
    imageUrl: string
    displayOrder: number
    isActive: boolean
}

export function createEmptyOptionForm(groupId?: number): OptionFormModel {
    return {
        groupId: groupId ?? null,
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        displayOrder: 0,
        isActive: true,
    }
}
