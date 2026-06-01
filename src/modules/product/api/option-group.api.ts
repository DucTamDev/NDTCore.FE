import { productClient } from '@/core/api/clients/product.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type { OptionDto } from '../models/dtos/option.dto'
import type {
    OptionGroupDto,
    OptionGroupFilterDto,
    CreateOptionGroupRequest,
    CreateOptionGroupResponse,
    DeleteOptionGroupResponse,
    UpdateOptionGroupRequest,
    UpdateOptionGroupResponse,
} from '../models/dtos/option-group.dto'

export const optionGroupApi = {
    getPagedAsync(params: OptionGroupFilterDto): Promise<PagedApiResponse<OptionGroupDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.OPTION_GROUP_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<OptionGroupDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.OPTION_GROUP_API.GET_BY_ID(id))
    },

    getOptionsForGroupAsync(id: number): Promise<ApiResponse<OptionDto[]>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.OPTION_GROUP_API.GET_OPTIONS(id))
    },

    createAsync(payload: CreateOptionGroupRequest): Promise<ApiResponse<CreateOptionGroupResponse>> {
        return productClient.post(API_ENDPOINTS.PRODUCT.OPTION_GROUP_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateOptionGroupRequest): Promise<ApiResponse<UpdateOptionGroupResponse>> {
        return productClient.put(API_ENDPOINTS.PRODUCT.OPTION_GROUP_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteOptionGroupResponse>> {
        return productClient.delete(API_ENDPOINTS.PRODUCT.OPTION_GROUP_API.DELETE(id))
    },
}
