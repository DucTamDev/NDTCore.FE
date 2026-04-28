import { storageService } from './storage.service'
import { STORAGE_KEYS, STORAGE_TYPE, type StorageType } from './storage.keys'
import type { AuthTokenModel } from '@/models/auth.model'

class TokenStorageService {
    save(tokens: AuthTokenModel): void {
        storageService.set(STORAGE_KEYS.AUTH_TOKENS, tokens, STORAGE_TYPE.LOCAL)
    }

    get(): AuthTokenModel | null {
        return storageService.get<AuthTokenModel>(STORAGE_KEYS.AUTH_TOKENS, STORAGE_TYPE.LOCAL)
    }

    clear(): void {
        storageService.remove(STORAGE_KEYS.AUTH_TOKENS, STORAGE_TYPE.LOCAL)
    }

    getAccessToken(): string | null {
        return this.get()?.accessToken ?? null
    }

    getRefreshToken(): string | null {
        return this.get()?.refreshToken ?? null
    }

    isAccessTokenExpired(): boolean {
        const exp = this.get()?.accessTokenExpiration
        return !exp || new Date(exp) <= new Date()
    }

    isRefreshTokenExpired(): boolean {
        const exp = this.get()?.refreshTokenExpiration
        return !exp || new Date(exp) <= new Date()
    }
}

export const tokenStorageService = new TokenStorageService()
