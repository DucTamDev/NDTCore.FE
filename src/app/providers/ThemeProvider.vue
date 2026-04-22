<script setup lang="ts">
import { provide, watchEffect, onMounted, onUnmounted } from 'vue'

import {
  Theme, THEME_KEY,
  useSystemTheme, useThemeState, useThemeStorage, useThemeDOM, useVuetifyThemeSync,
  type ThemeContext, type VuetifyThemeMap,
} from '@/core/ui-system/theme'

const props = defineProps<{
  vuetifyThemeMap?: VuetifyThemeMap
}>()

// ── Khởi tạo ──────────────────────────────────────────────────────────────────

const { getSystemColorScheme, watchSystemColorScheme } = useSystemTheme()
const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useThemeState(getSystemColorScheme)
const { getPersistedTheme, persistTheme, clearPersistedTheme } = useThemeStorage()
const { applyTheme } = useThemeDOM()
const { sync }       = useVuetifyThemeSync(props.vuetifyThemeMap)

// ── Side effects ───────────────────────────────────────────────────────────────

watchEffect(() => {
  applyTheme(resolvedTheme.value)
  sync(resolvedTheme.value)
  persistTheme(theme.value)
})

const stopWatchingSystem = watchSystemColorScheme((scheme) => {
  if (theme.value === Theme.System) setTheme(scheme)
})

onMounted(() => {
  setTheme(getPersistedTheme() ?? Theme.System)
})

onUnmounted(() => {
  stopWatchingSystem()
})

// ── Actions ────────────────────────────────────────────────────────────────────

const resetToSystemTheme = () => {
  clearPersistedTheme()
  setTheme(Theme.System)
}

// ── Provide ────────────────────────────────────────────────────────────────────

provide(THEME_KEY, {
  theme,
  resolvedTheme,
  isDark,
  toggleTheme,
  setTheme,
  resetToSystemTheme,
} satisfies ThemeContext)
</script>

<template>
  <slot />
</template>