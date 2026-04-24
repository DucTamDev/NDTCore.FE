import type { ThemeDefinition } from 'vuetify'
import { lightTokens } from '@/plugins/vuetify/tokens'
import type { ThemeTokens } from '@/plugins/vuetify/types'
import { toHex } from '@/plugins/vuetify/utils/color-convert'

type VuetifyVariables = NonNullable<ThemeDefinition['variables']>
type SemanticColors = typeof lightTokens.color.semantic

export function buildVariables(
  colors: SemanticColors,
  radius: ThemeTokens['radius'],
  typography: ThemeTokens['typography'],
  transition: ThemeTokens['transition'],
): VuetifyVariables {
  return {
    'border-color': toHex(colors.border),
    'border-opacity': 1,
    'high-emphasis-opacity': 1,
    'medium-emphasis-opacity': 0.7,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'overlay-opacity': 0.32,
    'overlay-scrim-opacity': 0.5,
    'theme-kbd': toHex(colors.surfaceElevated),
    'theme-on-kbd': toHex(colors.textPrimary),
    'theme-code': toHex(colors.surfaceElevated),
    'theme-on-code': toHex(colors.textPrimary),
    'font-family': typography.fontFamily.mono,
    'font-size-root': typography.fontSize.base.size,
    'line-height-root': typography.lineHeight.normal,
    'button-font-family': typography.fontFamily.mono,
    'input-font-family': typography.fontFamily.mono,
    'border-radius-root': radius.base,
    'rounded-xs': radius.xs,
    'rounded-sm': radius.sm,
    rounded: radius.base,
    'rounded-md': radius.md,
    'rounded-lg': radius.lg,
    'rounded-xl': radius.xl,
    'rounded-pill': radius.full,
    'shadow-key-umbra-opacity': '0.2',
    'shadow-key-penumbra-opacity': '0.14',
    'shadow-key-ambient-opacity': '0.12',
    'transition-fast-out-slow-in': `${transition.duration.base} ${transition.easing.easeInOut}`,
    'transition-fast-out-linear-in': `${transition.duration.fast} ${transition.easing.easeIn}`,
    'transition-linear-out-slow-in': `${transition.duration.slow} ${transition.easing.easeOut}`,
    'transition-spring': `${transition.duration.slow} ${transition.easing.spring}`,
  }
}
