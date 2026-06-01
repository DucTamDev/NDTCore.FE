export interface TagDto {
    Id: number
    TenantId: string
    Name: string
    TextColor: string | null
    ColorHex: string | null
    IconUrl: string | null
    DisplayOrder: number
    IsActive: boolean
    CreatedAt: string | null
    UpdatedAt: string | null
    CreatedBy: string | null
    UpdatedBy: string | null
}

export interface TagFilterDto {
    PageNumber?: number
    PageSize?: number
    Keyword?: string | null
    IsActive?: boolean | null
}

export interface CreateTagRequest {
    Name: string
    TextColor?: string | null
    ColorHex?: string | null
    IconUrl?: string | null
    DisplayOrder: number
    IsActive: boolean
}

export interface CreateTagResponse {
    Id: number
    Name: string
    ColorHex: string | null
    IsActive: boolean
    CreatedAt: string | null
}

export interface UpdateTagRequest {
    Name: string
    TextColor?: string | null
    ColorHex?: string | null
    IconUrl?: string | null
    DisplayOrder: number
    IsActive: boolean
}

export interface UpdateTagResponse {
    Id: number
    Name: string
    ColorHex: string | null
    IsActive: boolean
    UpdatedAt: string | null
}

export interface DeleteTagResponse {
    Id: number
    Name: string
    DeletedAt: string | null
}
