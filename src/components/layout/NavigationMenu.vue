<template>
  <v-list nav density="compact">
    <template v-for="(entry, index) in menuConfig" :key="index">
      <template v-if="!isMenuSection(entry) && hasAccess(entry)">
        <NavigationMenuItem :item="entry" :has-access="hasAccess" />
      </template>

      <template v-else-if="isMenuSection(entry) && hasAccessToSection(entry)">
        <v-list-subheader v-if="!rail">{{ entry.section }}</v-list-subheader>
        <NavigationMenuItem
          v-for="item in entry.items.filter(hasAccess)"
          :key="item.title"
          :item="item"
          :has-access="hasAccess"
        />
      </template>
    </template>
  </v-list>
</template>

<script setup lang="ts">
import { menuConfig } from '@/core/constants/menu-config.constants'
import { isMenuSection } from '@/core/types/_index'
import { useMenuAccess } from '@/composables/useMenuAccess'
import NavigationMenuItem from './NavigationMenuItem.vue'

defineProps<{ rail?: boolean }>()

const { hasAccess, hasAccessToSection } = useMenuAccess()
</script>
