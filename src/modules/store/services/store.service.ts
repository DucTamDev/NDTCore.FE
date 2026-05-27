import { storeApi } from '@/modules/store/api/store.api'
import { storeMapper } from '@/modules/store/mappers/store.mapper'
import type { StoreFilterDto } from '@/modules/store/models/dtos/store-filter.dto'
import type { CreateStoreRequest } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '@/modules/store/models/dtos/update-store.dto'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class StoreService {
    async getPagedStoresAsync(filter: StoreFilterDto): Promise<PagedResult<StoreViewModel>> {
        const response = await storeApi.getPagedAsync(filter)
        return {
            items: storeMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getStoreAsync(id: number): Promise<StoreViewModel | null> {
        const response = await storeApi.getByIdAsync(id)
        return response.Data ? storeMapper.toViewModel(response.Data) : null
    }

    async createStoreAsync(payload: CreateStoreRequest): Promise<StoreViewModel | null> {
        const response = await storeApi.createAsync(payload)
        return response.Data ? storeMapper.createResponseToViewModel(response.Data) : null
    }

    async updateStoreAsync(id: number, payload: UpdateStoreRequest): Promise<StoreViewModel | null> {
        const response = await storeApi.updateAsync(id, payload)
        return response.Data ? storeMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteStoreAsync(id: number): Promise<void> {
        await storeApi.deleteAsync(id)
    }
}

export const storeService = new StoreService()
