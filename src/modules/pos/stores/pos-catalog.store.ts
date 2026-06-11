import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { posService } from '../services/pos.service'
import type { PosProductDto, PosCategoryDto } from '../models/dtos/pos-catalog.dto'

export const usePosCatalogStore = defineStore('pos-catalog', () => {
    const products           = ref<PosProductDto[]>([])
    const categories         = ref<PosCategoryDto[]>([])
    const isLoading          = ref(false)
    const keyword            = ref('')
    const selectedCategoryId = ref<number | null>(null)

    const filteredProducts = computed<PosProductDto[]>(() => {
        const kw = keyword.value.trim().toLowerCase()
        if (kw) {
            return products.value.filter((p) => p.Name.toLowerCase().includes(kw))
        }
        if (selectedCategoryId.value != null) {
            return products.value.filter((p) => p.CategoryId === selectedCategoryId.value)
        }
        return products.value
    })

    async function fetchCatalog(storeId: number): Promise<void> {
        isLoading.value = true
        try {
            const data       = await posService.getCatalogAsync(storeId)
            products.value   = data?.Products ?? []
            categories.value = data?.Categories ?? []
        } finally {
            isLoading.value = false
        }
    }

    function selectCategory(categoryId: number | null): void {
        selectedCategoryId.value = categoryId
        keyword.value            = ''
    }

    function $reset(): void {
        products.value           = []
        categories.value         = []
        isLoading.value          = false
        keyword.value            = ''
        selectedCategoryId.value = null
    }

    return {
        products, categories, isLoading, keyword, selectedCategoryId,
        filteredProducts,
        fetchCatalog, selectCategory, $reset,
    }
})
