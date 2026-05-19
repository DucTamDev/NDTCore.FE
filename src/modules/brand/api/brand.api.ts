import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/api/dtos/common.dtos'
import type {
    BrandDto,
    BrandFilterDto,
    CreateBrandRequest,
    CreateBrandResponse,
    DeleteBrandResponse,
    UpdateBrandRequest,
    UpdateBrandResponse,
} from '@/modules/brand/models/dtos/_index'
import { brandClient } from '@/core/api/clients/brand.client'

export const brandApi = {
    getPagedAsync(params: BrandFilterDto): Promise<PagedApiResponse<BrandDto>> {
        return brandClient.get(API_ENDPOINTS.BRAND.BRAND_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<BrandDto>> {
        return brandClient.get(API_ENDPOINTS.BRAND.BRAND_API.GET_BY_ID(id))
    },

    getByUserIdAsync(userId: string): Promise<ApiResponse<BrandDto[]>> {
        return brandClient.get(API_ENDPOINTS.BRAND.BRAND_API.GET_BY_USER_ID(userId))
    },

    createAsync(payload: CreateBrandRequest): Promise<ApiResponse<CreateBrandResponse>> {
        return brandClient.post(API_ENDPOINTS.BRAND.BRAND_API.CREATE, payload)
    },

    updateAsync(
        id: number,
        payload: UpdateBrandRequest,
    ): Promise<ApiResponse<UpdateBrandResponse>> {
        return brandClient.put(API_ENDPOINTS.BRAND.BRAND_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteBrandResponse>> {
        return brandClient.delete(API_ENDPOINTS.BRAND.BRAND_API.DELETE(id))
    },

    removeUserAsync(id: number, userId: string): Promise<ApiResponse<void>> {
        return brandClient.delete(API_ENDPOINTS.BRAND.BRAND_API.REMOVE_USER(id, userId))
    },
}
