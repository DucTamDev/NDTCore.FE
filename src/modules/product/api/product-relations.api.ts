import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse } from '@/core/models/common.dto'
import { productClient } from '@/core/api/clients/product.client'
import type {
    ProductTagDto,
    AssignTagRequest,
    ProductOptionGroupDto,
    AssignOptionGroupRequest,
    UpdateProductOptionGroupRequest,
    ProductOptionConfigDto,
    UpsertOptionConfigRequest,
} from '../models/dtos/product-relations.dto'

const EP = API_ENDPOINTS.PRODUCT.PRODUCT_API

export const productRelationsApi = {
    getTagsAsync(productId: number): Promise<ApiResponse<ProductTagDto[]>> {
        return productClient.get(EP.GET_TAGS(productId))
    },
    assignTagAsync(productId: number, payload: AssignTagRequest): Promise<ApiResponse<ProductTagDto>> {
        return productClient.post(EP.ASSIGN_TAG(productId), payload)
    },
    removeTagAsync(productId: number, tagId: number): Promise<ApiResponse<ProductTagDto>> {
        return productClient.delete(EP.REMOVE_TAG(productId, tagId))
    },
    getOptionGroupsAsync(productId: number): Promise<ApiResponse<ProductOptionGroupDto[]>> {
        return productClient.get(EP.GET_OPTION_GROUPS(productId))
    },
    assignOptionGroupAsync(productId: number, payload: AssignOptionGroupRequest): Promise<ApiResponse<ProductOptionGroupDto>> {
        return productClient.post(EP.ASSIGN_OPTION_GROUP(productId), payload)
    },
    updateOptionGroupAsync(
        productId: number,
        groupId: number,
        payload: UpdateProductOptionGroupRequest,
    ): Promise<ApiResponse<ProductOptionGroupDto>> {
        return productClient.put(EP.UPDATE_OPTION_GROUP(productId, groupId), payload)
    },
    removeOptionGroupAsync(productId: number, groupId: number): Promise<ApiResponse<ProductOptionGroupDto>> {
        return productClient.delete(EP.REMOVE_OPTION_GROUP(productId, groupId))
    },
    getOptionConfigsAsync(productId: number): Promise<ApiResponse<ProductOptionConfigDto[]>> {
        return productClient.get(EP.GET_OPTION_CONFIGS(productId))
    },
    upsertOptionConfigAsync(productId: number, payload: UpsertOptionConfigRequest): Promise<ApiResponse<ProductOptionConfigDto>> {
        return productClient.post(EP.UPSERT_OPTION_CONFIG(productId), payload)
    },
    removeOptionConfigAsync(productId: number, optionId: number): Promise<ApiResponse<ProductOptionConfigDto>> {
        return productClient.delete(EP.REMOVE_OPTION_CONFIG(productId, optionId))
    },
}
