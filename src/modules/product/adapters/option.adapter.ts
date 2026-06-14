import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { OptionFormModel } from '../models/form-models/option.model'
import type { CreateOptionRequest, UpdateOptionRequest } from '../models/dtos/option.dto'

export function toForm(entity: OptionViewModel): OptionFormModel {
    return {
        groupId: entity.groupId,
        name: entity.name,
        price: entity.price,
        description: entity.description ?? '',
        imageUrl: entity.imageUrl ?? '',
        displayOrder: entity.displayOrder,
        isActive: entity.isActive,
    }
}

export function toCreatePayload(form: OptionFormModel & { groupId: number }): CreateOptionRequest {
    return {
        GroupId: form.groupId,
        Name: form.name,
        Price: form.price,
        Description: form.description || null,
        ImageUrl: form.imageUrl || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function toPayload(form: OptionFormModel): UpdateOptionRequest {
    return {
        Name: form.name.trim(),
        Price: form.price,
        Description: form.description || null,
        ImageUrl: form.imageUrl || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function emptyForm(): OptionFormModel {
    return {
        groupId: null,
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        displayOrder: 0,
        isActive: true,
    }
}
