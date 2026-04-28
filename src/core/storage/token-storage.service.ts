import { storageService } from './storage.service'
import { STORAGE_KEYS, STORAGE_TYPE, type StorageType } from './storage.keys'
import type { AuthTokenModel } from '@/models/auth.model'

let _storageType: StorageType = STORAGE_TYPE.LOCAL

class TokenStorageService {
    save(tokens: AuthTokenModel, type: StorageType): void {
        _storageType = type
        storageService.set(STORAGE_KEYS.AUTH_TOKENS, tokens, type)
    }

    get(): AuthTokenModel | null {
        return storageService.get<AuthTokenModel>(STORAGE_KEYS.AUTH_TOKENS, _storageType)
    }

    clear(): void {
        storageService.remove(STORAGE_KEYS.AUTH_TOKENS, _storageType)
        _storageType = STORAGE_TYPE.LOCAL
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
