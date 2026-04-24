import { tokenService } from '@/infrastructure/auth/token.service'
import type { LoginRequest, Permission, RegisterRequest, User } from '@/models/auth.models'
import { pinia } from '@/plugins/pinia'
import { useAuthStore } from '@/stores/auth.store'

const AUTH_DELAY_MS = 300

function wait(delay = AUTH_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, delay))
}

function createPermissions(role: string): Permission[] {
  if (role === 'admin') {
    return [
      { resource: 'dashboard', action: 'read' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'manage' },
    ]
  }

  return [{ resource: 'dashboard', action: 'read' }]
}

function createUser(email: string, fullName?: string): User {
  const role = email.includes('admin') ? 'admin' : 'user'
  const name = fullName || email.split('@')[0] || 'guest'

  return {
    id: crypto.randomUUID(),
    name,
    email,
    role,
    permissions: createPermissions(role),
  }
}

class AuthService {
  private get store() {
    return useAuthStore(pinia)
  }

  initialize(): void {
    const accessToken = tokenService.getAccessToken()
    const refreshToken = tokenService.getRefreshToken()
    const user = tokenService.getUser()

    if (!accessToken || !refreshToken || !user) return

    this.store.setSession(user, {
      accessToken,
      refreshToken,
    })
  }

  async login(payload: LoginRequest) {
    await wait()

    if (!payload.email || !payload.password) {
      throw new Error('Vui lòng nhập đầy đủ email và mật khẩu.')
    }

    const user = createUser(payload.email)
    const tokens = {
      accessToken: `access-${crypto.randomUUID()}`,
      refreshToken: `refresh-${crypto.randomUUID()}`,
    }

    this.store.setSession(user, tokens)
    tokenService.setTokens(tokens)
    tokenService.setUser(user)

    return user
  }

  async register(payload: RegisterRequest) {
    await wait()

    if (!payload.fullName || !payload.email || !payload.password) {
      throw new Error('Vui lòng điền đầy đủ thông tin đăng ký.')
    }

    return createUser(payload.email, payload.fullName)
  }

  async logout() {
    await wait(100)
    this.store.clearSession()
    tokenService.clear()
  }

  isAuthenticated(): boolean {
    return this.store.isAuthenticated
  }

  getUserRole(): string | null {
    return this.store.user?.role ?? null
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
