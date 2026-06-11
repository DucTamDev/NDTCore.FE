import { storeOverridesApi } from '../api/store-overrides.api'
import type {
    ProductStoreOverviewDto,
    UpsertProductStoreRequest,
    UpsertProductStorePriceRequest,
    OptionStoreOverviewDto,
    UpsertOptionStoreAvailabilityRequest,
    UpsertOptionStorePriceRequest,
    StoreOverrideItemDto,
} from '../models/dtos/store-overrides.dto'

class StoreOverridesService {
    async getProductOverviewAsync(productId: number): Promise<ProductStoreOverviewDto> {
        const r = await storeOverridesApi.getProductOverviewAsync(productId)
        return r.Data ?? { Availability: [], Prices: [] }
    }

    async upsertProductAvailabilityAsync(
        productId: number,
        storeId: number,
        payload: UpsertProductStoreRequest,
    ): Promise<boolean> {
        await storeOverridesApi.upsertProductAvailabilityAsync(productId, storeId, payload)
        return true
    }

    async removeProductAvailabilityAsync(productId: number, storeId: number): Promise<boolean> {
        await storeOverridesApi.removeProductAvailabilityAsync(productId, storeId)
        return true
    }

    async upsertProductPriceAsync(
        productId: number,
        storeId: number,
        payload: UpsertProductStorePriceRequest,
    ): Promise<boolean> {
        await storeOverridesApi.upsertProductPriceAsync(productId, storeId, payload)
        return true
    }

    async removeProductPriceAsync(productId: number, storeId: number): Promise<boolean> {
        await storeOverridesApi.removeProductPriceAsync(productId, storeId)
        return true
    }

    async getOptionOverviewAsync(optionId: number): Promise<OptionStoreOverviewDto> {
        const r = await storeOverridesApi.getOptionOverviewAsync(optionId)
        return r.Data ?? { Availability: [], Prices: [] }
    }

    async upsertOptionAvailabilityAsync(
        optionId: number,
        storeId: number,
        payload: UpsertOptionStoreAvailabilityRequest,
    ): Promise<boolean> {
        await storeOverridesApi.upsertOptionAvailabilityAsync(optionId, storeId, payload)
        return true
    }

    async removeOptionAvailabilityAsync(optionId: number, storeId: number): Promise<boolean> {
        await storeOverridesApi.removeOptionAvailabilityAsync(optionId, storeId)
        return true
    }

    async upsertOptionPriceAsync(
        optionId: number,
        storeId: number,
        payload: UpsertOptionStorePriceRequest,
    ): Promise<boolean> {
        await storeOverridesApi.upsertOptionPriceAsync(optionId, storeId, payload)
        return true
    }

    async removeOptionPriceAsync(optionId: number, storeId: number): Promise<boolean> {
        await storeOverridesApi.removeOptionPriceAsync(optionId, storeId)
        return true
    }

    async getProductPagedAsync(
        productId: number,
        params: { PageNumber: number; PageSize: number },
    ): Promise<{ items: StoreOverrideItemDto[]; pageNumber: number; pageSize: number; totalPages: number; totalCount: number }> {
        const r = await storeOverridesApi.getProductPagedAsync(productId, params)
        return {
            items:      (r.Data ?? []) as StoreOverrideItemDto[],
            pageNumber: r.PageNumber,
            pageSize:   r.PageSize,
            totalPages: r.TotalPages,
            totalCount: r.TotalCount,
        }
    }

    async getOptionPagedAsync(
        optionId: number,
        params: { PageNumber: number; PageSize: number },
    ): Promise<{ items: StoreOverrideItemDto[]; pageNumber: number; pageSize: number; totalPages: number; totalCount: number }> {
        const r = await storeOverridesApi.getOptionPagedAsync(optionId, params)
        return {
            items:      (r.Data ?? []) as StoreOverrideItemDto[],
            pageNumber: r.PageNumber,
            pageSize:   r.PageSize,
            totalPages: r.TotalPages,
            totalCount: r.TotalCount,
        }
    }
}

export const storeOverridesService = new StoreOverridesService()
