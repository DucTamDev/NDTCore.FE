export interface UserProfileDto {
    // Identity
    Id: string
    Email: string
    UserName: string

    // Profile
    FirstName: string
    LastName: string
    FullName: string
    PhoneNumber: string | null
    AvatarUrl: string | null
    DateOfBirth: string | null
    Gender: string | null

    // Account status
    IsActive: boolean
    EmailConfirmed: boolean

    // Roles & Permissions
    Roles: RoleDto[]
    Permissions: PermissionDto[]

    // Multi-tenancy
    TenantId: string
}

export interface RoleDto {
    Id: string
    Name: string
}

export interface PermissionDto {
    Id: string
    Name: string
}
