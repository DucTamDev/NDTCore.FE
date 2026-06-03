import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse } from '@/core/models/common.dto'
import { productClient } from '@/core/api/clients/product.client'
import type {
    ProductStoreOverviewDto,
    UpsertProductStoreRequest,
    UpsertProductStorePriceRequest,
    OptionStoreOverviewDto,
    UpsertOptionStoreAvailabilityRequest,
    UpsertOptionStorePriceRequest,
} from '../models/dtos/store-overrides.dto'

const EP = API_ENDPOINTS.PRODUCT.STORE_OVERRIDE_API

export const storeOverridesApi = {
    getProductOverviewAsync(productId: number): Promise<ApiResponse<ProductStoreOverviewDto>> {
        return productClient.get(EP.GET_PRODUCT_OVERVIEW(productId))
    },
    upsertProductAvailabilityAsync(
        productId: number,
        storeId: number,
        payload: UpsertProductStoreRequest,
    ): Promise<ApiResponse<unknown>> {
        return productClient.put(EP.UPSERT_PRODUCT_AVAILABILITY(productId, storeId), payload)
    },
    removeProductAvailabilityAsync(productId: number, storeId: number): Promise<ApiResponse<unknown>> {
        return productClient.delete(EP.REMOVE_PRODUCT_AVAILABILITY(productId, storeId))
    },
    upsertProductPriceAsync(
        productId: number,
        storeId: number,
        payload: UpsertProductStorePriceRequest,
    ): Promise<ApiResponse<unknown>> {
        return productClient.put(EP.UPSERT_PRODUCT_PRICE(productId, storeId), payload)
    },
    removeProductPriceAsync(productId: number, storeId: number): Promise<ApiResponse<unknown>> {
        return productClient.delete(EP.REMOVE_PRODUCT_PRICE(productId, storeId))
    },
    getOptionOverviewAsync(optionId: number): Promise<ApiResponse<OptionStoreOverviewDto>> {
        return productClient.get(EP.GET_OPTION_OVERVIEW(optionId))
    },
    upsertOptionAvailabilityAsync(
        optionId: number,
        storeId: number,
        payload: UpsertOptionStoreAvailabilityRequest,
    ): Promise<ApiResponse<unknown>> {
        return productClient.put(EP.UPSERT_OPTION_AVAILABILITY(optionId, storeId), payload)
    },
    removeOptionAvailabilityAsync(optionId: number, storeId: number): Promise<ApiResponse<unknown>> {
        return productClient.delete(EP.REMOVE_OPTION_AVAILABILITY(optionId, storeId))
    },
    upsertOptionPriceAsync(
        optionId: number,
        storeId: number,
        payload: UpsertOptionStorePriceRequest,
    ): Promise<ApiResponse<unknown>> {
        return productClient.put(EP.UPSERT_OPTION_PRICE(optionId, storeId), payload)
    },
    removeOptionPriceAsync(optionId: number, storeId: number): Promise<ApiResponse<unknown>> {
        return productClient.delete(EP.REMOVE_OPTION_PRICE(optionId, storeId))
    },
}
