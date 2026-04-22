// src/modules/auth/composables/useAuth.ts
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { authService } from '../services/auth.service'
import type { Permission } from '../types/auth.types'

export function useAuth() {
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.user)

  function can(permission: Permission): boolean {
    return authService.hasPermission(permission)
  }

  function canAny(permissions: string[] | Permission[]): boolean {
    if (permissions.length === 0) return true
    // Support both string[] (simple) and Permission[] (structured)
    if (typeof permissions[0] === 'string') {
      return (permissions as string[]).some((p) =>
        authService.hasPermission({ resource: p, action: 'read' }),
      )
    }
    return authService.hasAnyPermission(permissions as Permission[])
  }

  function canAll(permissions: Permission[]): boolean {
    return authService.hasAllPermissions(permissions)
  }

  return {
    isAuthenticated,
    currentUser,
    can,
    canAny,
    canAll,
  }
}
