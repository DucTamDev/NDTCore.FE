<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { BulkAction } from '../types'
import { APP_BULK_ACTIONS_EMIT } from '../constants/emit-keys'
import type { AppBulkActionsEmits } from '../types/emit.types';

defineProps<{
  actions: BulkAction[]
  selectionCount: number
}>()

const emit = defineEmits<AppBulkActionsEmits<BulkAction>>()


</script>

<template>
  <v-expand-transition>
    <v-card
      v-if="selectionCount > 0"
      class="pa-3 d-flex align-center flex-wrap ga-3"
      color="primary"
      variant="tonal"
    >
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-check-circle-outline" size="small" />
        <span class="text-body-2 font-weight-medium">{{ selectionCount }} mục đã chọn</span>
      </div>
      <v-divider vertical style="height: 20px; align-self: center" class="mx-1" />
      <div class="d-flex ga-2 flex-wrap">
        <v-btn
          v-for="action in actions"
          :key="action.key"
          :color="action.color"
          :prepend-icon="action.icon"
          size="small"
          variant="tonal"
          @click="emit(APP_BULK_ACTIONS_EMIT.ACTION, action.key, actions)"
        >
          {{ action.label }}
        </v-btn>
      </div>
    </v-card>
  </v-expand-transition>
</template>
