export interface ProductDto {
    Id: number
    TenantId: string
    CategoryId: number | null
    CategoryName: string | null
    Sku: string
    Name: string
    Slug: string | null
    Description: string | null
    ShortDescription: string | null
    RegularPrice: number
    CostPrice: number | null
    IsActive: boolean
    DisplayOrder: number
    CreatedAt: string | null
    UpdatedAt: string | null
    CreatedBy: string | null
    UpdatedBy: string | null
}

export interface ProductFilterDto {
    PageNumber?: number
    PageSize?: number
    Keyword?: string | null
    CategoryId?: number | null
    IsActive?: boolean | null
}

export interface CreateProductRequest {
    CategoryId?: number | null
    Sku: string
    Name: string
    Slug?: string | null
    Description?: string | null
    ShortDescription?: string | null
    RegularPrice: number
    CostPrice?: number | null
    IsActive: boolean
    DisplayOrder: number
}

export interface CreateProductResponse {
    Id: number
    Sku: string
    Name: string
    RegularPrice: number
    IsActive: boolean
    CreatedAt: string | null
}

export interface UpdateProductRequest {
    CategoryId?: number | null
    Name: string
    Slug?: string | null
    Description?: string | null
    ShortDescription?: string | null
    RegularPrice: number
    CostPrice?: number | null
    IsActive: boolean
    DisplayOrder: number
}

export interface UpdateProductResponse {
    Id: number
    Name: string
    RegularPrice: number
    IsActive: boolean
    UpdatedAt: string | null
}

export interface DeleteProductResponse {
    Id: number
    Sku: string
    Name: string
    DeletedAt: string | null
}

export interface AddProductImageRequest {
    ProductId: number
    Url: string
    AltText?: string | null
    DisplayOrder: number
    IsMain: boolean
}

export interface AddProductImageResponse {
    Id: number
    ProductId: number
    Url: string
    AltText: string | null
    IsMain: boolean
    CreatedAt: string | null
}

export interface DeleteProductImageResponse {
    Id: number
    ProductId: number
    Url: string
    IsMain: boolean
}
