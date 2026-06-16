<template>
  <v-list-item
    v-if="!item.children"
    :to="item.to ? { name: item.to } : undefined"
    :active="item.to ? route.name === item.to : undefined"
    :prepend-icon="item.icon"
    :title="item.title"
    color="primary"
  >
    <template v-if="item.badge" #append>
      <v-chip size="x-small" :color="item.badge.color">{{ item.badge.text }}</v-chip>
    </template>
  </v-list-item>

  <v-list-group v-else :value="item.title">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
    </template>

    <NavigationMenuItem
      v-for="child in item.children.filter(hasAccess)"
      :key="child.title"
      :item="child"
      :has-access="hasAccess"
    />
  </v-list-group>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { MenuItem } from '@/core/types/_index'

defineProps<{
  item: MenuItem
  hasAccess: (item: MenuItem) => boolean
}>()

const route = useRoute()
</script>
