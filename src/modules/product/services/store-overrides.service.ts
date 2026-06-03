import { storeOverridesApi } from '../api/store-overrides.api'
import type {
    ProductStoreOverviewDto,
    UpsertProductStoreRequest,
    UpsertProductStorePriceRequest,
    OptionStoreOverviewDto,
    UpsertOptionStoreAvailabilityRequest,
    UpsertOptionStorePriceRequest,
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
}

export const storeOverridesService = new StoreOverridesService()
