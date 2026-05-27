export interface FranchiseeMemberDto {
    FranchiseeId: number
    TenantId: string
    UserId: string
}

export interface AssignFranchiseeUsersRequest {
    UserIds: string[]
}

export interface AssignFranchiseeUsersResponse {
    FranchiseeId: number
    AssignedUserIds: string[]
}

export interface RemoveFranchiseeUserResponse {
    FranchiseeId: number
    UserId: string
}
