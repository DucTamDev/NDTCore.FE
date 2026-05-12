<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from 'vue'
import type { RowAction } from '../types'
import { APP_ROW_ACTIONS_EMIT } from '../constants/emit-keys'
import type { AppRowActionsEmits } from '../types/emit.types'

const props = defineProps<{
  actions: RowAction<T>[]
  item: T
}>()

const emit = defineEmits<AppRowActionsEmits<T>>()

const visibleActions = computed(() => props.actions.filter((a) => !a.hidden?.(props.item)))
</script>

<template>
  <div class="d-flex ga-1" @click.stop>
    <v-tooltip
      v-for="action in visibleActions"
      :key="action.key"
      :text="action.label"
      location="top"
    >
      <template #activator="{ props: tp }">
        <v-btn
          v-bind="tp"
          :icon="action.icon"
          :color="action.color"
          :disabled="action.disabled?.(item)"
          size="small"
          variant="text"
          @click="emit(APP_ROW_ACTIONS_EMIT.ACTION, action.key, item)"
        />
      </template>
    </v-tooltip>
  </div>
</template>
