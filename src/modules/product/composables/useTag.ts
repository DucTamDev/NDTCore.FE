import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTagStore } from '../stores/tag.store'
import { tagService } from '../services/tag.service'
import { useToastNotification } from '@/composables/useToastNotification'
import type { TagFilterDto, CreateTagRequest, UpdateTagRequest } from '../models/dtos/tag.dto'
import type { TagViewModel } from '../models/view-models/tag.view-model'

export function useTag() {
    const store = useTagStore()
    const { items, total, isLoading } = storeToRefs(store)
    const toast = useToastNotification()
    const isSubmitting = ref(false)

    async function loadTags(filter: TagFilterDto) {
        await store.fetchPaged(filter)
    }

    async function createTag(payload: CreateTagRequest): Promise<TagViewModel | null> {
        isSubmitting.value = true
        try {
            const result = await tagService.createAsync(payload)
            if (result) toast.success('Tạo nhãn thành công.')
            return result
        } catch {
            toast.error('Tạo nhãn thất bại.')
            return null
        } finally {
            isSubmitting.value = false
        }
    }

    async function updateTag(id: number, payload: UpdateTagRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const result = await tagService.updateAsync(id, payload)
            if (result) {
                toast.success('Cập nhật nhãn thành công.')
                return true
            }
            return false
        } catch {
            toast.error('Cập nhật nhãn thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function deleteTag(id: number): Promise<boolean> {
        try {
            await tagService.deleteAsync(id)
            toast.success('Xóa nhãn thành công.')
            return true
        } catch {
            toast.error('Xóa nhãn thất bại.')
            return false
        }
    }

    return {
        items,
        total,
        isLoading,
        isSubmitting,
        loadTags,
        createTag,
        updateTag,
        deleteTag,
    }
}
