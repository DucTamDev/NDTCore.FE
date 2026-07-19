export interface AdminUserDetailResponse {
    Id: string
    Email: string
    UserName: string
    FirstName: string
    LastName: string
    FullName: string
    PhoneNumber?: string | null
    AvatarUrl?: string | null
    DateOfBirth?: string | null
    Gender?: string | null
    IsActive: boolean
    EmailConfirmed: boolean
    PhoneNumberConfirmed: boolean
    LockoutEnabled: boolean
    LockoutEnd?: string | null
    AccessFailedCount: number
    LastLoginAt?: string | null
    Roles: string[]
    TenantId: string
    CreatedAt?: string | null
    CreatedBy?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
    IsDeleted: boolean
    DeletedAt?: string | null
    DeletedBy?: string | null
}
