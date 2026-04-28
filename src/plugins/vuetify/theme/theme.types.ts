import type { ComputedRef, InjectionKey, Ref } from 'vue'

export const THEME_MODE = {
    Light:     'light',
    Dark:      'dark',
    SoliLight: 'soli-light',
    SoliDark:  'soli-dark',
    System:    'system',
} as const

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE]
export type ResolvedThemeMode = Exclude<ThemeMode, 'system'>
export type SystemColorScheme = typeof THEME_MODE.Light | typeof THEME_MODE.Dark

export const THEME_MODES = Object.values(THEME_MODE) as ThemeMode[]
export const RESOLVED_THEME_MODES = Object.values(THEME_MODE).filter(
    (v): v is ResolvedThemeMode => v !== THEME_MODE.System,
)

export const THEME_MODE_CLASS = Object.fromEntries(
    RESOLVED_THEME_MODES.map((v) => [v, `theme-${v}`]),
) as Record<ResolvedThemeMode, string>

export const THEME_PAIRS: Record<ResolvedThemeMode, ResolvedThemeMode> = {
    [THEME_MODE.Light]:     THEME_MODE.Dark,
    [THEME_MODE.Dark]:      THEME_MODE.Light,
    [THEME_MODE.SoliLight]: THEME_MODE.SoliDark,
    [THEME_MODE.SoliDark]:  THEME_MODE.SoliLight,
}

export const DARK_THEMES = new Set<ResolvedThemeMode>([THEME_MODE.Dark, THEME_MODE.SoliDark])
export const DEFAULT_THEME: ThemeMode = THEME_MODE.SoliLight

export interface ThemeContext {
    readonly theme: Readonly<Ref<ThemeMode>>
    readonly resolvedTheme: ComputedRef<ResolvedThemeMode>
    readonly isDark: ComputedRef<boolean>
    readonly toggleTheme: () => void
    readonly setTheme: (mode: ThemeMode) => void
    readonly resetToSystemTheme: () => void
}

export const THEME_PROVIDER_TYPE = {
    App:   'app',
    Admin: 'admin',
} as const
export type ThemeProviderType = (typeof THEME_PROVIDER_TYPE)[keyof typeof THEME_PROVIDER_TYPE]

export const THEME_CONFIG: Record<ThemeProviderType, { storageKey: string; defaultTheme: ThemeMode }> = {
    [THEME_PROVIDER_TYPE.App]:   { storageKey: 'app_theme',   defaultTheme: THEME_MODE.SoliLight },
    [THEME_PROVIDER_TYPE.Admin]: { storageKey: 'admin_theme', defaultTheme: THEME_MODE.Light },
}

export const THEME_INJECTION_KEY: InjectionKey<ThemeContext> = Symbol('theme_context')