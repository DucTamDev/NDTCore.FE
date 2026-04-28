<template>
  <v-app-bar elevation="0" border="b">
    <v-app-bar-nav-icon @click="emit('toggle-drawer')" />

    <v-toolbar-title class="font-semibold">
      {{ pageTitle }}
    </v-toolbar-title>

    <v-spacer />

    <v-btn v-if="!isMobile" icon variant="text" @click="emit('toggle-rail')">
      <v-icon>mdi-dock-left</v-icon>
    </v-btn>

    <v-btn icon variant="text" color="primary" @click="toggleTheme">
      <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <v-btn icon variant="text" @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useTheme } from '@/plugins/vuetify/theme'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits<{
  'toggle-drawer': []
  'toggle-rail': []
}>()

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const { isMobile } = useBreakpoint()
const { logout } = useAuth()

const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')
</script>
