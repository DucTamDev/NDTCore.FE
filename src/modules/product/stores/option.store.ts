import { defineStore } from 'pinia'
import { ref } from 'vue'
import { optionService } from '../services/option.service'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { OptionFilterDto } from '../models/dtos/option.dto'

export const useOptionStore = defineStore('product-option', () => {
    const items = ref<OptionViewModel[]>([])
    const total = ref(0)
    const isLoading = ref(false)

    async function fetchPaged(filter: OptionFilterDto) {
        isLoading.value = true
        try {
            const result = await optionService.getPagedAsync(filter)
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
