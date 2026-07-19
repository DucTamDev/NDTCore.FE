export interface AssignRolesRequest {
    Roles: string[]
}

export interface AssignRolesResponse {
    UserId: string
    AssignedRoles: string[]
}
