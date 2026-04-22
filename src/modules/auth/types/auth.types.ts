// src/modules/auth/types/auth.types.ts

export interface Permission {
  resource: string
  action: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  permissions: Permission[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
