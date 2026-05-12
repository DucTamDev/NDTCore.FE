<script setup lang="ts">
import { computed } from 'vue'
import type { DialogSize } from '../types'
import { APP_DIALOG_EMIT } from '../constants/emit-keys'
import type { AppDialogEmits } from '../types/emit.types'

const props = defineProps<{
  modelValue: boolean
  title: string
  size?: DialogSize
  persistent?: boolean
  loading?: boolean
  confirmLabel?: string
  cancelLabel?: string
  hideActions?: boolean
}>()

const emit = defineEmits<AppDialogEmits>()

const close = () => {
  emit(APP_DIALOG_EMIT.CANCEL)
  emit(APP_DIALOG_EMIT.UPDATE_MODEL_VALUE, false)
}

const WIDTH_MAP: Record<string, string> = {
  sm: '400px',
  md: '600px',
  lg: '800px',
  xl: '1100px',
}

const maxWidth = computed(() =>
  props.size === 'fullscreen' ? undefined : WIDTH_MAP[props.size ?? 'md'],
)
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :fullscreen="size === 'fullscreen'"
    :persistent="persistent || loading"
    @update:model-value="emit(APP_DIALOG_EMIT.UPDATE_MODEL_VALUE, $event)"
  >
    <v-card :loading="loading">
      <v-card-title class="d-flex align-center justify-space-between pa-4 pb-3">
        <slot name="title">
          <span class="text-h6">{{ title }}</span>
        </slot>
        <v-btn icon="mdi-close" variant="text" size="small" :disabled="loading" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <slot />
      </v-card-text>

      <template v-if="!hideActions">
        <v-divider />
        <v-card-actions class="pa-4 ga-2 justify-end">
          <slot name="actions">
            <v-btn variant="text" :disabled="loading" @click="close">
              {{ cancelLabel ?? 'Hủy' }}
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :loading="loading"
              @click="emit(APP_DIALOG_EMIT.CONFIRM)"
            >
              {{ confirmLabel ?? 'Xác nhận' }}
            </v-btn>
          </slot>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>
