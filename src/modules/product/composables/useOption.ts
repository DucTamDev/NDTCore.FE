import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOptionStore } from '../stores/option.store'
import { optionService } from '../services/option.service'
import { useToastNotification } from '@/composables/useToastNotification'
import type { OptionFilterDto, CreateOptionRequest, UpdateOptionRequest } from '../models/dtos/option.dto'
import type { OptionViewModel } from '../models/view-models/option.view-model'

export function useOption() {
    const store = useOptionStore()
    const { items, total, isLoading } = storeToRefs(store)
    const toast = useToastNotification()
    const isSubmitting = ref(false)

    async function loadOptions(filter: OptionFilterDto) {
        await store.fetchPaged(filter)
    }

    async function createOption(payload: CreateOptionRequest): Promise<OptionViewModel | null> {
        isSubmitting.value = true
        try {
            const result = await optionService.createAsync(payload)
            if (result) toast.success('Tạo option thành công.')
            return result
        } catch {
            toast.error('Tạo option thất bại.')
            return null
        } finally {
            isSubmitting.value = false
        }
    }

    async function updateOption(id: number, payload: UpdateOptionRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const result = await optionService.updateAsync(id, payload)
            if (result) {
                toast.success('Cập nhật option thành công.')
                return true
            }
            return false
        } catch {
            toast.error('Cập nhật option thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function deleteOption(id: number): Promise<boolean> {
        try {
            await optionService.deleteAsync(id)
            toast.success('Xóa option thành công.')
            return true
        } catch {
            toast.error('Xóa option thất bại.')
            return false
        }
    }

    return {
        items,
        total,
        isLoading,
        isSubmitting,
        loadOptions,
        createOption,
        updateOption,
        deleteOption,
    }
}
