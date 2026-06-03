import { ref } from 'vue'
import { storeOverridesService } from '../services/store-overrides.service'
import { useToastNotification } from '@/composables/useToastNotification'
import type {
    UpsertProductStoreRequest,
    UpsertProductStorePriceRequest,
    UpsertOptionStoreAvailabilityRequest,
    UpsertOptionStorePriceRequest,
} from '../models/dtos/store-overrides.dto'

export function useProductStoreOverrides(productId: number) {
    const toast = useToastNotification()
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const availability = ref<{ StoreId: number; IsAvailable: boolean }[]>([])
    const prices = ref<{ StoreId: number; Price: number }[]>([])

    async function loadOverview() {
        isLoading.value = true
        try {
            const data = await storeOverridesService.getProductOverviewAsync(productId)
            availability.value = data.Availability
            prices.value = data.Prices
        } catch {
            toast.error('Không thể tải thông tin cửa hàng.')
        } finally {
            isLoading.value = false
        }
    }

    async function upsertAvailability(storeId: number, isAvailable: boolean): Promise<boolean> {
        isSubmitting.value = true
        try {
            const payload: UpsertProductStoreRequest = { StoreId: storeId, IsAvailable: isAvailable }
            await storeOverridesService.upsertProductAvailabilityAsync(productId, storeId, payload)
            toast.success('Lưu thành công.')
            return true
        } catch {
            toast.error('Lưu thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function removeAvailability(storeId: number): Promise<boolean> {
        try {
            await storeOverridesService.removeProductAvailabilityAsync(productId, storeId)
            toast.success('Xóa thành công.')
            return true
        } catch {
            toast.error('Xóa thất bại.')
            return false
        }
    }

    async function upsertPrice(storeId: number, price: number): Promise<boolean> {
        isSubmitting.value = true
        try {
            const payload: UpsertProductStorePriceRequest = { StoreId: storeId, Price: price }
            await storeOverridesService.upsertProductPriceAsync(productId, storeId, payload)
            toast.success('Cập nhật giá thành công.')
            return true
        } catch {
            toast.error('Cập nhật giá thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function removePrice(storeId: number): Promise<boolean> {
        try {
            await storeOverridesService.removeProductPriceAsync(productId, storeId)
            toast.success('Xóa giá thành công.')
            return true
        } catch {
            toast.error('Xóa giá thất bại.')
            return false
        }
    }

    return { isLoading, isSubmitting, availability, prices, loadOverview, upsertAvailability, removeAvailability, upsertPrice, removePrice }
}

export function useOptionStoreOverrides(optionId: number) {
    const toast = useToastNotification()
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const availability = ref<{ StoreId: number; IsAvailable: boolean }[]>([])
    const prices = ref<{ StoreId: number; Price: number }[]>([])

    async function loadOverview() {
        isLoading.value = true
        try {
            const data = await storeOverridesService.getOptionOverviewAsync(optionId)
            availability.value = data.Availability
            prices.value = data.Prices
        } catch {
            toast.error('Không thể tải thông tin cửa hàng.')
        } finally {
            isLoading.value = false
        }
    }

    async function upsertAvailability(storeId: number, isAvailable: boolean): Promise<boolean> {
        isSubmitting.value = true
        try {
            const payload: UpsertOptionStoreAvailabilityRequest = { StoreId: storeId, IsAvailable: isAvailable }
            await storeOverridesService.upsertOptionAvailabilityAsync(optionId, storeId, payload)
            toast.success('Lưu thành công.')
            return true
        } catch {
            toast.error('Lưu thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function removeAvailability(storeId: number): Promise<boolean> {
        try {
            await storeOverridesService.removeOptionAvailabilityAsync(optionId, storeId)
            toast.success('Xóa thành công.')
            return true
        } catch {
            toast.error('Xóa thất bại.')
            return false
        }
    }

    async function upsertPrice(storeId: number, price: number): Promise<boolean> {
        isSubmitting.value = true
        try {
            const payload: UpsertOptionStorePriceRequest = { StoreId: storeId, Price: price }
            await storeOverridesService.upsertOptionPriceAsync(optionId, storeId, payload)
            toast.success('Cập nhật giá thành công.')
            return true
        } catch {
            toast.error('Cập nhật giá thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function removePrice(storeId: number): Promise<boolean> {
        try {
            await storeOverridesService.removeOptionPriceAsync(optionId, storeId)
            toast.success('Xóa giá thành công.')
            return true
        } catch {
            toast.error('Xóa giá thất bại.')
            return false
        }
    }

    return { isLoading, isSubmitting, availability, prices, loadOverview, upsertAvailability, removeAvailability, upsertPrice, removePrice }
}
