import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type {
    OrderDto,
    UpdateOrderStatusRequest,
    UpdateOrderStatusResponse,
    CancelOrderRequest,
    CancelOrderResponse,
} from '@/modules/order/models/dtos/order.dto'
import type { OrderFilterDto } from '@/modules/order/models/dtos/order-filter.dto'
import { orderClient } from '@/core/api/clients/order.client'

export const orderApi = {
    getPagedAsync(params: OrderFilterDto): Promise<PagedApiResponse<OrderDto>> {
        return orderClient.get(API_ENDPOINTS.ORDER.ADMIN_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<OrderDto>> {
        return orderClient.get(API_ENDPOINTS.ORDER.ADMIN_API.GET_BY_ID(id))
    },

    updateStatusAsync(
        id: number,
        payload: UpdateOrderStatusRequest,
    ): Promise<ApiResponse<UpdateOrderStatusResponse>> {
        return orderClient.patch(API_ENDPOINTS.ORDER.ADMIN_API.UPDATE_STATUS(id), payload)
    },

    cancelAsync(id: number, payload: CancelOrderRequest): Promise<ApiResponse<CancelOrderResponse>> {
        return orderClient.post(API_ENDPOINTS.ORDER.ADMIN_API.CANCEL(id), payload)
    },
}
