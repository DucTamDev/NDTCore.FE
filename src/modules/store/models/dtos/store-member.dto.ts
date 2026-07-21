export interface StoreMemberDto {
    StoreId: number
    TenantId: string
    UserId: string
    UserName: string
    Email: string
    FullName: string
    AvatarUrl?: string | null
    IsActive: boolean
    Roles: string[]
    AssignedAt: string
}

export interface AssignStoreMembersRequest {
    UserIds: string[]
}

export interface AssignStoreMembersResponse {
    StoreId: number
    AssignedUserIds: string[]
}

export interface RemoveStoreMemberResponse {
    StoreId: number
    UserId: string
}
