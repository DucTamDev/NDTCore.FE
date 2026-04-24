// useThemeStorage.ts
import { THEME_STORAGE_KEY, THEME_MODES, type ThemeMode } from './theme.types'

export function useThemeStorage() {
    const getPersistedTheme = (): ThemeMode | null => {
        if (typeof window === 'undefined') return null
        const value = localStorage.getItem(THEME_STORAGE_KEY)
        return THEME_MODES.includes(value as ThemeMode) ? (value as ThemeMode) : null
    }

    const persistTheme = (mode: ThemeMode) => {
        if (typeof window === 'undefined') return
        localStorage.setItem(THEME_STORAGE_KEY, mode)
    }

    const clearPersistedTheme = () => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(THEME_STORAGE_KEY)
    }

    return { getPersistedTheme, persistTheme, clearPersistedTheme }
}
