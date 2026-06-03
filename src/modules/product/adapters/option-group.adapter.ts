import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'
import type { OptionGroupFormModel } from '../models/form-models/option-group.model'
import type { CreateOptionGroupRequest, UpdateOptionGroupRequest } from '../models/dtos/option-group.dto'

export function toForm(entity: OptionGroupViewModel): OptionGroupFormModel {
    return {
        name: entity.name,
        uiType: entity.uiType,
        description: entity.description ?? '',
        displayOrder: entity.displayOrder,
        isActive: entity.isActive,
    }
}

export function toPayload(form: OptionGroupFormModel): UpdateOptionGroupRequest {
    return {
        Name: form.name.trim(),
        UiType: form.uiType,
        Description: form.description || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function toCreatePayload(form: OptionGroupFormModel): CreateOptionGroupRequest {
    return {
        Name: form.name.trim(),
        UiType: form.uiType,
        Description: form.description || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function emptyForm(): OptionGroupFormModel {
    return {
        name: '',
        uiType: 'SingleSelect',
        description: '',
        displayOrder: 0,
        isActive: true,
    }
}
