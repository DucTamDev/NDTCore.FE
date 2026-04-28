import { type Ref } from 'vue'
import {
    THEME_MODE_CLASS,
    THEME_PROVIDER_TYPE,
    type ThemeProviderType,
    type ResolvedThemeMode,
} from './theme.types'

export function useThemeDOM(type: ThemeProviderType, containerRef?: Ref<HTMLElement | null>) {
    const applyTheme = (resolvedTheme: ResolvedThemeMode) => {
        if (typeof document === 'undefined') return

        const target =
            type === THEME_PROVIDER_TYPE.App ? document.documentElement : containerRef?.value

        if (!target) return

        Object.values(THEME_MODE_CLASS).forEach((cls) => target.classList.remove(cls))
        target.classList.add(THEME_MODE_CLASS[resolvedTheme])
        target.setAttribute('data-theme', resolvedTheme)
    }

    return { applyTheme }
}
