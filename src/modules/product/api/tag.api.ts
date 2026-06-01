import { productClient } from '@/core/api/clients/product.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type {
    TagDto,
    TagFilterDto,
    CreateTagRequest,
    CreateTagResponse,
    DeleteTagResponse,
    UpdateTagRequest,
    UpdateTagResponse,
} from '../models/dtos/tag.dto'

export const tagApi = {
    getPagedAsync(params: TagFilterDto): Promise<PagedApiResponse<TagDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.TAG_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<TagDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.TAG_API.GET_BY_ID(id))
    },

    createAsync(payload: CreateTagRequest): Promise<ApiResponse<CreateTagResponse>> {
        return productClient.post(API_ENDPOINTS.PRODUCT.TAG_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateTagRequest): Promise<ApiResponse<UpdateTagResponse>> {
        return productClient.put(API_ENDPOINTS.PRODUCT.TAG_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteTagResponse>> {
        return productClient.delete(API_ENDPOINTS.PRODUCT.TAG_API.DELETE(id))
    },
}
