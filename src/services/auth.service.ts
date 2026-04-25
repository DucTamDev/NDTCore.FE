import { tokenService } from '@/infrastructure/auth/token.service'
import { apiClient } from '@/infrastructure/http/api-client'
import { API_ENDPOINTS } from '@/constants/api.constants'
import { pinia } from '@/plugins/pinia'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthTokens, LoginRequest, Permission, RegisterRequest, User } from '@/types/auth.types'

interface LoginApiResponse {
  AccessToken: string
  RefreshToken: string
  AccessTokenExpiration: string
  RefreshTokenExpiration: string
}

interface JwtPayload {
  sub?: string
  name?: string
  email?: string
  role?: string | string[]
  tenant_id?: string
  user_tenant_id?: string
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return window.atob(padded)
}

function parseJwtPayload(token: string): JwtPayload {
  const [, payload] = token.split('.')
  if (!payload) {
    throw new Error('Access token khong hop le.')
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload
  } catch {
    throw new Error('Khong the doc thong tin tu access token.')
  }
}

function getRoles(payload: JwtPayload): string[] {
  if (Array.isArray(payload.role)) {
    return payload.role.filter((role): role is string => typeof role === 'string' && role.length > 0)
  }

  if (typeof payload.role === 'string' && payload.role.trim().length > 0) {
    return [payload.role]
  }

  return []
}

function createPermissions(roles: string[]): Permission[] {
  const normalizedRoles = roles.map((role) => role.toLowerCase())

  if (normalizedRoles.includes('superadmin') || normalizedRoles.includes('orgadmin')) {
    return [
      { resource: 'dashboard', action: 'read' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'manage' },
    ]
  }

  if (normalizedRoles.includes('orgcashier')) {
    return [
      { resource: 'dashboard', action: 'read' },
      { resource: 'users', action: 'read' },
    ]
  }

  return [{ resource: 'dashboard', action: 'read' }]
}

function createUserFromToken(accessToken: string): User {
  const payload = parseJwtPayload(accessToken)
  const roles = getRoles(payload)

  return {
    id: payload.sub ?? crypto.randomUUID(),
    name: payload.name || payload.email?.split('@')[0] || 'guest',
    email: payload.email ?? '',
    role: roles[0] ?? 'user',
    permissions: createPermissions(roles),
  }
}

function mapTokens(response: LoginApiResponse): AuthTokens {
  return {
    accessToken: response.AccessToken,
    refreshToken: response.RefreshToken,
  }
}

class AuthService {
  private get store() {
    return useAuthStore(pinia)
  }

  initialize(): void {
    const accessToken = tokenService.getAccessToken()
    const refreshToken = tokenService.getRefreshToken()

    if (!accessToken || !refreshToken) return

    try {
      const user = tokenService.getUser() ?? createUserFromToken(accessToken)

      this.store.setSession(user, {
        accessToken,
        refreshToken,
      })
      tokenService.setUser(user)
    } catch {
      this.store.clearSession()
      tokenService.clear()
    }
  }

  async login(payload: LoginRequest) {
    if (!payload.email || !payload.password) {
      throw new Error('Vui long nhap day du email va mat khau.')
    }

    const response = await apiClient.post<LoginApiResponse, LoginRequest>(API_ENDPOINTS.AUTH.LOGIN, payload, {
      skipAuth: true,
    })

    if (!response.IsSuccess || !response.Data) {
      throw new Error(response.Message ?? 'Dang nhap that bai.')
    }

    const tokens = mapTokens(response.Data)
    const user = createUserFromToken(tokens.accessToken)

    this.store.setSession(user, tokens)
    tokenService.setTokens(tokens)
    tokenService.setUser(user)

    return user
  }

  async register(payload: RegisterRequest) {
    if (!payload.fullName || !payload.email || !payload.password) {
      throw new Error('Vui long dien day du thong tin dang ky.')
    }

    return {
      id: crypto.randomUUID(),
      name: payload.fullName,
      email: payload.email,
      role: 'user',
      permissions: createPermissions(['user']),
    }
  }

  async logout() {
    this.store.clearSession()
    tokenService.clear()
  }

  isAuthenticated(): boolean {
    return this.store.isAuthenticated
  }

  getUserRole(): string | null {
    return this.store.userRole
  }

  hasPermission(permission: Permission): boolean {
    return (
      this.store.user?.permissions.some(
        (candidate) =>
          candidate.resource === permission.resource &&
          (candidate.action === permission.action || candidate.action === 'manage'),
      ) ?? false
    )
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission))
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission))
  }
}

export const authService = new AuthService()
