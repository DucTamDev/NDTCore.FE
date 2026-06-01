export interface TagFormModel {
    name: string
    textColor: string
    colorHex: string
    iconUrl: string
    displayOrder: number
    isActive: boolean
}

export function createEmptyTagForm(): TagFormModel {
    return {
        name: '',
        textColor: '',
        colorHex: '',
        iconUrl: '',
        displayOrder: 0,
        isActive: true,
    }
}
