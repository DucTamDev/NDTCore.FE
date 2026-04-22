// build-colors.ts
import { toHex } from '@/core/ui-system/utils/color-convert'
import type { ThemeDefinition } from 'vuetify'
import { SemanticColorRole } from '../types'

type VuetifyColors  = NonNullable<ThemeDefinition['colors']>

export function buildColors(s: SemanticColorRole): VuetifyColors {
  return {
    primary:              toHex(s.primary),
    'primary-darken-1':   toHex(s.primaryHover),
    'primary-darken-2':   toHex(s.primaryActive),
    'primary-lighten-1':  toHex(s.primarySubtle),

    secondary:             toHex(s.secondary),
    'secondary-darken-1':  toHex(s.secondaryHover),
    'secondary-darken-2':  toHex(s.secondaryActive),
    'secondary-lighten-1': toHex(s.secondarySubtle),

    accent:             toHex(s.accent),
    'accent-darken-1':  toHex(s.accentHover),
    'accent-darken-2':  toHex(s.accentActive),
    'accent-lighten-1': toHex(s.accentSubtle),

    success:             toHex(s.success),
    'success-lighten-1': toHex(s.successSubtle),
    warning:             toHex(s.warning),
    'warning-lighten-1': toHex(s.warningSubtle),
    error:               toHex(s.error),
    'error-lighten-1':   toHex(s.errorSubtle),
    info:                toHex(s.info),
    'info-lighten-1':    toHex(s.infoSubtle),

    background:        toHex(s.background),
    surface:           toHex(s.surface),
    'surface-variant': toHex(s.surfaceElevated),
    'surface-bright':  toHex(s.surfaceElevated),

    'on-primary':         toHex(s.onPrimary),
    'on-secondary':       toHex(s.onSecondary),
    'on-accent':          toHex(s.onAccent),
    'on-success':         toHex(s.onSuccess),
    'on-warning':         toHex(s.onWarning),
    'on-error':           toHex(s.onError),
    'on-info':            toHex(s.onInfo),
    'on-background':      toHex(s.textPrimary),
    'on-surface':         toHex(s.textPrimary),
    'on-surface-variant': toHex(s.textSecondary),
  } satisfies VuetifyColors
}