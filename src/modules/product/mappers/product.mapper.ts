import type { ProductDto, CreateProductResponse, UpdateProductResponse } from '../models/dtos/product.dto'
import type { ProductViewModel } from '../models/view-models/product.view-model'

const toViewModel = (dto: ProductDto): ProductViewModel => ({
    id: dto.Id,
    tenantId: dto.TenantId,
    categoryId: dto.CategoryId,
    categoryName: dto.CategoryName,
    sku: dto.Sku,
    name: dto.Name,
    slug: dto.Slug,
    description: dto.Description,
    shortDescription: dto.ShortDescription,
    regularPrice: dto.RegularPrice,
    costPrice: dto.CostPrice,
    isActive: dto.IsActive,
    displayOrder: dto.DisplayOrder,
    isFeatured: dto.IsFeatured,
    createdAt: dto.CreatedAt,
    updatedAt: dto.UpdatedAt,
    createdBy: dto.CreatedBy,
    updatedBy: dto.UpdatedBy,
})

const toViewModels = (dtos: ProductDto[]): ProductViewModel[] => (dtos ?? []).map(toViewModel)

const createResponseToViewModel = (dto: CreateProductResponse): ProductViewModel => ({
    id: dto.Id,
    tenantId: '',
    categoryId: null,
    categoryName: null,
    sku: dto.Sku,
    name: dto.Name,
    slug: null,
    description: null,
    shortDescription: null,
    regularPrice: dto.RegularPrice,
    costPrice: null,
    isActive: dto.IsActive,
    displayOrder: 0,
    isFeatured: false,
    createdAt: dto.CreatedAt,
    updatedAt: null,
    createdBy: null,
    updatedBy: null,
})

const updateResponseToViewModel = (dto: UpdateProductResponse): Partial<ProductViewModel> => ({
    id: dto.Id,
    name: dto.Name,
    regularPrice: dto.RegularPrice,
    isActive: dto.IsActive,
    updatedAt: dto.UpdatedAt,
})

export const productMapper = { toViewModel, toViewModels, createResponseToViewModel, updateResponseToViewModel }
