import type { TagViewModel } from '../models/view-models/tag.view-model'
import type { TagFormModel } from '../models/form-models/tag.model'
import type { CreateTagRequest, UpdateTagRequest } from '../models/dtos/tag.dto'

export function toForm(entity: TagViewModel): TagFormModel {
    return {
        name: entity.name,
        textColor: entity.textColor ?? '',
        colorHex: entity.colorHex ?? '',
        iconUrl: entity.iconUrl ?? '',
        displayOrder: entity.displayOrder,
        isActive: entity.isActive,
    }
}

export function toPayload(form: TagFormModel): UpdateTagRequest {
    return {
        Name: form.name.trim(),
        TextColor: form.textColor || null,
        ColorHex: form.colorHex || null,
        IconUrl: form.iconUrl || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function toCreatePayload(form: TagFormModel): CreateTagRequest {
    return {
        Name: form.name.trim(),
        TextColor: form.textColor || null,
        ColorHex: form.colorHex || null,
        IconUrl: form.iconUrl || null,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function emptyForm(): TagFormModel {
    return {
        name: '',
        textColor: '',
        colorHex: '',
        iconUrl: '',
        displayOrder: 0,
        isActive: true,
    }
}
