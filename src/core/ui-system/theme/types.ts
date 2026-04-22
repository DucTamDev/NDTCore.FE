// types.ts
import type { ComputedRef, InjectionKey, Ref } from 'vue';

// ── Theme constants ────────────────────────────────────────────────────────────

export const Theme = {
  Light:     'light',
  Dark:      'dark',
  SoliLight: 'soli-light',
  SoliDark:  'soli-dark',
  System:    'system',
} as const;

export const ResolvedTheme = {
  Light:     'light',
  Dark:      'dark',
  SoliLight: 'soli-light',
  SoliDark:  'soli-dark',
} as const;

export const SystemScheme = {
  Light: 'light',
  Dark:  'dark',
} as const;


// ── Types ──────────────────────────────────────────────────────────────────────

export type ThemeMode         = typeof Theme[keyof typeof Theme];
export type ResolvedThemeMode = typeof ResolvedTheme[keyof typeof ResolvedTheme];
export type SystemColorScheme = typeof SystemScheme[keyof typeof SystemScheme];

// ── Derived lists ──────────────────────────────────────────────────────────────

export const THEME_MODES          = Object.values(Theme)         as ThemeMode[];
export const RESOLVED_THEME_MODES = Object.values(ResolvedTheme) as ResolvedThemeMode[];

// ── Config ─────────────────────────────────────────────────────────────────────

export const DEFAULT_THEME: ThemeMode = Theme.SoliDark;
export const STORAGE_KEY              = 'ds:theme' as const;

// ── Theme pairs — dùng cho toggleTheme ────────────────────────────────────────

export const THEME_PAIRS: Record<ResolvedThemeMode, ResolvedThemeMode> = {
  [ResolvedTheme.Light]:     ResolvedTheme.Dark,
  [ResolvedTheme.Dark]:      ResolvedTheme.Light,
  [ResolvedTheme.SoliLight]: ResolvedTheme.SoliDark,
  [ResolvedTheme.SoliDark]:  ResolvedTheme.SoliLight,
} as const;

// ── Dark variants — dùng cho isDark check ─────────────────────────────────────

export const DARK_THEMES = new Set<ResolvedThemeMode>([
  ResolvedTheme.Dark,
  ResolvedTheme.SoliDark,
]);

// ── Context ────────────────────────────────────────────────────────────────────

export interface ThemeContext {
  readonly theme:              Readonly<Ref<ThemeMode>>;
  readonly resolvedTheme:      ComputedRef<ResolvedThemeMode>;
  readonly isDark:             ComputedRef<boolean>;
  readonly toggleTheme:        () => void;
  readonly setTheme:           (mode: ThemeMode) => void;
  readonly resetToSystemTheme: () => void;
}

export const THEME_KEY: InjectionKey<ThemeContext> = Symbol('theme');