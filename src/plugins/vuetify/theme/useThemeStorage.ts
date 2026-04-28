import { THEME_CONFIG, THEME_PROVIDER_TYPE, THEME_MODES, type ThemeMode } from './theme.types'

export function useThemeStorage(
    storageKey: string = THEME_CONFIG[THEME_PROVIDER_TYPE.App].storageKey,
) {
    const getPersistedTheme = (): ThemeMode | null => {
        if (typeof window === 'undefined') return null
        const value = localStorage.getItem(storageKey)
        return THEME_MODES.includes(value as ThemeMode) ? (value as ThemeMode) : null
    }

    const persistTheme = (mode: ThemeMode) => {
        if (typeof window === 'undefined') return
        localStorage.setItem(storageKey, mode)
    }

    const clearPersistedTheme = () => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(storageKey)
    }

    return { getPersistedTheme, persistTheme, clearPersistedTheme }
}
