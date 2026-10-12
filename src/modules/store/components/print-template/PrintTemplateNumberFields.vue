<template>
  <div class="number-fields">
    <v-text-field
      v-for="key in keys"
      :id="`${idPrefix}-${key}`"
      :key="key"
      :model-value="modelValue[key]"
      :label="labels[key]"
      :min="range.min"
      :max="range.max"
      type="number"
      suffix="dot"
      :rules="[rangeRule]"
      density="compact"
      variant="outlined"
      hide-details="auto"
      @update:model-value="(value: string) => onFieldUpdate(key, value)"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends { [K in keyof T]: number }">
import { computed } from 'vue'

interface Props {
  modelValue: T

  /** Nhãn hiển thị của từng ô, theo đúng thứ tự cần hiện. */
  labels: Record<keyof T & string, string>

  range: { min: number; max: number }

  /** Tiền tố `id` của các ô, để mỗi ô có id ổn định. */
  idPrefix: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const keys = computed(() => Object.keys(props.labels) as (keyof T & string)[])

const isInRange = (value: string): boolean => {
  const parsed = Number(value)
  return (
    value !== '' &&
    Number.isInteger(parsed) &&
    parsed >= props.range.min &&
    parsed <= props.range.max
  )
}

const rangeRule = (value: string): true | string =>
  isInRange(String(value)) || `${props.range.min}–${props.range.max}`

/** Giá trị đang gõ dở hoặc ngoài khoảng thì chưa áp, để bản xem trước không nhảy theo từng phím. */
function onFieldUpdate(key: keyof T & string, value: string) {
  if (!isInRange(value)) return
  emit('update:modelValue', { ...props.modelValue, [key]: Number(value) })
}
</script>

<style scoped>
.number-fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
</style>
