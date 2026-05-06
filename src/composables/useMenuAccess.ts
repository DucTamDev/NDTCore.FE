import { useAuthStore } from '@/stores/auth.store'
import type { MenuItem, MenuSection } from '@/core/types'

export function checkAccess(item: MenuItem, userRoles: string[]): boolean {
    const roleOk = !item.roles?.length || item.roles.some(r => userRoles.includes(r))
    if (!roleOk) return false

    if (!item.to && item.children?.length) {
        return item.children.some(child => checkAccess(child, userRoles))
    }

    return true
}

export function checkSectionAccess(section: MenuSection, userRoles: string[]): boolean {
    return section.items.some(item => checkAccess(item, userRoles))
}

export function useMenuAccess() {
    const authStore = useAuthStore()

    function getUserRoles(): string[] {
        return authStore.user?.Roles?.map(r => r.Name) ?? []
    }

    function hasAccess(item: MenuItem): boolean {
        return checkAccess(item, getUserRoles())
    }

    function hasAccessToSection(section: MenuSection): boolean {
        return checkSectionAccess(section, getUserRoles())
    }

    return { hasAccess, hasAccessToSection }
}
