import { categoryApi } from '../api/category.api'
import { categoryMapper } from '../mappers/category.mapper'
import type { CategoryFilterDto, CreateCategoryRequest, UpdateCategoryRequest } from '../models/dtos/category.dto'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class CategoryService {
    async getPagedAsync(filter: CategoryFilterDto): Promise<PagedResult<CategoryViewModel>> {
        const response = await categoryApi.getPagedAsync(filter)
        return {
            items: categoryMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getByIdAsync(id: number): Promise<CategoryViewModel | null> {
        const response = await categoryApi.getByIdAsync(id)
        return response.Data ? categoryMapper.toViewModel(response.Data) : null
    }

    async createAsync(payload: CreateCategoryRequest): Promise<CategoryViewModel | null> {
        const response = await categoryApi.createAsync(payload)
        return response.Data ? categoryMapper.createResponseToViewModel(response.Data) : null
    }

    async updateAsync(id: number, payload: UpdateCategoryRequest): Promise<Partial<CategoryViewModel> | null> {
        const response = await categoryApi.updateAsync(id, payload)
        return response.Data ? categoryMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteAsync(id: number): Promise<void> {
        await categoryApi.deleteAsync(id)
    }
}

export const categoryService = new CategoryService()
