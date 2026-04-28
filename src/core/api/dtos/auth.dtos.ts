export interface LoginRequest {
    Email: string
    Password: string
}

export interface LoginResponse {
    AccessToken?: string | null
    RefreshToken?: string | null
    AccessTokenExpiration?: string | null
    RefreshTokenExpiration?: string | null
}

export interface RegisterRequest {
    FullName: string
    Email: string
    Password: string
}

export interface RefreshTokenRequest {
    AccessToken?: string | null
    RefreshToken?: string | null
}

export interface RefreshTokenResponse {
    AccessToken?: string | null
    RefreshToken?: string | null
    AccessTokenExpiration?: string | null
    RefreshTokenExpiration?: string | null
}
