import { ref, computed } from 'vue'
import type { PaginationOptions } from '@/core/types'

export type { PaginationOptions }

export function usePagination(options: PaginationOptions = {}) {
    const currentPage = ref(options.initialPage || 1)
    const pageSize = ref(options.initialPageSize || 20)
    const total = ref(options.total || 0)

    const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
    const hasNextPage = computed(() => currentPage.value < totalPages.value)
    const hasPrevPage = computed(() => currentPage.value > 1)

    const offset = computed(() => (currentPage.value - 1) * pageSize.value)

    function setPage(page: number) {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
        }
    }

    function nextPage() {
        if (hasNextPage.value) {
            currentPage.value++
        }
    }

    function prevPage() {
        if (hasPrevPage.value) {
            currentPage.value--
        }
    }

    function reset() {
        currentPage.value = 1
    }

    return {
        currentPage,
        pageSize,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        offset,
        setPage,
        nextPage,
        prevPage,
        reset,
    }
}
