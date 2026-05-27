import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type { StoreMemberDto } from '@/modules/store/models/dtos/store-member.dto'
import { storeClient } from '@/core/api/clients/store.client'

export const storeMemberApi = {
    getMembersByStoreAsync(storeId: number): Promise<PagedApiResponse<StoreMemberDto>> {
        return storeClient.get(API_ENDPOINTS.STORE.STORE_MEMBER_API.GET_BY_STORE(storeId))
    },

    assignAsync(storeId: number, userId: string): Promise<ApiResponse<StoreMemberDto>> {
        return storeClient.post(API_ENDPOINTS.STORE.STORE_MEMBER_API.ASSIGN(storeId), { userId })
    },

    removeAsync(storeId: number, userId: string): Promise<ApiResponse<void>> {
        return storeClient.delete(API_ENDPOINTS.STORE.STORE_MEMBER_API.REMOVE(storeId, userId))
    },
}
