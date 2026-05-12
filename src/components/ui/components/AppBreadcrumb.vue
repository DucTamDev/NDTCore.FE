<script setup lang="ts">
import type { BreadcrumbItem } from '../types'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <v-breadcrumbs :items="items" class="pa-0">
    <template #divider>
      <v-icon icon="mdi-chevron-right" size="x-small" />
    </template>
  </v-breadcrumbs>
</template>
