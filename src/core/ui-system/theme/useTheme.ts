import { inject } from 'vue';
import { THEME_KEY, type ThemeContext } from './types';

export function useTheme(): ThemeContext {
  const ctx = inject(THEME_KEY);

  if (!ctx) {
    throw new Error('[Theme] useTheme() phải được gọi bên trong <ThemeProvider>.');
  }

  return ctx;
}