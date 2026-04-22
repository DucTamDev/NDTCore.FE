import type { Directive } from 'vue'
import { authService } from '@/modules/auth/services/auth.service'
import type { Permission } from '@/modules/auth/types/auth.types'

/**
 * v-permission directive
 * Hide element if user doesn't have permission
 *
 * Usage:
 * <button v-permission="{ resource: 'users', action: 'create' }">
 *   Create User
 * </button>
 *
 * OR with array (requires ANY permission):
 * <button v-permission="[
 *   { resource: 'users', action: 'create' },
 *   { resource: 'users', action: 'manage' }
 * ]">
 *   Create User
 * </button>
 */
export const vPermission: Directive<HTMLElement, Permission | Permission[]> = {
    mounted(el, binding) {
        const permissions = Array.isArray(binding.value) ? binding.value : [binding.value]
        const hasPermission = authService.hasAnyPermission(permissions)

        if (!hasPermission) {
            el.style.display = 'none'
        }
    },

    updated(el, binding) {
        const permissions = Array.isArray(binding.value) ? binding.value : [binding.value]
        const hasPermission = authService.hasAnyPermission(permissions)

        if (!hasPermission) {
            el.style.display = 'none'
        } else {
            el.style.display = ''
        }
    },
}

/**
 * v-role directive
 * Hide element if user doesn't have role
 *
 * Usage:
 * <div v-role="'admin'">Admin Only Content</div>
 *
 * OR with array:
 * <div v-role="['admin', 'moderator']">Staff Content</div>
 */
export const vRole: Directive<HTMLElement, string | string[]> = {
    mounted(el, binding) {
        const roles = Array.isArray(binding.value) ? binding.value : [binding.value]
        const userRole = authService.getUserRole()
        const hasRole = userRole && roles.includes(userRole)

        if (!hasRole) {
            el.style.display = 'none'
        }
    },

    updated(el, binding) {
        const roles = Array.isArray(binding.value) ? binding.value : [binding.value]
        const userRole = authService.getUserRole()
        const hasRole = userRole && roles.includes(userRole)

        if (!hasRole) {
            el.style.display = 'none'
        } else {
            el.style.display = ''
        }
    },
}
