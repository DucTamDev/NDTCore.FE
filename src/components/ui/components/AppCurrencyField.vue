<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number | null
  label?: string
  required?: boolean
  nullable?: boolean
  disabled?: boolean
  hint?: string
  variant?: 'outlined' | 'filled' | 'solo' | 'solo-filled' | 'solo-inverted' | 'plain' | 'underlined'
  flat?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const displayValue = computed(() =>
  props.modelValue != null ? props.modelValue.toLocaleString('vi-VN') : '',
)

function onInput(raw: string) {
  const cleaned = raw.replace(/\./g, '').replace(/[^\d]/g, '')
  if (cleaned === '') {
    emit('update:modelValue', props.nullable ? null : 0)
    return
  }
  const num = parseInt(cleaned, 10)
  emit('update:modelValue', isNaN(num) ? 0 : num)
}

const rules = computed(() => {
  const r: ((v: string) => true | string)[] = []
  if (props.required) {
    r.push((v) => (v !== '' && v !== null) || 'Trường này là bắt buộc')
  }
  if (!props.nullable) {
    r.push((v) => {
      const n = parseInt((v ?? '').replace(/\./g, ''), 10)
      return (!isNaN(n) && n >= 0) || 'Giá phải ≥ 0'
    })
  }
  return r
})
</script>

<template>
  <v-text-field
    :model-value="displayValue"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :hint="hint"
    :variant="variant"
    :flat="flat"
    suffix="₫"
    inputmode="numeric"
    @update:model-value="onInput"
  />
</template>
