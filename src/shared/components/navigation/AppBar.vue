<template>
  <v-app-bar elevation="0" class="border-b border-neutral-200">
    <v-app-bar-nav-icon @click="emit('toggle-drawer')" />

    <v-toolbar-title class="font-semibold">
      {{ pageTitle }}
    </v-toolbar-title>

    <v-spacer />

    <v-btn v-if="!isMobile" icon variant="text" @click="emit('search')">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon variant="text" @click="toggleTheme">
      <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useBreakpoint } from '@/shared/composables/useBreakpoint'

const emit = defineEmits<{
  'toggle-drawer': []
  search: []
}>()

const route = useRoute()
const theme = useTheme()
const { isMobile } = useBreakpoint()

const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')
const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>
