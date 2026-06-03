import type { ProductViewModel } from '../models/view-models/product.view-model'
import type { ProductFormModel } from '../models/form-models/product.model'
import type { CreateProductRequest, UpdateProductRequest } from '../models/dtos/product.dto'

export function toForm(entity: ProductViewModel): ProductFormModel {
    return {
        categoryId: entity.categoryId,
        sku: entity.sku,
        name: entity.name,
        slug: entity.slug ?? '',
        description: entity.description ?? '',
        shortDescription: entity.shortDescription ?? '',
        basePrice: entity.basePrice,
        costPrice: entity.costPrice,
        isActive: entity.isActive,
        displayOrder: entity.displayOrder,
        isFeatured: entity.isFeatured,
    }
}

export function toPayload(form: ProductFormModel): UpdateProductRequest {
    return {
        CategoryId: form.categoryId,
        Name: form.name.trim(),
        Slug: form.slug || null,
        Description: form.description || null,
        ShortDescription: form.shortDescription || null,
        BasePrice: form.basePrice,
        CostPrice: form.costPrice,
        IsActive: form.isActive,
        DisplayOrder: form.displayOrder,
        IsFeatured: form.isFeatured,
    }
}

export function toCreatePayload(form: ProductFormModel): CreateProductRequest {
    return {
        CategoryId: form.categoryId,
        Sku: form.sku,
        Name: form.name.trim(),
        Slug: form.slug || null,
        Description: form.description || null,
        ShortDescription: form.shortDescription || null,
        BasePrice: form.basePrice,
        CostPrice: form.costPrice,
        IsActive: form.isActive,
        DisplayOrder: form.displayOrder,
        IsFeatured: form.isFeatured,
    }
}

export function emptyForm(): ProductFormModel {
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
