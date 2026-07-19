export interface CreateUserRequest {
    Email: string
    UserName: string
    Password: string
    FirstName: string
    LastName: string
    PhoneNumber?: string | null
    DateOfBirth?: string | null
    Gender?: string | null
    IsActive: boolean
}

export interface CreateUserResponse {
    Id: string
    Email: string
    UserName: string
    FirstName: string
    LastName: string
    FullName: string
    IsActive: boolean
    Roles: string[]
    TenantId: string
    CreatedAt?: string | null
}
