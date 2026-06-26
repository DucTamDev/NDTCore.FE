import { orderApi } from '@/modules/order/api/order.api'
import { orderMapper } from '@/modules/order/mappers/order.mapper'
import type { OrderFilterDto } from '@/modules/order/models/dtos/order-filter.dto'
import type { UpdateOrderStatusRequest, CancelOrderRequest } from '@/modules/order/models/dtos/order.dto'
import type { OrderViewModel } from '@/modules/order/models/view-models/order.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class OrderService {
    async getPagedOrdersAsync(filter: OrderFilterDto): Promise<PagedResult<OrderViewModel>> {
        const response = await orderApi.getPagedAsync(filter)
        return {
            items: orderMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getOrderAsync(id: number): Promise<OrderViewModel | null> {
        const response = await orderApi.getByIdAsync(id)
        return response.Data ? orderMapper.toViewModel(response.Data) : null
    }

    async updateOrderStatusAsync(id: number, payload: UpdateOrderStatusRequest): Promise<void> {
        await orderApi.updateStatusAsync(id, payload)
    }

    async cancelOrderAsync(id: number, payload: CancelOrderRequest): Promise<void> {
        await orderApi.cancelAsync(id, payload)
    }
}

export const orderService = new OrderService()
