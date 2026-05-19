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