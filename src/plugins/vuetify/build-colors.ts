import type { ThemeDefinition } from 'vuetify'
import { toHex } from '@/plugins/vuetify/utils/color-convert'
import type { SemanticColorRole } from '@/plugins/vuetify/types'

type VuetifyColors = NonNullable<ThemeDefinition['colors']>

export function buildColors(colors: SemanticColorRole): VuetifyColors {
  return {
    primary: toHex(colors.primary),
    'primary-darken-1': toHex(colors.primaryHover),
    'primary-darken-2': toHex(colors.primaryActive),
    'primary-lighten-1': toHex(colors.primarySubtle),
    secondary: toHex(colors.secondary),
    'secondary-darken-1': toHex(colors.secondaryHover),
    'secondary-darken-2': toHex(colors.secondaryActive),
    'secondary-lighten-1': toHex(colors.secondarySubtle),
    accent: toHex(colors.accent),
    'accent-darken-1': toHex(colors.accentHover),
    'accent-darken-2': toHex(colors.accentActive),
    'accent-lighten-1': toHex(colors.accentSubtle),
    success: toHex(colors.success),
    'success-lighten-1': toHex(colors.successSubtle),
    warning: toHex(colors.warning),
    'warning-lighten-1': toHex(colors.warningSubtle),
    error: toHex(colors.error),
    'error-lighten-1': toHex(colors.errorSubtle),
    info: toHex(colors.info),
    'info-lighten-1': toHex(colors.infoSubtle),
    background: toHex(colors.background),
    surface: toHex(colors.surface),
    'surface-variant': toHex(colors.surfaceElevated),
    'surface-bright': toHex(colors.surfaceElevated),
    'on-primary': toHex(colors.onPrimary),
    'on-secondary': toHex(colors.onSecondary),
    'on-accent': toHex(colors.onAccent),
    'on-success': toHex(colors.onSuccess),
    'on-warning': toHex(colors.onWarning),
    'on-error': toHex(colors.onError),
    'on-info': toHex(colors.onInfo),
    'on-background': toHex(colors.textPrimary),
    'on-surface': toHex(colors.textPrimary),
    'on-surface-variant': toHex(colors.textSecondary),
  }
}
