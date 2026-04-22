// @/core/guards/auth.guard.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { AuthService } from '@/core/services/auth.service'
import { authService } from '@/modules/auth/services/auth.service'
import { AUTH_ROUTES } from '@/modules/auth/constants/auth.constants'
import type { Permission } from '@/modules/auth/types/auth.types'

/**
 * Authentication guard
 * Checks if user is authenticated before allowing access
 */
export async function authGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const tokenService = AuthService.getInstance()
    const token = tokenService.getAccessToken()

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !token) {
        // Not authenticated, redirect to login
        next({
            path: AUTH_ROUTES.LOGIN,
            query: { redirect: to.fullPath },
        })
        return
    }

    // If accessing auth pages while authenticated, redirect to dashboard
    if (token && to.path.startsWith('/auth')) {
        next(AUTH_ROUTES.DASHBOARD)
        return
    }

    next()
}

/**
 * Permission guard
 * Checks if user has required permissions
 */
export function permissionGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const requiredPermissions = to.meta.permissions as Permission[] | undefined

    if (!requiredPermissions || requiredPermissions.length === 0) {
        next()
        return
    }

    const hasPermission = authService.hasAllPermissions(requiredPermissions)

    if (!hasPermission) {
        // No permission, redirect to forbidden page
        next({ name: 'Forbidden' })
        return
    }

    next()
}

/**
 * Role guard
 * Checks if user has required role
 */
export function roleGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const requiredRoles = to.meta.roles as string[] | undefined

    if (!requiredRoles || requiredRoles.length === 0) {
        next()
        return
    }

    const userRole = authService.getUserRole()

    if (!userRole || !requiredRoles.includes(userRole)) {
        // No required role, redirect to forbidden page
        next({ name: 'Forbidden' })
        return
    }

    next()
}
