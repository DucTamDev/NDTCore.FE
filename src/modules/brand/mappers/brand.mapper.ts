import type {
    CreateBrandRequest,
    CreateBrandResponse,
    UpdateBrandRequest,
    UpdateBrandResponse,
} from '@/modules/brand/models/dtos/_index'
import { CURRENCY } from '@/core/constants/currency.constants'
import { TIMEZONE } from '@/core/constants/timezone.constants'
import type { BrandFormModel } from '@/modules/brand/models/form-models/brand.model'
import type { BrandViewModel } from '@/modules/brand/models/view-models/brand.view-model'
import { BrandDto } from '@/modules/brand/models/dtos/brand.dto'

export const brandMapper = {
    toViewModels(dtos: BrandDto[]): BrandViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: BrandDto): BrandViewModel {
        return {
            id: dto.Id,
            tenantId: dto.TenantId,
            name: dto.Name,
            code: dto.Code,
            isActive: dto.IsActive ?? null,
            legalName: dto.LegalName ?? null,
            taxCode: dto.TaxCode ?? null,
            currency: dto.Currency ?? null,
            timeZone: dto.TimeZone ?? null,
            createdAt: dto.CreatedAt,
            createdBy: dto.CreatedBy,
            updatedAt: dto.UpdatedAt,
            updatedBy: dto.UpdatedBy
        }
    },

    toFormModel(brand: BrandViewModel | null): BrandFormModel | null {
        if (brand == null || brand == undefined) {
            return null
        }

        return {
            name: brand.name ?? '',
            isActive: brand.isActive ?? false,
            legalName: brand.legalName ?? null,
            taxCode: brand.taxCode ?? null,
            currency: brand.currency ?? CURRENCY.DEFAULT,
            timeZone: brand.timeZone ?? TIMEZONE.DEFAULT,
            createdAt: brand.createdAt,
            createdBy: brand.createdBy,
            updatedAt: brand.updatedAt,
            updatedBy: brand.updatedBy
        }
    },

    createResponseToViewModel(response: CreateBrandResponse): BrandViewModel {
        return {
            id: response.Id,
            tenantId: response.TenantId,
            name: response.Name,
            code: response.Code,
            isActive: response.IsActive ?? null,
            legalName: response.LegalName ?? null,
            taxCode: response.TaxCode ?? null,
            currency: response.Currency ?? null,
            timeZone: response.TimeZone ?? null,
            createdAt: response.CreatedAt ?? null,
            createdBy: response.CreatedBy ?? null,
            updatedAt: null,
            updatedBy: null,
        }
    },

    updateResponseToViewModel(response: UpdateBrandResponse): BrandViewModel {
        return {
            id: response.Id,
            tenantId: response.TenantId,
            name: response.Name,
            code: response.Code,
            isActive: response.IsActive ?? null,
            legalName: response.LegalName ?? null,
            taxCode: response.TaxCode ?? null,
            currency: response.Currency ?? null,
            timeZone: response.TimeZone ?? null,
            createdAt: null,
            createdBy: null,
            updatedAt: response.UpdatedAt ?? null,
            updatedBy: response.UpdatedBy ?? null,
        }
    },

    formModelToCreateRequest(form: BrandFormModel): CreateBrandRequest {
        return {
            Name: form.name.trim(),
            LegalName: form.legalName?.trim() ?? null,
            TaxCode: form.taxCode?.trim() ?? null,
            Currency: form.currency ?? null,
            TimeZone: form.timeZone ?? null,
        }
    },

    formModelToUpdateRequest(form: BrandFormModel): UpdateBrandRequest {
        return {
            Name: form.name.trim(),
            IsActive: form.isActive ?? null,
            LegalName: form.legalName?.trim() ?? null,
            TaxCode: form.taxCode?.trim() ?? null,
            Currency: form.currency ?? null,
            TimeZone: form.timeZone ?? null,
        }
    },
}
