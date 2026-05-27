import type { StoreDto } from '@/modules/store/models/dtos/store.dto'
import type { CreateStoreResponse } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreResponse } from '@/modules/store/models/dtos/update-store.dto'
import type { CreateStoreRequest } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '@/modules/store/models/dtos/update-store.dto'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'

export const storeMapper = {
    toViewModels(dtos: StoreDto[]): StoreViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: StoreDto): StoreViewModel {
        return {
            id: dto.Id,
            tenantId: dto.TenantId,
            brandId: dto.BrandId,
            franchiseeId: dto.FranchiseeId ?? null,
            name: dto.Name,
            code: dto.Code,
            slug: dto.Slug ?? null,
            logoUrl: dto.LogoUrl ?? null,
            isActive: dto.IsActive,
            isAcceptingOrders: dto.IsAcceptingOrders,
            phone: dto.Phone ?? null,
            email: dto.Email ?? null,
            address: dto.Address ?? null,
            city: dto.City ?? null,
            ward: dto.Ward ?? null,
            district: dto.District ?? null,
            province: dto.Province ?? null,
            country: dto.Country ?? null,
            latitude: dto.Latitude ?? null,
            longitude: dto.Longitude ?? null,
            openTime: dto.OpenTime ?? null,
            closeTime: dto.CloseTime ?? null,
            timeZone: dto.TimeZone ?? null,
            createdAt: dto.CreatedAt ?? null,
            createdBy: dto.CreatedBy ?? null,
            updatedAt: dto.UpdatedAt ?? null,
            updatedBy: dto.UpdatedBy ?? null,
        }
    },

    toFormModel(store: StoreViewModel | null): StoreFormModel | null {
        if (!store) return null
        return {
            brandId: store.brandId,
            franchiseeId: store.franchiseeId ?? null,
            name: store.name,
            code: store.code,
            slug: store.slug ?? null,
            logoUrl: store.logoUrl ?? null,
            isActive: store.isActive,
            isAcceptingOrders: store.isAcceptingOrders,
            phone: store.phone ?? null,
            email: store.email ?? null,
            address: store.address ?? null,
            city: store.city ?? null,
            ward: store.ward ?? null,
            district: store.district ?? null,
            province: store.province ?? null,
            country: store.country ?? null,
            latitude: store.latitude ?? null,
            longitude: store.longitude ?? null,
            openTime: store.openTime ?? null,
            closeTime: store.closeTime ?? null,
            timeZone: store.timeZone ?? null,
        }
    },

    createResponseToViewModel(res: CreateStoreResponse): StoreViewModel {
        return this.toViewModel(res)
    },

    updateResponseToViewModel(res: UpdateStoreResponse): StoreViewModel {
        return this.toViewModel(res)
    },

    formModelToCreateRequest(form: StoreFormModel): CreateStoreRequest {
        return {
            BrandId: form.brandId!,
            FranchiseeId: form.franchiseeId ?? null,
            Name: form.name.trim(),
            Code: form.code.trim(),
            Slug: form.slug?.trim() ?? null,
            LogoUrl: form.logoUrl?.trim() ?? null,
            IsActive: form.isActive,
            IsAcceptingOrders: form.isAcceptingOrders,
            Phone: form.phone?.trim() ?? null,
            Email: form.email?.trim() ?? null,
            Address: form.address?.trim() ?? null,
            City: form.city?.trim() ?? null,
            Ward: form.ward?.trim() ?? null,
            District: form.district?.trim() ?? null,
            Province: form.province?.trim() ?? null,
            Country: form.country?.trim() ?? null,
            Latitude: form.latitude ?? null,
            Longitude: form.longitude ?? null,
            OpenTime: form.openTime ?? null,
            CloseTime: form.closeTime ?? null,
            TimeZone: form.timeZone?.trim() ?? null,
        }
    },

    formModelToUpdateRequest(form: StoreFormModel): UpdateStoreRequest {
        return {
            Name: form.name.trim(),
            Slug: form.slug?.trim() ?? null,
            LogoUrl: form.logoUrl?.trim() ?? null,
            IsActive: form.isActive,
            IsAcceptingOrders: form.isAcceptingOrders,
            Phone: form.phone?.trim() ?? null,
            Email: form.email?.trim() ?? null,
            Address: form.address?.trim() ?? null,
            City: form.city?.trim() ?? null,
            Ward: form.ward?.trim() ?? null,
            District: form.district?.trim() ?? null,
            Province: form.province?.trim() ?? null,
            Country: form.country?.trim() ?? null,
            Latitude: form.latitude ?? null,
            Longitude: form.longitude ?? null,
            OpenTime: form.openTime ?? null,
            CloseTime: form.closeTime ?? null,
            TimeZone: form.timeZone?.trim() ?? null,
        }
    },
}
