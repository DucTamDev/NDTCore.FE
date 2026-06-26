import type { OrderDto, OrderItemDto, OrderItemOptionDto } from '@/modules/order/models/dtos/order.dto'
import type {
    OrderViewModel,
    OrderItemViewModel,
    OrderItemOptionViewModel,
} from '@/modules/order/models/view-models/order.view-model'

export const orderMapper = {
    toViewModels(dtos: OrderDto[]): OrderViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: OrderDto): OrderViewModel {
        return {
            id: dto.Id,
            tenantId: dto.TenantId,
            storeId: dto.StoreId,
            orderNumber: dto.OrderNumber,
            status: dto.Status,
            channel: dto.Channel ?? null,
            serviceType: dto.ServiceType,
            customerName: dto.CustomerName ?? null,
            customerPhone: dto.CustomerPhone ?? null,
            note: dto.Note ?? null,
            subtotal: dto.Subtotal,
            discountAmount: dto.DiscountAmount,
            taxAmount: dto.TaxAmount,
            deliveryFee: dto.DeliveryFee,
            deliveryAddress: dto.DeliveryAddress ?? null,
            totalAmount: dto.TotalAmount,
            paymentMethod: dto.PaymentMethod ?? null,
            paymentStatus: dto.PaymentStatus ?? null,
            amountReceived: dto.AmountReceived ?? null,
            changeAmount: dto.ChangeAmount ?? null,
            paidAt: dto.PaidAt ?? null,
            cancelledAt: dto.CancelledAt ?? null,
            cancelledReason: dto.CancelledReason ?? null,
            createdAt: dto.CreatedAt ?? null,
            createdBy: dto.CreatedBy ?? null,
            updatedAt: dto.UpdatedAt ?? null,
            updatedBy: dto.UpdatedBy ?? null,
            items: (dto.Items ?? []).map((item) => this.toItemViewModel(item)),
        }
    },

    toItemViewModel(dto: OrderItemDto): OrderItemViewModel {
        return {
            id: dto.Id,
            productId: dto.ProductId,
            productCode: dto.ProductCode,
            productName: dto.ProductName,
            regularPrice: dto.RegularPrice,
            optionsAmount: dto.OptionsAmount,
            salePrice: dto.SalePrice,
            quantity: dto.Quantity,
            lineAmount: dto.LineAmount,
            discountAmount: dto.DiscountAmount,
            lineNetAmount: dto.LineNetAmount,
            note: dto.Note ?? null,
            options: (dto.Options ?? []).map((opt) => this.toItemOptionViewModel(opt)),
        }
    },

    toItemOptionViewModel(dto: OrderItemOptionDto): OrderItemOptionViewModel {
        return {
            id: dto.Id,
            optionId: dto.OptionId,
            groupName: dto.GroupName ?? null,
            optionName: dto.OptionName,
            price: dto.Price,
        }
    },
}
