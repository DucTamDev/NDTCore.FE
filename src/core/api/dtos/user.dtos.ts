export interface UserProfileResponse {
    Email: string
    Roles: RoleDto[]
}

export interface RoleDto {
    Name: string
}

export interface PermissionDto {
    Name: string
}
