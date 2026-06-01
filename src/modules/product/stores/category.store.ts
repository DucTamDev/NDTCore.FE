import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '../services/category.service'
import type { CategoryViewModel } from '../models/view-models/category.view-model'
import type { CategoryFilterDto } from '../models/dtos/category.dto'

export const useCategoryStore = defineStore('product-category', () => {
    const items = ref<CategoryViewModel[]>([])
    const total = ref(0)
    const isLoading = ref(false)

    async function fetchPaged(filter: CategoryFilterDto) {
        isLoading.value = true
        try {
            const result = await categoryService.getPagedAsync(filter)
            items.value = result.items
            total.value = result.totalCount
        } finally {
            isLoading.value = false
        }
    }

    function $reset() {
        items.value = []
        total.value = 0
        isLoading.value = false
    }

    return { items, total, isLoading, fetchPaged, $reset }
})
