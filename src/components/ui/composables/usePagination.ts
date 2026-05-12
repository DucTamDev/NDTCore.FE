import { ref, computed } from 'vue'
import type { PaginationState } from '../types'

export function usePagination(options?: Partial<PaginationState>) {
  const pageNumber = ref(options?.pageNumber ?? 1)
  const pageSize = ref(options?.pageSize ?? 10)
  const totalItems = ref(options?.totalItems ?? 0)

  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

  const setPageNumber = (value: number) => {
    pageNumber.value = value
  }

  const setPageSize = (value: number) => {
    pageSize.value = value
    pageNumber.value = 1
  }

  const reset = () => {
    pageNumber.value = options?.pageNumber ?? 1
    pageSize.value = options?.pageSize ?? 10
    totalItems.value = 0
  }

  return { pageNumber, pageSize, totalItems, totalPages, setPageNumber, setPageSize, reset }
}
