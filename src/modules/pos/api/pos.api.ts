import { BaseClient } from '@/core/api/clients/base.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse } from '@/core/models/common.dto'
import type { PosCatalogDto } from '../models/dtos/pos-catalog.dto'
import type { PosStoreStatusDto } from '../models/dtos/pos-shift.dto'
import type {
    CreatePosOrderRequest,
    CreatePosOrderResponse,
    PosOrderHistoryItemDto,
    GetOrderDetailDto,
} from '../models/dtos/pos-order.dto'

const ENV_ORDER_URL = import.meta.env.VITE_ORDER_BASE_URL as string | undefined
if (!ENV_ORDER_URL) throw new Error('[PosApi] VITE_ORDER_BASE_URL is not defined')

class PosClient extends BaseClient {
    constructor() {
        super({ baseURL: ENV_ORDER_URL! })
    }
}

const posClient = new PosClient()
const EP = API_ENDPOINTS.ORDER.POS_API

export const posApi = {
    getStoreStatusAsync(storeId: number): Promise<ApiResponse<PosStoreStatusDto>> {
        return posClient.get(EP.GET_STORE_STATUS(storeId))
    },
    getCatalogAsync(storeId: number): Promise<ApiResponse<PosCatalogDto>> {
        return posClient.get(EP.GET_CATALOG(storeId))
    },
    createOrderAsync(payload: CreatePosOrderRequest): Promise<ApiResponse<CreatePosOrderResponse>> {
        return posClient.post(EP.CREATE_ORDER, payload)
    },
    getOrderHistoryAsync(storeId: number): Promise<ApiResponse<PosOrderHistoryItemDto[]>> {
        return posClient.get(EP.GET_ORDER_HISTORY(storeId))
    },
    getOrderByIdAsync(id: number): Promise<ApiResponse<GetOrderDetailDto>> {
        return posClient.get(EP.GET_ORDER_BY_ID(id))
    },
}
