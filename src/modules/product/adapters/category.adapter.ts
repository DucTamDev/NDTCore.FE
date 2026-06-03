import type { CategoryViewModel } from '../models/view-models/category.view-model'
import type { CategoryFormModel } from '../models/form-models/category.model'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../models/dtos/category.dto'

export function toForm(entity: CategoryViewModel): CategoryFormModel {
    return {
        name: entity.name,
        slug: entity.slug ?? '',
        description: entity.description ?? '',
        imageUrl: entity.imageUrl ?? '',
        parentId: entity.parentId,
        displayOrder: entity.displayOrder,
        isActive: entity.isActive,
    }
}

export function toPayload(form: CategoryFormModel): UpdateCategoryRequest {
    return {
        Name: form.name.trim(),
        Slug: form.slug || null,
        Description: form.description || null,
        ImageUrl: form.imageUrl || null,
        ParentId: form.parentId,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function toCreatePayload(form: CategoryFormModel): CreateCategoryRequest {
    return {
        Name: form.name.trim(),
        Slug: form.slug || null,
        Description: form.description || null,
        ImageUrl: form.imageUrl || null,
        ParentId: form.parentId,
        DisplayOrder: form.displayOrder,
        IsActive: form.isActive,
    }
}

export function emptyForm(): CategoryFormModel {
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
