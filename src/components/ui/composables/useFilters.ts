import { ref, computed } from 'vue'
import type { FilterField, ActiveFilters, FilterValue } from '../types'

export function useFilters(fields: FilterField[] = []) {
  const buildDefaults = (): ActiveFilters =>
    Object.fromEntries(fields.map((f) => [f.key, null]))

  const activeFilters = ref<ActiveFilters>(buildDefaults())

  const setFilter = (key: string, value: FilterValue) => {
    activeFilters.value = { ...activeFilters.value, [key]: value }
  }

  const setFilters = (filters: ActiveFilters) => {
    activeFilters.value = { ...filters }
  }

  const resetFilters = () => {
    activeFilters.value = buildDefaults()
  }

  const hasActiveFilters = computed(() =>
    Object.values(activeFilters.value).some((v) => {
      if (v === null) return false
      if (Array.isArray(v)) return v.length > 0
      return v !== ''
    }),
  )

  return { activeFilters, setFilter, setFilters, resetFilters, hasActiveFilters }
}
