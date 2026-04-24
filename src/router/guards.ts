import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { APP_ROUTES } from '@/constants/routes'
import type { Permission } from '@/models/auth.models'
import { authService } from '@/services/auth.service'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isAuthenticated) {
    next({ path: APP_ROUTES.AUTH.LOGIN.PATH, query: { redirect: to.fullPath } })
    return
  }

  if (isAuthenticated && to.path.startsWith('/auth')) {
    next(APP_ROUTES.DASHBOARD.HOME.PATH)
    return
  }

  next()
}

export function permissionGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const required = to.meta.permissions as Permission[] | undefined

  if (!required?.length || authService.hasAllPermissions(required)) {
    next()
    return
  }

  next(APP_ROUTES.DASHBOARD.HOME.PATH)
}

export function roleGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const required = to.meta.roles as string[] | undefined
  const role = authService.getUserRole()

  if (!required?.length || (role && required.includes(role))) {
    next()
    return
  }

  next(APP_ROUTES.DASHBOARD.HOME.PATH)
}
