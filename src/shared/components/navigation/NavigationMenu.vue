<template>
  <v-list nav density="compact">
    <template v-for="item in visibleItems" :key="item.title">
      <v-list-item
        v-if="!item.children"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
      >
        <template v-if="item.badge" #append>
          <v-chip size="x-small" :color="item.badge.color">
            {{ item.badge.text }}
          </v-chip>
        </template>
      </v-list-item>

      <v-list-group v-else :value="item.title">
        <template #activator="{ props }">
          <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
        </template>

        <v-list-item
          v-for="child in item.children.filter(hasAccess)"
          :key="child.title"
          :to="child.to"
          :title="child.title"
          color="primary"
        />
      </v-list-group>
    </template>
  </v-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { menuConfig } from '../../types/menu.config'
import type { MenuItem } from '../../types/menu.types'

interface Props {
  rail?: boolean
}

defineProps<Props>()

const { canAny } = useAuth()

const visibleItems = computed(() => menuConfig.filter(hasAccess))

function hasAccess(item: MenuItem): boolean {
  if (!item.permissions?.length) return true
  return canAny(item.permissions)
}
</script>
