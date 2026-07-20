import type { UserDto } from '@/modules/user/models/dtos/user.dto'
import type { CreateUserResponse } from '@/modules/user/models/dtos/create-user.dto'
import type { UserViewModel } from '@/modules/user/models/view-models/user.view-model'

export const userMapper = {
    toViewModels(dtos: UserDto[]): UserViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: UserDto): UserViewModel {
        return {
            id: dto.Id,
            email: dto.Email,
            userName: dto.UserName,
            firstName: dto.FirstName,
            lastName: dto.LastName,
            fullName: dto.FullName,
            phoneNumber: dto.PhoneNumber ?? null,
            avatarUrl: dto.AvatarUrl ?? null,
            emailConfirmed: dto.EmailConfirmed,
            phoneNumberConfirmed: dto.PhoneNumberConfirmed,
            isActive: dto.IsActive,
            lastLoginAt: dto.LastLoginAt ?? null,
            createdAt: dto.CreatedAt ?? null,
            updatedAt: dto.UpdatedAt ?? null,
            roles: dto.Roles ?? [],
        }
    },

    createResponseToViewModel(res: CreateUserResponse): UserViewModel {
        return {
            id: res.Id,
            email: res.Email,
            userName: res.UserName,
            firstName: res.FirstName,
            lastName: res.LastName,
            fullName: res.FullName,
            phoneNumber: null,
            avatarUrl: null,
            emailConfirmed: false,
            phoneNumberConfirmed: false,
            isActive: res.IsActive,
            lastLoginAt: null,
            createdAt: res.CreatedAt ?? null,
            updatedAt: null,
            roles: res.Roles ?? [],
        }
    },
}
