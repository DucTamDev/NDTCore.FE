import type { ComputedRef, InjectionKey, Ref } from 'vue'

export const THEME_MODE = {
  Light: 'light',
  Dark: 'dark',
  SoliLight: 'soli-light',
  SoliDark: 'soli-dark',
  System: 'system',
} as const

export const RESOLVED_THEME_MODE = {
  Light: 'light',
  Dark: 'dark',
  SoliLight: 'soli-light',
  SoliDark: 'soli-dark',
} as const

export const SYSTEM_COLOR_SCHEME = {
  Light: 'light',
  Dark: 'dark',
} as const

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE]
export type ResolvedThemeMode = (typeof RESOLVED_THEME_MODE)[keyof typeof RESOLVED_THEME_MODE]
export type SystemColorScheme = (typeof SYSTEM_COLOR_SCHEME)[keyof typeof SYSTEM_COLOR_SCHEME]

export interface ThemeContext {
  readonly theme: Readonly<Ref<ThemeMode>>
  readonly resolvedTheme: ComputedRef<ResolvedThemeMode>
  readonly isDark: ComputedRef<boolean>
  readonly toggleTheme: () => void
  readonly setTheme: (mode: ThemeMode) => void
  readonly resetToSystemTheme: () => void
}

export const THEME_MODES = Object.values(THEME_MODE) as ThemeMode[]
export const RESOLVED_THEME_MODES = Object.values(RESOLVED_THEME_MODE) as ResolvedThemeMode[]

export const THEME_PAIRS: Record<ResolvedThemeMode, ResolvedThemeMode> = {
  [RESOLVED_THEME_MODE.Light]: RESOLVED_THEME_MODE.Dark,
  [RESOLVED_THEME_MODE.Dark]: RESOLVED_THEME_MODE.Light,
  [RESOLVED_THEME_MODE.SoliLight]: RESOLVED_THEME_MODE.SoliDark,
  [RESOLVED_THEME_MODE.SoliDark]: RESOLVED_THEME_MODE.SoliLight,
}

export const DARK_THEMES = new Set<ResolvedThemeMode>([
  RESOLVED_THEME_MODE.Dark,
  RESOLVED_THEME_MODE.SoliDark,
])

export const DEFAULT_THEME: ThemeMode = THEME_MODE.SoliLight
export const THEME_STORAGE_KEY = 'app_theme' as const
export const THEME_INJECTION_KEY: InjectionKey<ThemeContext> = Symbol('theme_context')
