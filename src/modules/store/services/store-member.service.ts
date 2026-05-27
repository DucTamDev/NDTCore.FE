import { storeMemberApi } from '@/modules/store/api/store-member.api'
import { storeMemberMapper } from '@/modules/store/mappers/store-member.mapper'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

class StoreMemberService {
    async getMembersByStoreAsync(storeId: number): Promise<StoreMemberViewModel[]> {
        const response = await storeMemberApi.getMembersByStoreAsync(storeId)
        return storeMemberMapper.toViewModels(response.Data ?? [])
    }

    async assignAsync(storeId: number, userId: string): Promise<void> {
        await storeMemberApi.assignAsync(storeId, userId)
    }

    async removeAsync(storeId: number, userId: string): Promise<void> {
        await storeMemberApi.removeAsync(storeId, userId)
    }
}

export const storeMemberService = new StoreMemberService()
