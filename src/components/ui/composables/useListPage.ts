import { ref } from 'vue'
import { usePagination } from './usePagination'
import { useFilters } from './useFilters'
import { useTableSelection } from './useTableSelection'
import type { FilterField, ActiveFilters, SortState } from '../types'

export interface ListPageParams {
  pageNumber: number
  pageSize: number
  filters: ActiveFilters
  sortBy: SortState | null
}

export interface ListPageOptions<T> {
  fetchFn: (params: ListPageParams) => Promise<{ items: T[]; total: number }>
  keyField: keyof T
  fields?: FilterField[]
  defaultPageSize?: number
}

export function useListPage<T>(options: ListPageOptions<T>) {
  const { fetchFn, keyField, fields = [], defaultPageSize = 10 } = options

  const items = ref<T[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const sortBy = ref<SortState | null>(null)

  const pagination = usePagination({ pageSize: defaultPageSize })
  const filters = useFilters(fields)
  const selection = useTableSelection<T>(keyField)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchFn({
        pageNumber: pagination.pageNumber.value,
        pageSize: pagination.pageSize.value,
        filters: filters.activeFilters.value,
        sortBy: sortBy.value,
      })
      items.value = result.items
      pagination.totalItems.value = result.total
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  const refresh = () => fetchData()

  const onSearch = async () => {
    pagination.setPageNumber(1)
    await fetchData()
  }

  const onResetFilters = async () => {
    filters.resetFilters()
    pagination.reset()
    await fetchData()
  }

  const onPageChange = async (page: number) => {
    pagination.setPageNumber(page)
    await fetchData()
  }

  const onPageSizeChange = async (size: number) => {
    pagination.setPageSize(size)
    await fetchData()
  }

  const onSort = async (state: SortState | null) => {
    sortBy.value = state
    pagination.setPageNumber(1)
    await fetchData()
  }

  return {
    items,
    loading,
    error,
    sortBy,
    pagination,
    filters,
    selection,
    refresh,
    onSearch,
    onResetFilters,
    onPageChange,
    onPageSizeChange,
    onSort,
  }
}
