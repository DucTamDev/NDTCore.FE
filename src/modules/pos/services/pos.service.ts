import { posApi } from '../api/pos.api'
import type { PosCatalogDto } from '../models/dtos/pos-catalog.dto'
import type { PosStoreStatusDto } from '../models/dtos/pos-shift.dto'
import type {
    CreatePosOrderRequest,
    CreatePosOrderResponse,
    PosOrderHistoryItemDto,
    GetOrderDetailDto,
} from '../models/dtos/pos-order.dto'

class PosService {
    async getStoreStatusAsync(storeId: number): Promise<PosStoreStatusDto | null> {
        const r = await posApi.getStoreStatusAsync(storeId)
        return r.Data ?? null
    }

    async getCatalogAsync(storeId: number): Promise<PosCatalogDto | null> {
        const r = await posApi.getCatalogAsync(storeId)
        return r.Data ?? null
    }

    async createOrderAsync(payload: CreatePosOrderRequest): Promise<CreatePosOrderResponse | null> {
        const r = await posApi.createOrderAsync(payload)
        return r.Data ?? null
    }

    async getOrderHistoryAsync(storeId: number): Promise<PosOrderHistoryItemDto[]> {
        const r = await posApi.getOrderHistoryAsync(storeId)
        return r.Data ?? []
    }

    async getOrderByIdAsync(id: number): Promise<GetOrderDetailDto | null> {
        const r = await posApi.getOrderByIdAsync(id)
        return r.Data ?? null
    }
}

export const posService = new PosService()
