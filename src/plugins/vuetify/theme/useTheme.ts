import { inject } from 'vue'
import { THEME_INJECTION_KEY, type ThemeContext } from './theme.types'

export function useTheme(): ThemeContext {
    const ctx = inject(THEME_INJECTION_KEY)

    if (!ctx) {
        throw new Error('[Theme] useTheme() phải được gọi bên trong <ThemeProvider>.')
    }

    return ctx
}
