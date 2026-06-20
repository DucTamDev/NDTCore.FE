import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { PosCartItem } from '../models/types/pos-cart.types'
import { PaymentMethod, PaymentStatus, ServiceType } from '../enums/_index'

export const usePosCartStore = defineStore('pos-cart', () => {
    const items          = ref<PosCartItem[]>([])
    const customerName   = ref('')
    const customerPhone  = ref('')
    const orderNote      = ref('')
    const paymentMethod  = ref<PaymentMethod>(PaymentMethod.Cash)
    const paymentStatus  = ref<PaymentStatus>(PaymentStatus.Unpaid)
    const serviceType    = ref<ServiceType>(ServiceType.TakeAway)
    const deliveryFee    = ref(0)
    const amountReceived = ref<number | null>(null)

    const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))

    const totalAmount = computed(() =>
        items.value.reduce((sum, item) => {
            const optionTotal = item.selectedOptions.reduce((s, o) => s + o.resolvedPrice, 0)
            return sum + (item.resolvedPrice + optionTotal) * item.quantity
        }, 0) + deliveryFee.value,
    )

    const changeAmount = computed(() =>
        amountReceived.value !== null ? amountReceived.value - totalAmount.value : null,
    )

    watch(serviceType, (value) => {
        if (value !== ServiceType.Delivery) deliveryFee.value = 0
    })

    watch(paymentMethod, (value) => {
        if (value !== PaymentMethod.Cash) amountReceived.value = null
    })

    function addItem(item: PosCartItem): void {
        items.value.push(item)
    }

    function updateItem(uid: string, updated: PosCartItem): void {
        const idx = items.value.findIndex((i) => i.uid === uid)
        if (idx !== -1) items.value[idx] = updated
    }

    function removeItem(uid: string): void {
        items.value = items.value.filter((i) => i.uid !== uid)
    }

    function updateQuantity(uid: string, quantity: number): void {
        const item = items.value.find((i) => i.uid === uid)
        if (item && quantity >= 1) item.quantity = quantity
    }

    function clearCart(): void {
        items.value          = []
        customerName.value   = ''
        customerPhone.value  = ''
        orderNote.value      = ''
        paymentMethod.value  = PaymentMethod.Cash
        paymentStatus.value  = PaymentStatus.Unpaid
        serviceType.value    = ServiceType.TakeAway
        deliveryFee.value    = 0
        amountReceived.value = null
    }

    function $reset(): void {
        clearCart()
    }

    return {
        items, customerName, customerPhone, orderNote, paymentMethod, paymentStatus, serviceType,
        deliveryFee, amountReceived,
        itemCount, totalAmount, changeAmount,
        addItem, updateItem, removeItem, updateQuantity, clearCart, $reset,
    }
})
