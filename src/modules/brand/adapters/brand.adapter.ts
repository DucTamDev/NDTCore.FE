import type { BrandViewModel } from '../models/view-models/brand.view-model'
import type { BrandFormModel } from '../models/form-models/brand.model'
import type { UpdateBrandRequest } from '../models/dtos/update-brand.dto'

export const TRACKED_FIELDS: ReadonlyArray<keyof BrandFormModel> = [
    'name', 'isActive', 'legalName', 'taxCode',
] as const

export function toForm(entity: BrandViewModel): BrandFormModel {
    return {
        name: entity.name ?? '',
        isActive: entity.isActive ?? false,
        legalName: entity.legalName ?? null,
        taxCode: entity.taxCode ?? null,
    }
}

export function toPayload(form: BrandFormModel): UpdateBrandRequest {
    return {
        Name: form.name.trim(),
        IsActive: form.isActive,
        LegalName: form.legalName?.trim() ?? null,
        TaxCode: form.taxCode?.trim() ?? null,
    }
}

export function emptyForm(): BrandFormModel {
    return {
        name: '',
        isActive: true,
        legalName: null,
        taxCode: null,
    }
}
