import { LOCAL_STORAGE_KEYS } from '@/constants/local-storages'
import type { AuthTokens, User } from '@/models/auth.models'
import { storage } from '@/infrastructure/storage/local-storage'

class TokenService {
  getAccessToken(): string | null {
    return storage.get<string>(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
  }

  getRefreshToken(): string | null {
    return storage.get<string>(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
  }

  getUser(): User | null {
    return storage.get<User>(LOCAL_STORAGE_KEYS.USER_INFO)
  }

  setTokens(tokens: AuthTokens): void {
    storage.set(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
    storage.set(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
  }

  setUser(user: User): void {
    storage.set(LOCAL_STORAGE_KEYS.USER_INFO, user)
  }

  clear(): void {
    storage.remove(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
    storage.remove(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    storage.remove(LOCAL_STORAGE_KEYS.USER_INFO)
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

export const tokenService = new TokenService()
