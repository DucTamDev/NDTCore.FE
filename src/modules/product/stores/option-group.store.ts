import { defineStore } from 'pinia'
import { ref } from 'vue'
import { optionGroupService } from '../services/option-group.service'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'
import type { OptionGroupFilterDto } from '../models/dtos/option-group.dto'

export const useOptionGroupStore = defineStore('product-option-group', () => {
    const items = ref<OptionGroupViewModel[]>([])
    const total = ref(0)
    const isLoading = ref(false)

    async function fetchPaged(filter: OptionGroupFilterDto) {
        isLoading.value = true
        try {
            const result = await optionGroupService.getPagedAsync(filter)
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
