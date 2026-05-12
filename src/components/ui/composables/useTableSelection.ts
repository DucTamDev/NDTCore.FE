import { ref, computed } from 'vue'

export function useTableSelection<T>(keyField: keyof T) {
  const selected = ref<T[]>([])

  const getKey = (item: T): unknown => item[keyField]

  const isSelected = (item: T): boolean =>
    selected.value.some((s) => s[keyField] === getKey(item))

  const toggle = (item: T): void => {
    if (isSelected(item)) {
      selected.value = selected.value.filter((s) => s[keyField] !== getKey(item))
    } else {
      selected.value = [...selected.value, item]
    }
  }

  const selectAll = (items: T[]): void => {
    selected.value = [...items]
  }

  const clearSelection = (): void => {
    selected.value = []
  }

  const selectionCount = computed(() => selected.value.length)

  return { selected, isSelected, toggle, selectAll, clearSelection, selectionCount }
}
