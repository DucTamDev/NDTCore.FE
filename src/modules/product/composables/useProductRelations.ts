import { ref } from 'vue'
import { productRelationsService } from '../services/product-relations.service'
import { useToastNotification } from '@/composables/useToastNotification'
import type {
    ProductTagDto,
    AssignTagRequest,
    ProductOptionGroupDto,
    AssignOptionGroupRequest,
    UpdateProductOptionGroupRequest,
    ProductOptionConfigDto,
    UpsertOptionConfigRequest,
} from '../models/dtos/product-relations.dto'

export function useProductRelations(productId: number) {
    const toast = useToastNotification()
    const isLoading = ref(false)
    const isSubmitting = ref(false)

    const tags = ref<ProductTagDto[]>([])
    const optionGroups = ref<ProductOptionGroupDto[]>([])
    const optionConfigs = ref<ProductOptionConfigDto[]>([])

    async function loadTags() {
        isLoading.value = true
        try {
            tags.value = await productRelationsService.getTagsAsync(productId)
        } catch {
            toast.error('Không thể tải danh sách tags.')
        } finally {
            isLoading.value = false
        }
    }

    async function assignTag(payload: AssignTagRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const r = await productRelationsService.assignTagAsync(productId, payload)
            if (r) { toast.success('Gán tag thành công.'); return true }
            return false
        } catch {
            toast.error('Gán tag thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function removeTag(tagId: number): Promise<boolean> {
        try {
            await productRelationsService.removeTagAsync(productId, tagId)
            toast.success('Bỏ tag thành công.')
            return true
        } catch {
            toast.error('Bỏ tag thất bại.')
            return false
        }
    }

    async function loadOptionGroups() {
        isLoading.value = true
        try {
            optionGroups.value = await productRelationsService.getOptionGroupsAsync(productId)
        } catch {
            toast.error('Không thể tải nhóm option.')
        } finally {
            isLoading.value = false
        }
    }

    async function assignOptionGroup(payload: AssignOptionGroupRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const r = await productRelationsService.assignOptionGroupAsync(productId, payload)
            if (r) { toast.success('Gán nhóm option thành công.'); return true }
            return false
        } catch {
            toast.error('Gán nhóm option thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function updateOptionGroup(groupId: number, payload: UpdateProductOptionGroupRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const r = await productRelationsService.updateOptionGroupAsync(productId, groupId, payload)
            if (r) { toast.success('Cập nhật nhóm option thành công.'); return true }
            return false
        } catch {
            toast.error('Cập nhật thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function removeOptionGroup(groupId: number): Promise<boolean> {
        try {
            await productRelationsService.removeOptionGroupAsync(productId, groupId)
            toast.success('Bỏ nhóm option thành công.')
            return true
        } catch {
            toast.error('Bỏ nhóm option thất bại.')
            return false
        }
    }

    async function loadOptionConfigs() {
        isLoading.value = true
        try {
            optionConfigs.value = await productRelationsService.getOptionConfigsAsync(productId)
        } catch {
            toast.error('Không thể tải cấu hình option.')
        } finally {
            isLoading.value = false
        }
    }

    async function upsertOptionConfig(payload: UpsertOptionConfigRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const r = await productRelationsService.upsertOptionConfigAsync(productId, payload)
            if (r) { toast.success('Lưu cấu hình option thành công.'); return true }
            return false
        } catch {
            toast.error('Lưu cấu hình option thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function removeOptionConfig(optionId: number): Promise<boolean> {
        try {
            await productRelationsService.removeOptionConfigAsync(productId, optionId)
            toast.success('Xóa cấu hình option thành công.')
            return true
        } catch {
            toast.error('Xóa cấu hình option thất bại.')
            return false
        }
    }

    return {
        isLoading,
        isSubmitting,
        tags,
        optionGroups,
        optionConfigs,
        loadTags,
        assignTag,
        removeTag,
        loadOptionGroups,
        assignOptionGroup,
        updateOptionGroup,
        removeOptionGroup,
        loadOptionConfigs,
        upsertOptionConfig,
        removeOptionConfig,
    }
}
