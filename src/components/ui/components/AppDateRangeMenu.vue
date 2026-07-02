<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: [string, string] | null
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: [string, string] | null]
}>()

const menuOpen = ref(false)
const draftDates = ref<Date[]>([])

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

const displayLabel = computed(() => {
  const val = props.modelValue
  return val?.[0] && val?.[1] ? `${formatDmy(val[0])} - ${formatDmy(val[1])}` : props.label
})

function onMenuUpdate(isOpen: boolean): void {
  menuOpen.value = isOpen
  if (isOpen) {
    const val = props.modelValue
    draftDates.value = val?.[0] && val?.[1] ? [parseDateKey(val[0]), parseDateKey(val[1])] : []
  }
}

function onDraftDatesChange(value: Date[]): void {
  draftDates.value = value
}

function apply(): void {
  const dates = [...draftDates.value].sort((a, b) => a.getTime() - b.getTime())
  const [first, last] = [dates[0], dates[dates.length - 1]]
  emit('update:modelValue', first && last ? [toDateKey(first), toDateKey(last)] : null)
  menuOpen.value = false
}

function cancel(): void {
  menuOpen.value = false
}
</script>

<template>
  <v-btn
    variant="outlined"
    prepend-icon="mdi-calendar-range"
    class="text-none align-self-center"
    style="min-width: 220px; flex: 0 0 auto"
    height="40"
  >
    {{ displayLabel }}
    <v-menu
      :model-value="menuOpen"
      activator="parent"
      location="bottom start"
      :close-on-content-click="false"
      @update:model-value="onMenuUpdate"
    >
      <v-card min-width="300" border="sm">
        <v-date-picker
          :model-value="draftDates"
          :multiple="'range'"
          hide-header
          show-adjacent-months
          @update:model-value="onDraftDatesChange"
        />
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="cancel">Hủy</v-btn>
          <v-btn variant="flat" color="primary" @click="apply">Áp dụng</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-btn>
</template>
