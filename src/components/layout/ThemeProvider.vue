<script setup lang="ts">
import { onMounted, onUnmounted, provide, watchEffect } from 'vue'
import {
  THEME_INJECTION_KEY,
  THEME_MODE,
  useSystemTheme,
  useThemeDOM,
  useThemeState,
  useThemeStorage,
  useVuetifyThemeSync,
  type ThemeContext,
  type VuetifyThemeMap,
} from '@/plugins/vuetify/theme'

const props = defineProps<{
  vuetifyThemeMap?: VuetifyThemeMap
}>()

const { getSystemColorScheme, watchSystemColorScheme } = useSystemTheme()
const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useThemeState(getSystemColorScheme)
const { getPersistedTheme, persistTheme, clearPersistedTheme } = useThemeStorage()
const { applyTheme } = useThemeDOM()
const { sync } = useVuetifyThemeSync(props.vuetifyThemeMap)

watchEffect(() => {
  applyTheme(resolvedTheme.value)
  sync(resolvedTheme.value)
  persistTheme(theme.value)
})

const stopWatchingSystem = watchSystemColorScheme((scheme) => {
  if (theme.value === THEME_MODE.System) {
    setTheme(scheme)
  }
})

onMounted(() => {
  setTheme(getPersistedTheme() ?? THEME_MODE.System)
})

onUnmounted(() => {
  stopWatchingSystem()
})

function resetToSystemTheme() {
  clearPersistedTheme()
  setTheme(THEME_MODE.System)
}

provide(THEME_INJECTION_KEY, {
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
