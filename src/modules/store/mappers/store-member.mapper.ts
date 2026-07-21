import type { StoreMemberDto } from '@/modules/store/models/dtos/store-member.dto'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

export const storeMemberMapper = {
    toViewModel(dto: StoreMemberDto): StoreMemberViewModel {
        return {
            storeId: dto.StoreId,
            tenantId: dto.TenantId,
            userId: dto.UserId,
            userName: dto.UserName,
            email: dto.Email,
            fullName: dto.FullName,
            avatarUrl: dto.AvatarUrl ?? null,
            isActive: dto.IsActive,
            roles: dto.Roles,
            assignedAt: dto.AssignedAt,
        }
    },

    toViewModels(dtos: StoreMemberDto[]): StoreMemberViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },
}
