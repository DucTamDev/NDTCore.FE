import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse } from '@/core/models/common.dto'
import type {
    StoreMemberDto,
    AssignStoreMembersRequest,
    AssignStoreMembersResponse,
    RemoveStoreMemberResponse,
} from '@/modules/store/models/dtos/store-member.dto'
import { storeClient } from '@/core/api/clients/store.client'

export const storeMemberApi = {
    getByStoreAsync(storeId: number): Promise<ApiResponse<StoreMemberDto[]>> {
        return storeClient.get(API_ENDPOINTS.STORE.STORE_MEMBER_API.GET_BY_STORE(storeId))
    },

    assignAsync(storeId: number, payload: AssignStoreMembersRequest): Promise<ApiResponse<AssignStoreMembersResponse>> {
        return storeClient.post(API_ENDPOINTS.STORE.STORE_MEMBER_API.ASSIGN(storeId), payload)
    },

    removeAsync(storeId: number, userId: string): Promise<ApiResponse<RemoveStoreMemberResponse>> {
        return storeClient.delete(API_ENDPOINTS.STORE.STORE_MEMBER_API.REMOVE(storeId, userId))
    },
}
