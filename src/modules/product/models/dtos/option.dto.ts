export interface OptionDto {
    Id: number
    TenantId: string
    GroupId: number
    Name: string
    Price: number
    Description: string | null
    ImageUrl: string | null
    DisplayOrder: number
    IsActive: boolean
    CreatedAt: string | null
    UpdatedAt: string | null
    CreatedBy: string | null
    UpdatedBy: string | null
}

export interface OptionFilterDto {
    PageNumber?: number
    PageSize?: number
    Keyword?: string | null
    GroupId?: number | null
    IsActive?: boolean | null
}

export interface CreateOptionRequest {
    GroupId: number
    Name: string
    Price: number
    Description?: string | null
    ImageUrl?: string | null
    DisplayOrder: number
    IsActive: boolean
}

export interface CreateOptionResponse {
    Id: number
    GroupId: number
    Name: string
    Price: number
    IsActive: boolean
    CreatedAt: string | null
}

export interface UpdateOptionRequest {
    Name: string
    Price: number
    Description?: string | null
    ImageUrl?: string | null
    DisplayOrder: number
    IsActive: boolean
}

export interface UpdateOptionResponse {
    Id: number
    Name: string
    Price: number
    IsActive: boolean
    UpdatedAt: string | null
}

export interface DeleteOptionResponse {
    Id: number
    Name: string
    DeletedAt: string | null
}
