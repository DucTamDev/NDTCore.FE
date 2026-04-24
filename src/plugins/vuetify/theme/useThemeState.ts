// useThemeState.ts
import { computed, readonly, ref } from 'vue'
import {
    type ThemeMode,
    type ResolvedThemeMode,
    type SystemColorScheme,
    DEFAULT_THEME,
    THEME_MODE,
    DARK_THEMES,
    THEME_PAIRS,
} from './theme.types'

export function useThemeState(getSystemColorScheme: () => SystemColorScheme) {
    const theme = ref<ThemeMode>(DEFAULT_THEME)

    const resolvedTheme = computed<ResolvedThemeMode>(() =>
        theme.value === THEME_MODE.System
            ? (getSystemColorScheme() as ResolvedThemeMode)
            : (theme.value as ResolvedThemeMode),
    )

    const isDark = computed(() => DARK_THEMES.has(resolvedTheme.value))

    const setTheme = (mode: ThemeMode) => {
        theme.value = mode
    }
    const toggleTheme = () => setTheme(THEME_PAIRS[resolvedTheme.value])

    return {
        theme: readonly(theme),
        resolvedTheme,
        isDark,
        setTheme,
        toggleTheme,
    }
}
