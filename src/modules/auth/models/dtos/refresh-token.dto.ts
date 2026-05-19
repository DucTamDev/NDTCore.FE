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
