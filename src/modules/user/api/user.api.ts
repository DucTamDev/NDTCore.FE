import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'

import { identityClient } from '@/core/api/clients/identity.client'
import type { UserProfileDto, UserDto } from '@/modules/user/models/dtos/_index'
import type { UserFilterDto } from '@/modules/user/models/dtos/user-filter.dto'
import type { CreateUserRequest, CreateUserResponse } from '@/modules/user/models/dtos/create-user.dto'
import type { UpdateUserRequest, UpdateUserResponse } from '@/modules/user/models/dtos/update-user.dto'
import type { DeleteUserResponse } from '@/modules/user/models/dtos/delete-user.dto'
import type { AssignRolesRequest, AssignRolesResponse } from '@/modules/user/models/dtos/assign-roles.dto'
import type { AdminUserDetailResponse } from '@/modules/user/models/dtos/admin-user-detail.dto'

export const userApi = {
    getProfileAsync(): Promise<ApiResponse<UserProfileDto>> {
        return identityClient.get(API_ENDPOINTS.IDENTITY.USERS_API.GET_PROFILE)
    },

    getPagedAsync(params: UserFilterDto): Promise<PagedApiResponse<UserDto>> {
        return identityClient.get(API_ENDPOINTS.IDENTITY.USERS_API.GET_PAGED, params)
    },

    getByIdAsync(id: string): Promise<ApiResponse<AdminUserDetailResponse>> {
        return identityClient.get(API_ENDPOINTS.IDENTITY.USERS_API.GET_BY_ID(id))
    },

    createAsync(payload: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
        return identityClient.post(API_ENDPOINTS.IDENTITY.USERS_API.CREATE, payload)
    },

    updateAsync(id: string, payload: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>> {
        return identityClient.put(API_ENDPOINTS.IDENTITY.USERS_API.UPDATE(id), payload)
    },

    deleteAsync(id: string): Promise<ApiResponse<DeleteUserResponse>> {
        return identityClient.delete(API_ENDPOINTS.IDENTITY.USERS_API.DELETE(id))
    },

    assignRolesAsync(id: string, payload: AssignRolesRequest): Promise<ApiResponse<AssignRolesResponse>> {
        return identityClient.put(API_ENDPOINTS.IDENTITY.USERS_API.ASSIGN_ROLES(id), payload)
    },
}
