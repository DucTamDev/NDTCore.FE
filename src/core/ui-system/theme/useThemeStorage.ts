// useThemeStorage.ts
import { STORAGE_KEY, THEME_MODES, type ThemeMode } from './types';

export function useThemeStorage() {
  const getPersistedTheme = (): ThemeMode | null => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(STORAGE_KEY);
    return THEME_MODES.includes(value as ThemeMode) ? (value as ThemeMode) : null;
  };

  const persistTheme = (mode: ThemeMode) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, mode);
  };

  const clearPersistedTheme = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  };

  return { getPersistedTheme, persistTheme, clearPersistedTheme };
}