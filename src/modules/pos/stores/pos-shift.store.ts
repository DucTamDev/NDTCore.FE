import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { posService } from '../services/pos.service'
import type { PosStoreStatusDto } from '../models/dtos/pos-shift.dto'

export const usePosShiftStore = defineStore('pos-shift', () => {
    const status    = ref<PosStoreStatusDto | null>(null)
    const isLoading = ref(false)

    const storeName         = computed(() => status.value?.StoreName ?? '')
    const logoUrl           = computed(() => status.value?.LogoUrl ?? null)
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

    function $reset(): void {
        status.value    = null
        isLoading.value = false
    }

    return {
        status, isLoading,
        storeName, logoUrl, isAcceptingOrders, hasOpenShift,
        shiftId, shiftOpenedAt, shiftOpenedBy, canCreateOrder,
        fetchStatus, $reset,
    }
})
