import { THEME_MODE, type SystemColorScheme } from './theme.types'

const DARK_MQ = '(prefers-color-scheme: dark)' as const

const fromMatches = (matches: boolean): SystemColorScheme =>
    matches ? THEME_MODE.Dark : THEME_MODE.Light

export function useSystemTheme() {
    const getSystemColorScheme = (): SystemColorScheme => {
        if (typeof window === 'undefined') return THEME_MODE.Light
        return fromMatches(window.matchMedia(DARK_MQ).matches)
    }

    const watchSystemColorScheme = (onChange: (scheme: SystemColorScheme) => void): (() => void) => {
        if (typeof window === 'undefined') return () => {}
        const mq = window.matchMedia(DARK_MQ)
        const listener = (e: MediaQueryListEvent) => onChange(fromMatches(e.matches))
        mq.addEventListener('change', listener)
        return () => mq.removeEventListener('change', listener)
    }

    return { getSystemColorScheme, watchSystemColorScheme }
}