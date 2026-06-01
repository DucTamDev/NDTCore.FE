import { productClient } from '@/core/api/clients/product.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type {
    OptionDto,
    OptionFilterDto,
    CreateOptionRequest,
    CreateOptionResponse,
    DeleteOptionResponse,
    UpdateOptionRequest,
    UpdateOptionResponse,
} from '../models/dtos/option.dto'

export const optionApi = {
    getPagedAsync(params: OptionFilterDto): Promise<PagedApiResponse<OptionDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.OPTION_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<OptionDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.OPTION_API.GET_BY_ID(id))
    },

    createAsync(payload: CreateOptionRequest): Promise<ApiResponse<CreateOptionResponse>> {
        return productClient.post(API_ENDPOINTS.PRODUCT.OPTION_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateOptionRequest): Promise<ApiResponse<UpdateOptionResponse>> {
        return productClient.put(API_ENDPOINTS.PRODUCT.OPTION_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteOptionResponse>> {
        return productClient.delete(API_ENDPOINTS.PRODUCT.OPTION_API.DELETE(id))
    },
}
