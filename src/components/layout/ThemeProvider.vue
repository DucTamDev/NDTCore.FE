<template>
  <slot v-if="isApp" />
  <div v-else ref="containerRef" :data-theme="resolvedTheme">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch, watchEffect } from 'vue'
import {
  THEME_CONFIG,
  THEME_INJECTION_KEY,
  THEME_MODE,
  THEME_PROVIDER_TYPE,
  useSystemTheme,
  useThemeDOM,
  useThemeState,
  useThemeStorage,
  useVuetifyThemeSync,
  type ThemeContext,
  type ThemeProviderType,
  type VuetifyThemeMap,
} from '@/plugins/vuetify/theme'

const props = defineProps<{
  type?: ThemeProviderType
  vuetifyThemeMap?: VuetifyThemeMap
}>()

const type = computed(() => props.type ?? THEME_PROVIDER_TYPE.App)
const config = computed(() => THEME_CONFIG[type.value])
const isApp = computed(() => type.value === THEME_PROVIDER_TYPE.App)

const containerRef = ref<HTMLElement | null>(null)

const { getSystemColorScheme, watchSystemColorScheme } = useSystemTheme()
const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useThemeState(getSystemColorScheme)
const { getPersistedTheme, persistTheme, clearPersistedTheme } = useThemeStorage(
  config.value.storageKey,
)
const { applyTheme } = useThemeDOM(type.value, containerRef)
const { sync } = useVuetifyThemeSync(props.vuetifyThemeMap)

watchEffect(() => {
  applyTheme(resolvedTheme.value)
  sync(resolvedTheme.value)
})

const stopWatchingSystem = watchSystemColorScheme((scheme) => {
  if (theme.value === THEME_MODE.System) setTheme(scheme)
})

onMounted(() => {
  const initial = getPersistedTheme() ?? config.value.defaultTheme
  setTheme(initial)
  persistTheme(initial)
})

watch(() => theme.value, persistTheme)

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
