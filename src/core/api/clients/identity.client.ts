// src/core/api/clients/identity.client.ts
import { ApiClient } from './api.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import { createLogger } from '@/core/logger/logger'
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
} from '@/core/api/dtos/auth.dtos'
import type { ApiResponse } from '@/core/api/dtos/common.dtos'
import type { UserProfileResponse } from '@/core/api/dtos/user.dtos'
import { ApiInternalConfig } from '../types/api.types'

const log = createLogger('identity')

class IdentityClient extends ApiClient {
    constructor() {
        super({
            baseURL: import.meta.env.VITE_IDENTITY_API_URL,
            timeout: 20_000,
        })
    }

    loginAsync(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const config: Partial<ApiInternalConfig> = {
            skipAuth: true,
        }

        return this.post<ApiResponse<LoginResponse>>(
            API_ENDPOINTS.IDENTITY.AUTH_API.LOGIN,
            payload,
            config,
        )
    }

    refreshAsync(payload: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
        const config: Partial<ApiInternalConfig> = {
            skipAuth: true,
            skipAuthRefresh: true,
        }

        return this.post<ApiResponse<RefreshTokenResponse>>(
            API_ENDPOINTS.IDENTITY.AUTH_API.REFRESH,
            payload,
            config,
        )
    }

    getMeAsync(): Promise<ApiResponse<UserProfileResponse>> {
        return this.get<ApiResponse<UserProfileResponse>>(API_ENDPOINTS.IDENTITY.USERS_API.GET_ME)
    }
}

export const identityClient = new IdentityClient()
