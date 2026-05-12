<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="d-flex flex-column align-center justify-center pa-12 ga-4 text-center">
    <v-icon v-if="icon" :icon="icon" size="64" color="medium-emphasis" />
    <div class="d-flex flex-column ga-1">
      <div class="text-h6">{{ title }}</div>
      <div v-if="description" class="text-body-2 text-medium-emphasis">{{ description }}</div>
    </div>
    <div v-if="$slots.actions" class="d-flex ga-2 flex-wrap justify-center">
      <slot name="actions" />
    </div>
  </div>
</template>
