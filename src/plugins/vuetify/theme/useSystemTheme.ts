// useSystemTheme.ts
import { SYSTEM_COLOR_SCHEME, type SystemColorScheme } from './theme.types'

const DARK_MQ = '(prefers-color-scheme: dark)' as const

const fromMatches = (matches: boolean): SystemColorScheme =>
    matches ? SYSTEM_COLOR_SCHEME.Dark : SYSTEM_COLOR_SCHEME.Light

export function useSystemTheme() {
    const getSystemColorScheme = (): SystemColorScheme => {
        if (typeof window === 'undefined') return SYSTEM_COLOR_SCHEME.Light
        return fromMatches(window.matchMedia(DARK_MQ).matches)
    }

    /** Trả về hàm cleanup để gọi khi unmount. */
    const watchSystemColorScheme = (
        onChange: (scheme: SystemColorScheme) => void,
    ): (() => void) => {
        if (typeof window === 'undefined') return () => {}
        const mq = window.matchMedia(DARK_MQ)
        const listener = (e: MediaQueryListEvent) => onChange(fromMatches(e.matches))
        mq.addEventListener('change', listener)
        return () => mq.removeEventListener('change', listener)
    }

    return { getSystemColorScheme, watchSystemColorScheme }
}
