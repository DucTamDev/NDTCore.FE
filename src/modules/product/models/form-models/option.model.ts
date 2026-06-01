export interface OptionFormModel {
    groupId: number | null
    name: string
    defaultPrice: number
    description: string
    imageUrl: string
    displayOrder: number
    isActive: boolean
}

export function createEmptyOptionForm(groupId?: number): OptionFormModel {
    return {
        groupId: groupId ?? null,
        name: '',
        defaultPrice: 0,
        description: '',
        imageUrl: '',
        displayOrder: 0,
        isActive: true,
    }
}
