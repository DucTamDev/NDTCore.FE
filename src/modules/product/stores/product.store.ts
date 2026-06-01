import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '../services/product.service'
import type { ProductViewModel } from '../models/view-models/product.view-model'
import type { ProductFilterDto } from '../models/dtos/product.dto'

export const useProductStore = defineStore('product-product', () => {
    const items = ref<ProductViewModel[]>([])
    const total = ref(0)
    const isLoading = ref(false)

    async function fetchPaged(filter: ProductFilterDto) {
        isLoading.value = true
        try {
            const result = await productService.getPagedAsync(filter)
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
