export interface UpdateUserRequest {
    FirstName: string
    LastName: string
    PhoneNumber?: string | null
    AvatarUrl?: string | null
    DateOfBirth?: string | null
    Gender?: string | null
    IsActive: boolean
}

export interface UpdateUserResponse {
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
    UpdatedAt?: string | null
}
