import { productClient } from '@/core/api/clients/product.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type {
    CategoryDto,
    CategoryFilterDto,
    CreateCategoryRequest,
    CreateCategoryResponse,
    DeleteCategoryResponse,
    UpdateCategoryRequest,
    UpdateCategoryResponse,
} from '../models/dtos/category.dto'

export const categoryApi = {
    getPagedAsync(params: CategoryFilterDto): Promise<PagedApiResponse<CategoryDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.CATEGORY_API.GET_PAGED, params)
    },

    getParentsAsync(): Promise<ApiResponse<CategoryDto[]>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.CATEGORY_API.GET_PARENTS)
    },

    getByIdAsync(id: number): Promise<ApiResponse<CategoryDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.CATEGORY_API.GET_BY_ID(id))
    },

    createAsync(payload: CreateCategoryRequest): Promise<ApiResponse<CreateCategoryResponse>> {
        return productClient.post(API_ENDPOINTS.PRODUCT.CATEGORY_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateCategoryRequest): Promise<ApiResponse<UpdateCategoryResponse>> {
        return productClient.put(API_ENDPOINTS.PRODUCT.CATEGORY_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteCategoryResponse>> {
        return productClient.delete(API_ENDPOINTS.PRODUCT.CATEGORY_API.DELETE(id))
    },
}
