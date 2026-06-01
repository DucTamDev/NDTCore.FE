import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tagService } from '../services/tag.service'
import type { TagViewModel } from '../models/view-models/tag.view-model'
import type { TagFilterDto } from '../models/dtos/tag.dto'

export const useTagStore = defineStore('product-tag', () => {
    const items = ref<TagViewModel[]>([])
    const total = ref(0)
    const isLoading = ref(false)

    async function fetchPaged(filter: TagFilterDto) {
        isLoading.value = true
        try {
            const result = await tagService.getPagedAsync(filter)
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
