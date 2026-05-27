import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse } from '@/core/models/common.dto'

import { identityClient } from '@/core/api/clients/identity.client'
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from '@/modules/auth/models/dtos/_index'
import {
    RefreshTokenRequest,
    RefreshTokenResponse,
} from '@/modules/auth/models/dtos/refresh-token.dto'
import { RequestConfig } from '@/core/api/clients/base.client'

export const authApi = {
    loginAsync(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return identityClient.post(API_ENDPOINTS.IDENTITY.AUTH_API.LOGIN, payload)
    },

    registerAsync(payload: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        return identityClient.post(API_ENDPOINTS.IDENTITY.AUTH_API.LOGIN, payload)
    },

    refreshAsync(payload: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
        const config: Partial<RequestConfig> = {
            skipAuth: true,
            skipAuthRefresh: true,
        }

        return identityClient.post<ApiResponse<RefreshTokenResponse>>(
            API_ENDPOINTS.IDENTITY.AUTH_API.REFRESH,
            payload,
            config,
        )
    },

}
