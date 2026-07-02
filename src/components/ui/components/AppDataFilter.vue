<script setup lang="ts">
import { reactive } from 'vue'
import type { FilterField, ActiveFilters, FilterValue } from '../types'
import { APP_DATA_FILTER_EMIT } from '../constants/emit-keys'
import type { AppDataFilterEmits } from '../types/emit.types'

const props = defineProps<{
  fields: FilterField[]
  modelValue: ActiveFilters
}>()

const emit = defineEmits<AppDataFilterEmits>()

const update = (key: string, value: FilterValue) => {
  emit(APP_DATA_FILTER_EMIT.UPDATE_MODEL_VALUE, { ...props.modelValue, [key]: value })
}

const getStr = (key: string): string => (props.modelValue[key] as string | null) ?? ''

const getStrArr = (key: string): string[] => (props.modelValue[key] as string[] | null) ?? []

const getFieldValue = (key: string): string | null => {
  return props.modelValue[key] as string | null
}

const menuOpen = reactive<Record<string, boolean>>({})
const draftDates = reactive<Record<string, Date[]>>({})

function parseDateKey(key: string): Date {
  const parts = key.split('-').map(Number)
  return new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1)
}

function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDmy(key: string): string {
  const [y, m, d] = key.split('-')
  return `${d}/${m}/${y}`
}

function dateRangeLabel(field: FilterField): string {
  const val = props.modelValue[field.key] as [string, string] | null
  return val?.[0] && val?.[1] ? `${formatDmy(val[0])} - ${formatDmy(val[1])}` : field.label
}

function onDateRangeMenuUpdate(key: string, isOpen: boolean): void {
  menuOpen[key] = isOpen
  if (isOpen) {
    const val = props.modelValue[key] as [string, string] | null
    draftDates[key] = val?.[0] && val?.[1] ? [parseDateKey(val[0]), parseDateKey(val[1])] : []
  }
}

function onDraftDatesChange(key: string, value: Date[]): void {
  draftDates[key] = value
}

function applyDateRange(key: string): void {
  const dates = [...(draftDates[key] ?? [])].sort((a, b) => a.getTime() - b.getTime())
  const [first, last] = [dates[0], dates[dates.length - 1]]
  update(key, first && last ? [toDateKey(first), toDateKey(last)] : null)
  menuOpen[key] = false
}

function cancelDateRange(key: string): void {
  menuOpen[key] = false
}
</script>

<template>
  <div class="d-flex flex-wrap ga-2">
    <template v-for="field in fields" :key="field.key">
      <!-- text -->
      <v-text-field
        v-if="field.type === 'text'"
        :model-value="getStr(field.key)"
        :label="field.label"
        :placeholder="field.placeholder"
        density="compact"
        hide-details="auto"
        clearable
        persistent-clear
        style="min-width: 180px; max-width: 280px; flex: 0 0 auto"
        @update:model-value="update(field.key, $event ?? null)"
        @keyup.enter="emit(APP_DATA_FILTER_EMIT.SEARCH)"
      />

      <!-- select -->
      <v-select
        v-else-if="field.type === 'select'"
        :model-value="getFieldValue(field.key)"
        :items="field.options ?? []"
        item-title="label"
        item-value="value"
        :label="field.label"
        density="compact"
        hide-details="auto"
        style="min-width: 160px; max-width: 240px; flex: 0 0 auto"
        @update:model-value="update(field.key, $event ?? null)"
      />

      <!-- multiselect -->
      <v-select
        v-else-if="field.type === 'multiselect'"
        :model-value="getStrArr(field.key)"
        :items="field.options ?? []"
        item-title="label"
        item-value="value"
        :label="field.label"
        density="compact"
        hide-details="auto"
        multiple
        chips
        closable-chips
        style="min-width: 200px; max-width: 320px; flex: 0 0 auto"
        @update:model-value="update(field.key, ($event as string[])?.length ? $event : null)"
      />

      <!-- date -->
      <v-text-field
        v-else-if="field.type === 'date'"
        :model-value="getStr(field.key)"
        :label="field.label"
        type="date"
        density="compact"
        hide-details="auto"
        clearable
        persistent-clear
        style="min-width: 160px; max-width: 200px; flex: 0 0 auto"
        @update:model-value="update(field.key, $event || null)"
      />

      <!-- daterange -->
      <template v-else-if="field.type === 'daterange'">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-calendar-range"
          class="text-none align-self-center"
          style="min-width: 220px; flex: 0 0 auto"
          height="40"
        >
          {{ dateRangeLabel(field) }}
          <v-menu
            :model-value="menuOpen[field.key] ?? false"
            activator="parent"
            location="bottom start"
            :close-on-content-click="false"
            @update:model-value="onDateRangeMenuUpdate(field.key, $event)"
          >
            <v-card min-width="300" border="sm">
              <v-date-picker
                :model-value="draftDates[field.key] ?? []"
                :multiple="'range'"
                hide-header
                show-adjacent-months
                @update:model-value="onDraftDatesChange(field.key, $event)"
              />
              <v-card-actions class="justify-end">
                <v-btn variant="text" @click="cancelDateRange(field.key)">Hủy</v-btn>
                <v-btn variant="flat" color="primary" @click="applyDateRange(field.key)">Áp dụng</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-btn>
      </template>
    </template>
  </div>
</template>
