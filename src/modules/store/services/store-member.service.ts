import { storeMemberApi } from '@/modules/store/api/store-member.api'
import { storeMemberMapper } from '@/modules/store/mappers/store-member.mapper'
import type { AssignStoreMembersRequest } from '@/modules/store/models/dtos/store-member.dto'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

class StoreMemberService {
    async getByStoreAsync(storeId: number): Promise<StoreMemberViewModel[]> {
        const response = await storeMemberApi.getByStoreAsync(storeId)
        return storeMemberMapper.toViewModels(response.Data ?? [])
    }

    async assignAsync(storeId: number, payload: AssignStoreMembersRequest): Promise<void> {
        await storeMemberApi.assignAsync(storeId, payload)
    }

    async removeAsync(storeId: number, userId: string): Promise<void> {
        await storeMemberApi.removeAsync(storeId, userId)
    }
}

export const storeMemberService = new StoreMemberService()
