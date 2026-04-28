<template>
  <v-breadcrumbs v-if="items.length > 1" :items="items" class="px-0">
    <template #divider>
      <v-icon size="small">mdi-chevron-right</v-icon>
    </template>

    <template #item="{ item }">
      <v-breadcrumbs-item :to="item.to" :disabled="item.disabled">
        {{ item.title }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItem } from '@/models/breadcrumb.models'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'

const route = useRoute()

const items = computed<BreadcrumbItem[]>(() => {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', to: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.PATH },
  ]
  const routeBreadcrumbs = (route.meta.breadcrumb ?? route.meta.breadcrumbs) as
    | BreadcrumbItem[]
    | undefined

  if (routeBreadcrumbs) {
    breadcrumbs.push(...routeBreadcrumbs)
    return breadcrumbs
  }

  const segments = route.path.split('/').filter(Boolean)

  segments.forEach((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join('/')}`
    breadcrumbs.push({
      title: formatTitle(segment),
      to: index === segments.length - 1 ? undefined : to,
      disabled: index === segments.length - 1,
    })
  })

  return breadcrumbs
})

function formatTitle(value: string): string {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>
