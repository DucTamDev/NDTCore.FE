import { useToastNotification } from '@/composables/useToastNotification'
import { orderService } from '@/modules/order/services/order.service'
import type { OrderFilterDto } from '@/modules/order/models/dtos/order-filter.dto'
import type { UpdateOrderStatusRequest, CancelOrderRequest } from '@/modules/order/models/dtos/order.dto'

export function useOrder() {
    const toast = useToastNotification()

    async function getPagedOrders(filter: OrderFilterDto) {
        try {
            return await orderService.getPagedOrdersAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách đơn hàng.')
            throw error
        }
    }

    async function getOrder(id: number) {
        try {
            return await orderService.getOrderAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết đơn hàng.')
            throw error
        }
    }

    async function updateOrderStatus(id: number, payload: UpdateOrderStatusRequest) {
        try {
            await orderService.updateOrderStatusAsync(id, payload)
            toast.success('Cập nhật trạng thái đơn hàng thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật trạng thái đơn hàng thất bại.')
            throw error
        }
    }

    async function cancelOrder(id: number, payload: CancelOrderRequest) {
        try {
            await orderService.cancelOrderAsync(id, payload)
            toast.success('Huỷ đơn hàng thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Huỷ đơn hàng thất bại.')
            throw error
        }
    }

    return { getPagedOrders, getOrder, updateOrderStatus, cancelOrder }
}
