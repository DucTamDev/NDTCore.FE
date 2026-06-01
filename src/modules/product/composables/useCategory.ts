import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '../stores/category.store'
import { categoryService } from '../services/category.service'
import { useToastNotification } from '@/composables/useToastNotification'
import type { CategoryFilterDto, CreateCategoryRequest, UpdateCategoryRequest } from '../models/dtos/category.dto'
import type { CategoryViewModel } from '../models/view-models/category.view-model'

export function useCategory() {
    const store = useCategoryStore()
    const { items, total, isLoading } = storeToRefs(store)
    const toast = useToastNotification()
    const isSubmitting = ref(false)

    async function loadCategories(filter: CategoryFilterDto) {
        await store.fetchPaged(filter)
    }

    async function createCategory(payload: CreateCategoryRequest): Promise<CategoryViewModel | null> {
        isSubmitting.value = true
        try {
            const result = await categoryService.createAsync(payload)
            if (result) toast.success('Tạo danh mục thành công.')
            return result
        } catch {
            toast.error('Tạo danh mục thất bại.')
            return null
        } finally {
            isSubmitting.value = false
        }
    }

    async function updateCategory(id: number, payload: UpdateCategoryRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const result = await categoryService.updateAsync(id, payload)
            if (result) {
                toast.success('Cập nhật danh mục thành công.')
                return true
            }
            return false
        } catch {
            toast.error('Cập nhật danh mục thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function deleteCategory(id: number): Promise<boolean> {
        try {
            await categoryService.deleteAsync(id)
            toast.success('Xóa danh mục thành công.')
            return true
        } catch {
            toast.error('Xóa danh mục thất bại.')
            return false
        }
    }

    return {
        items,
        total,
        isLoading,
        isSubmitting,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    }
}
