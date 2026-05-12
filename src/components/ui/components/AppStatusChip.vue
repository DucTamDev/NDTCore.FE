<script setup lang="ts">
import type { StatusConfig } from '../types'

defineProps<{
  config: StatusConfig
}>()
</script>

<template>
  <v-chip
    :color="config.color"
    :prepend-icon="config.icon"
    :variant="config.variant ?? 'tonal'"
    size="small"
  >
    {{ config.label }}
  </v-chip>
</template>
