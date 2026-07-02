import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { posService } from '../services/pos.service'
import type { PosStoreStatusDto } from '../models/dtos/pos-shift.dto'

export const usePosShiftStore = defineStore('pos-shift', () => {
    const status          = ref<PosStoreStatusDto | null>(null)
    const isLoading       = ref(false)
    const nextOrderNumber = ref<string | null>(null)

    const storeName         = computed(() => status.value?.StoreName ?? '')
    const logoUrl           = computed(() => status.value?.LogoUrl ?? null)
    const address           = computed(() => {
        if (!status.value) return ''
        return [status.value.Address, status.value.District, status.value.City, status.value.Province]
            .filter(Boolean)
            .join(', ')
    })
    const hotline           = computed(() => status.value?.Phone ?? null)
    const isAcceptingOrders = computed(() => status.value?.IsAcceptingOrders ?? false)
    const hasOpenShift      = computed(() => status.value?.HasOpenShift ?? false)
    const shiftId           = computed(() => status.value?.ShiftId ?? null)
    const shiftOpenedAt     = computed(() => status.value?.ShiftOpenedAt ?? null)
    const shiftOpenedBy     = computed(() => status.value?.ShiftOpenedBy ?? null)
    const canCreateOrder    = computed(() => isAcceptingOrders.value && hasOpenShift.value)

    async function fetchStatus(storeId: number): Promise<void> {
        isLoading.value = true
        try {
            status.value = await posService.getStoreStatusAsync(storeId)
        } finally {
            isLoading.value = false
        }
    }

    async function fetchNextOrderNumber(storeId: number): Promise<void> {
        try {
            const result = await posService.getNextOrderNumberAsync(storeId)
            nextOrderNumber.value = result?.OrderNumber ?? null
        } catch {
            nextOrderNumber.value = null
        }
    }

    function $reset(): void {
        status.value          = null
        isLoading.value       = false
        nextOrderNumber.value = null
    }

    return {
        status, isLoading, nextOrderNumber,
        storeName, logoUrl, address, hotline, isAcceptingOrders, hasOpenShift,
        shiftId, shiftOpenedAt, shiftOpenedBy, canCreateOrder,
        fetchStatus, fetchNextOrderNumber, $reset,
    }
})
