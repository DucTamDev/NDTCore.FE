export interface AuthTokenModel {
    accessToken: string
    refreshToken: string
    accessTokenExpiration: string
    refreshTokenExpiration: string
}

export interface AuthUserModel {
    roles: string[]
}
