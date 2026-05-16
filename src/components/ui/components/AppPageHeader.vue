<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="d-flex flex-column flex-sm-row align-sm-start justify-space-between ga-3 pb-0">
    <div class="d-flex flex-column ga-1">
      <slot name="breadcrumb" />
      <div class="text-h5 font-weight-bold">{{ title }}</div>
      <div v-if="subtitle" class="text-body-2 text-medium-emphasis">{{ subtitle }}</div>
    </div>
    <div v-if="$slots.default" class="d-flex ga-2 flex-shrink-0 flex-wrap">
      <slot />
    </div>
  </div>
</template>
