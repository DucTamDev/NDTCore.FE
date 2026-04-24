import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import type { LoginRequest, Permission, RegisterRequest } from '@/models/auth.models'

export function useAuth() {
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.user)

  function can(permission: Permission): boolean {
    return authService.hasPermission(permission)
  }

  function canAny(permissions: string[] | Permission[]): boolean {
    if (permissions.length === 0) return true

    if (typeof permissions[0] === 'string') {
      return (permissions as string[]).some((permission) =>
        authService.hasPermission({ resource: permission, action: 'read' }),
      )
    }

    return authService.hasAnyPermission(permissions as Permission[])
  }

  function canAll(permissions: Permission[]): boolean {
    return authService.hasAllPermissions(permissions)
  }

  async function login(payload: LoginRequest) {
    return authService.login(payload)
  }

  async function register(payload: RegisterRequest) {
    return authService.register(payload)
  }

  async function logout() {
    return authService.logout()
  }

  return {
    isAuthenticated,
    currentUser,
    can,
    canAny,
    canAll,
    login,
    register,
    logout,
  }
}
