import { authApi } from '@/modules/auth/api/auth.api'

import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
} from '@/modules/auth/models/dtos/_index'

class AuthService {
    async loginAsync(payload: LoginRequest): Promise<LoginResponse | null> {
        const response = await authApi.loginAsync(payload)

        return response.Data
    }

    async registerAsync(payload: RegisterRequest): Promise<RegisterResponse | null> {
        const response = await authApi.registerAsync(payload)

        return response.Data
    }

    async refreshAsync(payload: RefreshTokenRequest): Promise<RefreshTokenResponse | null> {
        const response = await authApi.refreshAsync(payload)

        return response.Data
    }
}

export const authService = new AuthService()
