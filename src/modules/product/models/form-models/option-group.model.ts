export interface OptionGroupFormModel {
    name: string
    uiType: string
    description: string
    displayOrder: number
    isActive: boolean
}

export function createEmptyOptionGroupForm(): OptionGroupFormModel {
    return {
        name: '',
        uiType: 'SingleSelect',
        description: '',
        displayOrder: 0,
        isActive: true,
    }
}
