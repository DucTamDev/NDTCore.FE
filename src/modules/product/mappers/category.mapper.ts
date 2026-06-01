import type { CategoryDto, CreateCategoryResponse, UpdateCategoryResponse } from '../models/dtos/category.dto'
import type { CategoryViewModel } from '../models/view-models/category.view-model'

const toViewModel = (dto: CategoryDto): CategoryViewModel => ({
    id: dto.Id,
    tenantId: dto.TenantId,
    parentId: dto.ParentId,
    name: dto.Name,
    slug: dto.Slug,
    description: dto.Description,
    imageUrl: dto.ImageUrl,
    displayOrder: dto.DisplayOrder,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: dto.UpdatedAt,
    createdBy: dto.CreatedBy,
    updatedBy: dto.UpdatedBy,
})

const toViewModels = (dtos: CategoryDto[]): CategoryViewModel[] => (dtos ?? []).map(toViewModel)

const createResponseToViewModel = (dto: CreateCategoryResponse): CategoryViewModel => ({
    id: dto.Id,
    tenantId: '',
    parentId: dto.ParentId,
    name: dto.Name,
    slug: dto.Slug,
    description: null,
    imageUrl: null,
    displayOrder: 0,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: null,
    createdBy: null,
    updatedBy: null,
})

const updateResponseToViewModel = (dto: UpdateCategoryResponse): Partial<CategoryViewModel> => ({
    id: dto.Id,
    name: dto.Name,
    slug: dto.Slug,
    parentId: dto.ParentId,
    isActive: dto.IsActive,
    updatedAt: dto.UpdatedAt,
})

export const categoryMapper = { toViewModel, toViewModels, createResponseToViewModel, updateResponseToViewModel }
