// useThemeState.ts
import { computed, readonly, ref } from 'vue';
import {
  Theme, ResolvedTheme, DEFAULT_THEME, DARK_THEMES, THEME_PAIRS,
  type ThemeMode, type ResolvedThemeMode, type SystemColorScheme,
} from './types';

export function useThemeState(getSystemColorScheme: () => SystemColorScheme) {
  const theme = ref<ThemeMode>(DEFAULT_THEME);

  const resolvedTheme = computed<ResolvedThemeMode>(() =>
    theme.value === Theme.System
      ? getSystemColorScheme() as ResolvedThemeMode
      : theme.value as ResolvedThemeMode,
  );

  const isDark = computed(() => DARK_THEMES.has(resolvedTheme.value));

  const setTheme    = (mode: ThemeMode) => { theme.value = mode; };
  const toggleTheme = () => setTheme(THEME_PAIRS[resolvedTheme.value]);

  return {
    theme: readonly(theme),
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme,
  };
}