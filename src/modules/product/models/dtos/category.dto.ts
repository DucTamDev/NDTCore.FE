export interface CategoryDto {
    Id: number
    TenantId: string
    ParentId: number | null
    Name: string
    Slug: string | null
    Description: string | null
    ImageUrl: string | null
    DisplayOrder: number
    IsActive: boolean
    CreatedAt: string | null
    UpdatedAt: string | null
    CreatedBy: string | null
    UpdatedBy: string | null
}

export interface CategoryFilterDto {
    PageNumber?: number
    PageSize?: number
    Keyword?: string | null
    ParentId?: number | null
    IsActive?: boolean | null
}

export interface CreateCategoryRequest {
    Name: string
    Slug?: string | null
    Description?: string | null
    ImageUrl?: string | null
    ParentId?: number | null
    DisplayOrder: number
    IsActive: boolean
}

export interface CreateCategoryResponse {
    Id: number
    Name: string
    Slug: string | null
    ParentId: number | null
    IsActive: boolean
    CreatedAt: string | null
}

export interface UpdateCategoryRequest {
    Name: string
    Slug?: string | null
    Description?: string | null
    ImageUrl?: string | null
    ParentId?: number | null
    DisplayOrder: number
    IsActive: boolean
}

export interface UpdateCategoryResponse {
    Id: number
    Name: string
    Slug: string | null
    ParentId: number | null
    IsActive: boolean
    UpdatedAt: string | null
}

export interface DeleteCategoryResponse {
    Id: number
    Name: string
    DeletedAt: string | null
}
