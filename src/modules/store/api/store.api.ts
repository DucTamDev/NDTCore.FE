import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type { StoreDto } from '@/modules/store/models/dtos/store.dto'
import type { StoreFilterDto } from '@/modules/store/models/dtos/store-filter.dto'
import type { CreateStoreRequest, CreateStoreResponse } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest, UpdateStoreResponse } from '@/modules/store/models/dtos/update-store.dto'
import type { DeleteStoreResponse } from '@/modules/store/models/dtos/delete-store.dto'
import { storeClient } from '@/core/api/clients/store.client'

export const storeApi = {
    getPagedAsync(params: StoreFilterDto): Promise<PagedApiResponse<StoreDto>> {
        return storeClient.get(API_ENDPOINTS.STORE.STORE_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<StoreDto>> {
        return storeClient.get(API_ENDPOINTS.STORE.STORE_API.GET_BY_ID(id))
    },

    createAsync(payload: CreateStoreRequest): Promise<ApiResponse<CreateStoreResponse>> {
        return storeClient.post(API_ENDPOINTS.STORE.STORE_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateStoreRequest): Promise<ApiResponse<UpdateStoreResponse>> {
        return storeClient.put(API_ENDPOINTS.STORE.STORE_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteStoreResponse>> {
        return storeClient.delete(API_ENDPOINTS.STORE.STORE_API.DELETE(id))
    },
}
