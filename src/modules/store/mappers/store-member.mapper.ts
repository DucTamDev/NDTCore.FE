import type { StoreMemberDto } from '@/modules/store/models/dtos/store-member.dto'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

export const storeMemberMapper = {
    toViewModel(dto: StoreMemberDto): StoreMemberViewModel {
        return {
            storeId: dto.StoreId,
            userId: dto.UserId,
            tenantId: dto.TenantId,
        }
    },

    toViewModels(dtos: StoreMemberDto[]): StoreMemberViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },
}
