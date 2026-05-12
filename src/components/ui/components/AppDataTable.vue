<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { TableColumn, SortState } from '../types'
import { APP_DATA_TABLE_EMIT } from '../constants/emit-keys'
import type { AppDataTableEmits } from '../types/emit.types';

const props = defineProps<{
  items: T[]
  columns: TableColumn[]
  loading?: boolean
  selectable?: boolean
  selected?: T[]
  itemKey: keyof T
  sortBy?: SortState | null
}>()

const emit = defineEmits<AppDataTableEmits<T>>()

const { name } = useDisplay()

const BREAKPOINT_INDEX: Record<string, number> = { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 }

const visibleColumns = computed(() =>
  props.columns.filter((col) => {
    if (!col.hideBelow) return true
    const current = BREAKPOINT_INDEX[name.value] ?? 0
    const threshold = BREAKPOINT_INDEX[col.hideBelow] ?? 0
    return current >= threshold
  }),
)

const colSpan = computed(() => visibleColumns.value.length + (props.selectable ? 1 : 0))

const isAllSelected = computed(() => {
  if (!props.selected || props.items.length === 0) return false
  return props.items.every((item) =>
    props.selected!.some((s) => s[props.itemKey] === item[props.itemKey]),
  )
})

const isIndeterminate = computed(() => {
  const count = props.selected?.length ?? 0
  return count > 0 && !isAllSelected.value
})

const toggleAll = () => {
  emit(APP_DATA_TABLE_EMIT.UPDATE_SELECTED, isAllSelected.value ? [] : [...props.items])
}

const isRowSelected = (item: T): boolean =>
  props.selected?.some((s) => s[props.itemKey] === item[props.itemKey]) ?? false

const toggleRow = (item: T) => {
  if (!props.selected) return
  if (isRowSelected(item)) {
    emit(
      APP_DATA_TABLE_EMIT.UPDATE_SELECTED,
      props.selected.filter((s) => s[props.itemKey] !== item[props.itemKey]),
    )
  } else {
    emit(APP_DATA_TABLE_EMIT.UPDATE_SELECTED, [...props.selected, item])
  }
}

const onSortClick = (key: string) => {
  if (!props.sortBy || props.sortBy.key !== key) {
    emit(APP_DATA_TABLE_EMIT.UPDATE_SORT_BY, { key, order: 'asc' })
  } else if (props.sortBy.order === 'asc') {
    emit(APP_DATA_TABLE_EMIT.UPDATE_SORT_BY, { key, order: 'desc' })
  } else {
    emit(APP_DATA_TABLE_EMIT.UPDATE_SORT_BY, null)
  }
}

const sortIcon = (key: string): string => {
  if (!props.sortBy || props.sortBy.key !== key) return 'mdi-unfold-more-horizontal'
  return props.sortBy.order === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'
}
</script>

<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate color="primary" height="2" />
    <div style="overflow-x: auto; width: 100%">
      <v-table hover>
        <thead>
          <tr>
            <th v-if="selectable" style="width: 52px">
              <v-checkbox
                :model-value="isAllSelected"
                :indeterminate="isIndeterminate"
                hide-details
                density="compact"
                @update:model-value="toggleAll"
              />
            </th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :style="{
                width: col.width ? String(col.width) : undefined,
                minWidth: col.minWidth,
                textAlign: col.align ?? 'start',
                cursor: col.sortable ? 'pointer' : undefined,
                userSelect: col.sortable ? 'none' : undefined,
              }"
              @click="col.sortable ? onSortClick(col.key) : undefined"
            >
              <div class="d-flex align-center ga-1">
                <span>{{ col.title }}</span>
                <v-icon v-if="col.sortable" :icon="sortIcon(col.key)" size="small" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="items.length === 0">
            <td :colspan="colSpan" class="text-center pa-8">
              <template v-if="loading">
                <v-progress-circular indeterminate size="32" color="primary" />
              </template>
              <template v-else>
                <slot name="empty">
                  <span class="text-medium-emphasis">Không có dữ liệu</span>
                </slot>
              </template>
            </td>
          </tr>

          <tr
            v-for="item in items"
            :key="String(item[itemKey])"
            :style="{
              cursor: 'pointer',
              backgroundColor: isRowSelected(item)
                ? 'rgba(var(--v-theme-primary), 0.08)'
                : undefined,
            }"
            @click="emit(APP_DATA_TABLE_EMIT.ROW_CLICK, item)"
          >
            <td v-if="selectable" @click.stop>
              <v-checkbox
                :model-value="isRowSelected(item)"
                hide-details
                density="compact"
                @update:model-value="toggleRow(item)"
              />
            </td>
            <td
              v-for="col in visibleColumns"
              :key="col.key"
              :style="{ textAlign: col.align ?? 'start' }"
            >
              <slot :name="`item.${col.key}`" :item="item" :value="item[col.key as keyof T]">
                {{ item[col.key as keyof T] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>
