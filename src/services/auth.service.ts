import { identityClient } from '@/core/api/clients/identity.client'
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
} from '@/core/api/dtos/auth.dtos'
import { AuthUserModel } from '@/models/auth.model'

class AuthService {
    async loginAsync(payload: LoginRequest): Promise<LoginResponse | null> {
        const response = await identityClient.loginAsync(payload)
        return response.Data
    }

    async refreshAsync(payload: RefreshTokenRequest): Promise<RefreshTokenResponse | null> {
        const response = await identityClient.refreshAsync(payload)

        return response.Data
    }

    async getMeAsync(): Promise<AuthUserModel | null> {
        const response = await identityClient.getMeAsync()

        if (!response.Data) {
            return null
        }

        const authUserModel: AuthUserModel = {
            roles: response.Data.Roles.map((r) => r.Name),
        }

        return authUserModel
    }
}

export const authService = new AuthService()
