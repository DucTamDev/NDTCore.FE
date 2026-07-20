import type { AdminUserDetailResponse } from '@/modules/user/models/dtos/admin-user-detail.dto'
import type { UserDetailViewModel } from '@/modules/user/models/view-models/user-detail.view-model'

export const userDetailMapper = {
    toViewModel(dto: AdminUserDetailResponse): UserDetailViewModel {
        return {
            id: dto.Id,
            email: dto.Email,
            userName: dto.UserName,
            firstName: dto.FirstName,
            lastName: dto.LastName,
            fullName: dto.FullName,
            phoneNumber: dto.PhoneNumber ?? null,
            avatarUrl: dto.AvatarUrl ?? null,
            dateOfBirth: dto.DateOfBirth ?? null,
            gender: dto.Gender ?? null,
            isActive: dto.IsActive,
            emailConfirmed: dto.EmailConfirmed,
            phoneNumberConfirmed: dto.PhoneNumberConfirmed,
            lockoutEnabled: dto.LockoutEnabled,
            lockoutEnd: dto.LockoutEnd ?? null,
            accessFailedCount: dto.AccessFailedCount,
            lastLoginAt: dto.LastLoginAt ?? null,
            roles: dto.Roles ?? [],
            tenantId: dto.TenantId,
            createdAt: dto.CreatedAt ?? null,
            createdBy: dto.CreatedBy ?? null,
            updatedAt: dto.UpdatedAt ?? null,
            updatedBy: dto.UpdatedBy ?? null,
            isDeleted: dto.IsDeleted,
            deletedAt: dto.DeletedAt ?? null,
            deletedBy: dto.DeletedBy ?? null,
        }
    },
}
