import { userApi } from '@/modules/user/api/user.api'
import { userMapper } from '@/modules/user/mappers/user.mapper'
import { userDetailMapper } from '@/modules/user/mappers/user-detail.mapper'
import type { UserProfileDto } from '@/modules/user/models/dtos/_index'
import type { UserFilterDto } from '@/modules/user/models/dtos/user-filter.dto'
import type { CreateUserRequest } from '@/modules/user/models/dtos/create-user.dto'
import type { UpdateUserRequest } from '@/modules/user/models/dtos/update-user.dto'
import type { AssignRolesRequest } from '@/modules/user/models/dtos/assign-roles.dto'
import type { UserViewModel } from '@/modules/user/models/view-models/user.view-model'
import type { UserDetailViewModel } from '@/modules/user/models/view-models/user-detail.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class UserService {
    async getProfileAsync(): Promise<UserProfileDto | null> {
        const response = await userApi.getProfileAsync()

        return response.Data
    }

    async getPagedUsersAsync(filter: UserFilterDto): Promise<PagedResult<UserViewModel>> {
        const response = await userApi.getPagedAsync(filter)
        return {
            items: userMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getUserAsync(id: string): Promise<UserDetailViewModel | null> {
        const response = await userApi.getByIdAsync(id)
        return response.Data ? userDetailMapper.toViewModel(response.Data) : null
    }

    async createUserAsync(payload: CreateUserRequest): Promise<UserViewModel | null> {
        const response = await userApi.createAsync(payload)
        return response.Data ? userMapper.createResponseToViewModel(response.Data) : null
    }

    async updateUserAsync(id: string, payload: UpdateUserRequest): Promise<void> {
        await userApi.updateAsync(id, payload)
    }

    async deleteUserAsync(id: string): Promise<void> {
        await userApi.deleteAsync(id)
    }

    async assignRolesAsync(id: string, payload: AssignRolesRequest): Promise<void> {
        await userApi.assignRolesAsync(id, payload)
    }
}

export const userService = new UserService()
