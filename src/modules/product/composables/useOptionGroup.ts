import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOptionGroupStore } from '../stores/option-group.store'
import { optionGroupService } from '../services/option-group.service'
import { useToastNotification } from '@/composables/useToastNotification'
import type { OptionGroupFilterDto, CreateOptionGroupRequest, UpdateOptionGroupRequest } from '../models/dtos/option-group.dto'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'

export function useOptionGroup() {
    const store = useOptionGroupStore()
    const { items, total, isLoading } = storeToRefs(store)
    const toast = useToastNotification()
    const isSubmitting = ref(false)

    async function loadOptionGroups(filter: OptionGroupFilterDto) {
        await store.fetchPaged(filter)
    }

    async function createOptionGroup(payload: CreateOptionGroupRequest): Promise<OptionGroupViewModel | null> {
        isSubmitting.value = true
        try {
            const result = await optionGroupService.createAsync(payload)
            if (result) toast.success('Tạo nhóm option thành công.')
            return result
        } catch {
            toast.error('Tạo nhóm option thất bại.')
            return null
        } finally {
            isSubmitting.value = false
        }
    }

    async function updateOptionGroup(id: number, payload: UpdateOptionGroupRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const result = await optionGroupService.updateAsync(id, payload)
            if (result) {
                toast.success('Cập nhật nhóm option thành công.')
                return true
            }
            return false
        } catch {
            toast.error('Cập nhật nhóm option thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function deleteOptionGroup(id: number): Promise<boolean> {
        try {
            await optionGroupService.deleteAsync(id)
            toast.success('Xóa nhóm option thành công.')
            return true
        } catch {
            toast.error('Xóa nhóm option thất bại.')
            return false
        }
    }

    return {
        items,
        total,
        isLoading,
        isSubmitting,
        loadOptionGroups,
        createOptionGroup,
        updateOptionGroup,
        deleteOptionGroup,
    }
}
