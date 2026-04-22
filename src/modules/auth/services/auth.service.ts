// src/modules/auth/services/auth.service.ts
import type { Permission } from '../types/auth.types'

class AuthService {
  private permissions: Permission[] = []
  private role: string | null = null

  setUserContext(role: string, permissions: Permission[]): void {
    this.role = role
    this.permissions = permissions
  }

  clearUserContext(): void {
    this.role = null
    this.permissions = []
  }

  getUserRole(): string | null {
    return this.role
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.some(
      (p) => p.resource === permission.resource && (p.action === permission.action || p.action === 'manage'),
    )
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(p))
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(p))
  }
}

export const authService = new AuthService()
