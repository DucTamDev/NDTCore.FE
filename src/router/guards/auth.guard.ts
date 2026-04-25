import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/app.constants'
import { useAuthStore } from '@/stores/auth.store'
import type { Permission, UserRole } from '@/types/auth.types'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()
  const { isAuthenticated, userRole } = storeToRefs(authStore)
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isAuthenticated.value) {
    next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } })
    return
  }

  if (!requiresAuth && isAuthenticated.value && to.path.startsWith(ROUTE_PATHS.AUTH)) {
    next({ name: ROUTE_NAMES.DASHBOARD })
    return
  }

  const requiredPermissions = to.meta.permissions as Permission[] | undefined
  if (requiredPermissions?.length) {
    const hasAllPermissions = requiredPermissions.every((requiredPermission) =>
      authStore.user?.permissions.some(
        (permission) =>
          permission.resource === requiredPermission.resource &&
          (permission.action === requiredPermission.action || permission.action === 'manage'),
      ),
    )

    if (!hasAllPermissions) {
      next({ path: ROUTE_PATHS.DASHBOARD })
      return
    }
  }

  const requiredRoles = to.meta.roles as UserRole[] | undefined
  if (requiredRoles?.length && (!userRole.value || !requiredRoles.includes(userRole.value))) {
    next({ path: ROUTE_PATHS.DASHBOARD })
    return
  }

  next()
}
