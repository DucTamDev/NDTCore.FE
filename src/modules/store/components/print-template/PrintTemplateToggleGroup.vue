<template>
  <div class="d-flex flex-column ga-2">
    <div class="text-overline text-medium-emphasis">{{ title }}</div>
    <v-chip-group
      :model-value="selectedKeys"
      multiple
      column
      selected-class="text-primary"
      @update:model-value="onSelectionUpdate"
    >
      <v-chip v-for="key in keys" :key="key" :value="key" filter variant="outlined" size="small">
        {{ labels[key] }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script setup lang="ts" generic="K extends string">
import { computed } from 'vue'

interface Props {
  title: string

  keys: K[]

  labels: Record<K, string>

  /** Trạng thái bật/tắt hiện tại của từng khoá. */
  values: Record<K, boolean>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [changes: Record<K, boolean>]
}>()

const selectedKeys = computed(() => props.keys.filter((key) => props.values[key]))

/** Trả về trạng thái mới của mọi khoá trong nhóm, để phía trên gộp vào mẫu một lần. */
function onSelectionUpdate(selected: K[]) {
  const entries = props.keys.map((key) => [key, selected.includes(key)])
  emit('change', Object.fromEntries(entries) as Record<K, boolean>)
}
</script>
