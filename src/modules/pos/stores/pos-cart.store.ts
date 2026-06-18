import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PosCartItem } from '../models/types/pos-cart.types'
import { PaymentMethod, PaymentStatus, ServiceType } from '../enums/_index'

export const usePosCartStore = defineStore('pos-cart', () => {
    const items         = ref<PosCartItem[]>([])
    const customerName  = ref('')
    const customerPhone = ref('')
    const orderNote     = ref('')
    const paymentMethod = ref<PaymentMethod>(PaymentMethod.Cash)
    const paymentStatus = ref<PaymentStatus>(PaymentStatus.Unpaid)
    const serviceType   = ref<ServiceType>(ServiceType.TakeAway)

    const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))

    const totalAmount = computed(() =>
        items.value.reduce((sum, item) => {
            const optionTotal = item.selectedOptions.reduce((s, o) => s + o.resolvedPrice, 0)
            return sum + (item.resolvedPrice + optionTotal) * item.quantity
        }, 0),
    )

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
        items.value         = []
        customerName.value  = ''
        customerPhone.value = ''
        orderNote.value     = ''
        paymentMethod.value = PaymentMethod.Cash
        paymentStatus.value = PaymentStatus.Unpaid
        serviceType.value   = ServiceType.TakeAway
    }

    function $reset(): void {
        clearCart()
    }

    return {
        items, customerName, customerPhone, orderNote, paymentMethod, paymentStatus, serviceType,
        itemCount, totalAmount,
        addItem, updateItem, removeItem, updateQuantity, clearCart, $reset,
    }
})
