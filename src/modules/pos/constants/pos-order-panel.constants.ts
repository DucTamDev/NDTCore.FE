import { PaymentMethod, PaymentStatus, ServiceType } from '../enums/_index'

export const POS_PAYMENT_METHOD_OPTIONS = [
    { value: PaymentMethod.Cash, label: 'Tiền mặt', icon: 'mdi-cash' },
    { value: PaymentMethod.Transfer, label: 'Chuyển khoản', icon: 'mdi-bank-transfer' },
] as const

export const POS_PAYMENT_STATUS_OPTIONS = [
    { value: PaymentStatus.Unpaid, label: 'Chưa thanh toán', icon: 'mdi-clock-outline' },
    { value: PaymentStatus.Paid, label: 'Đã thanh toán', icon: 'mdi-check-circle-outline' },
] as const

export const POS_SERVICE_TYPE_OPTIONS = [
    { value: ServiceType.TakeAway, label: 'Mang đi', icon: 'mdi-walk' },
    { value: ServiceType.DineIn, label: 'Ngồi lại', icon: 'mdi-silverware-fork-knife' },
    { value: ServiceType.Delivery, label: 'Giao hàng', icon: 'mdi-moped' },
] as const
