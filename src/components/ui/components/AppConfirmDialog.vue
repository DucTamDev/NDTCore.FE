<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: 'danger' | 'primary'
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440px"
    :persistent="loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="pa-4 pb-2 text-h6">{{ title }}</v-card-title>
      <v-card-text class="pa-4 pt-1 text-body-2">{{ message }}</v-card-text>
      <v-card-actions class="pa-4 pt-0 ga-2 justify-end">
        <v-btn variant="text" :disabled="loading" @click="onCancel">Hủy</v-btn>
        <v-btn
          :color="confirmVariant === 'danger' ? 'error' : 'primary'"
          variant="flat"
          :loading="loading"
          @click="onConfirm"
        >
          {{ confirmLabel ?? 'Xác nhận' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
