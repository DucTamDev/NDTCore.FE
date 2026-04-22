<template>
  <v-breadcrumbs v-if="items.length > 1" :items="items" class="px-0">
    <template #divider>
      <v-icon size="small">mdi-chevron-right</v-icon>
    </template>

    <template #item="{ item }">
      <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" class="text-sm">
        {{ item.title }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItem } from '../../types/breadcrumb.types'

const route = useRoute()

const items = computed<BreadcrumbItem[]>(() => {
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'Home', to: '/dashboard' }]

  if (route.meta.breadcrumbs) {
    breadcrumbs.push(...(route.meta.breadcrumbs as BreadcrumbItem[]))
  } else {
    const paths = route.path.split('/').filter(Boolean)
    paths.forEach((path, index) => {
      const to = '/' + paths.slice(0, index + 1).join('/')
      breadcrumbs.push({
        title: formatTitle(path),
        to: index === paths.length - 1 ? undefined : to,
        disabled: index === paths.length - 1,
      })
    })
  }

  return breadcrumbs
})

function formatTitle(path: string): string {
  return path
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>
