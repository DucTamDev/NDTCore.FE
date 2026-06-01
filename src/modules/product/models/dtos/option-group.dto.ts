export interface OptionGroupDto {
    Id: number
    TenantId: string
    Name: string
    UiType: string
    Description: string | null
    DisplayOrder: number
    IsActive: boolean
    CreatedAt: string | null
    UpdatedAt: string | null
    CreatedBy: string | null
    UpdatedBy: string | null
}

export interface OptionGroupFilterDto {
    PageNumber?: number
    PageSize?: number
    Keyword?: string | null
    IsActive?: boolean | null
}

export interface CreateOptionGroupRequest {
    Name: string
    UiType: string
    Description?: string | null
    DisplayOrder: number
    IsActive: boolean
}

export interface CreateOptionGroupResponse {
    Id: number
    Name: string
    UiType: string
    IsActive: boolean
    CreatedAt: string | null
}

export interface UpdateOptionGroupRequest {
    Name: string
    UiType: string
    Description?: string | null
    DisplayOrder: number
    IsActive: boolean
}

export interface UpdateOptionGroupResponse {
    Id: number
    Name: string
    UiType: string
    IsActive: boolean
    UpdatedAt: string | null
}

export interface DeleteOptionGroupResponse {
    Id: number
    Name: string
    DeletedAt: string | null
}
