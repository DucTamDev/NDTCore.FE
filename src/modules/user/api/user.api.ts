import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse } from '@/core/api/dtos/common.dtos'

import { identityClient } from '@/core/api/clients/identity.client'
import { UserProfileDto } from '@/modules/user/models/dtos/_index'

export const userApi = {
    getProfileAsync(): Promise<ApiResponse<UserProfileDto>> {
        return identityClient.get(API_ENDPOINTS.IDENTITY.USERS_API.GET_PROFILE)
    },
}
