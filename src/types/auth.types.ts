export interface Permission {
  resource: string
  action: string
}

export type UserRole = string

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: Permission[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthSession {
  user: User | null
  tokens: AuthTokens | null
}
