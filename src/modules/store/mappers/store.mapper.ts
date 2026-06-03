import type { StoreDto } from '@/modules/store/models/dtos/store.dto'
import type { CreateStoreResponse } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreResponse } from '@/modules/store/models/dtos/update-store.dto'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'

export const storeMapper = {
    toViewModels(dtos: StoreDto[]): StoreViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: StoreDto): StoreViewModel {
        return {
            id: dto.Id,
            tenantId: dto.TenantId,
            brandId: dto.BrandId,
            brandName: dto.BrandName ?? null,
            franchiseeId: dto.FranchiseeId ?? null,
            franchiseeName: dto.FranchiseeName ?? null,
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

    createResponseToViewModel(res: CreateStoreResponse): StoreViewModel {
        return this.toViewModel(res)
    },

    updateResponseToViewModel(res: UpdateStoreResponse): StoreViewModel {
        return this.toViewModel(res)
    },
}
