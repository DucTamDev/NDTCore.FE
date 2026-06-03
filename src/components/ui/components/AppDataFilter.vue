<script setup lang="ts">
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

const getDateRange = (key: string, index: 0 | 1): string => {
  const val = props.modelValue[key] as [string, string] | null
  return val?.[index] ?? ''
}

const updateDateRange = (key: string, index: 0 | 1, value: string) => {
  const current = (props.modelValue[key] as [string, string] | null) ?? ['', '']
  const updated: [string, string] = [current[0], current[1]]
  updated[index] = value
  update(key, updated[0] || updated[1] ? updated : null)
}

const getFieldValue = (key: string): string | null => {
  return props.modelValue[key] as string | null
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
        variant="outlined"
        hide-details
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
        variant="outlined"
        hide-details
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
        variant="outlined"
        hide-details
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
        variant="outlined"
        hide-details
        clearable
        persistent-clear
        style="min-width: 160px; max-width: 200px; flex: 0 0 auto"
        @update:model-value="update(field.key, $event || null)"
      />

      <!-- daterange -->
      <template v-else-if="field.type === 'daterange'">
        <v-text-field
          :model-value="getDateRange(field.key, 0)"
          :label="`${field.label} từ`"
          type="date"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          persistent-clear
          style="min-width: 160px; max-width: 200px; flex: 0 0 auto"
          @update:model-value="updateDateRange(field.key, 0, $event ?? '')"
        />
        <v-text-field
          :model-value="getDateRange(field.key, 1)"
          :label="`${field.label} đến`"
          type="date"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          persistent-clear
          style="min-width: 160px; max-width: 200px; flex: 0 0 auto"
          @update:model-value="updateDateRange(field.key, 1, $event ?? '')"
        />
      </template>
    </template>
  </div>
</template>
