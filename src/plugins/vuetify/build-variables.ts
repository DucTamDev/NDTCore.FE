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
    // BORDER SYSTEM
    // 'border-color': toHex(colors.border),
    // 'border-opacity': 0.12,

    // TEXT / EMPHASIS SYSTEM
    'high-emphasis-opacity': 1,
    'medium-emphasis-opacity': 0.7,
    'disabled-opacity': 0.38,

    // STATE LAYERS (MD3 interaction system)
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,

    // OVERLAY SYSTEM (dialogs, menus, scrim)
    'overlay-opacity': 0.32,
    'overlay-scrim-opacity': 0.5,

    // IMPORTANT: MD3 elevation tint system
    'v-elevation-overlay-color': '0, 0, 0',

    // SHADOW SYSTEM
    'v-shadow-key-opacity': '0.2',
    'v-shadow-penumbra-opacity': '0.14',
    'v-shadow-ambient-opacity': '0.12',
    
    // CODE / KBD TOKENS
    'theme-kbd': toHex(colors.surfaceElevated),
    'theme-on-kbd': toHex(colors.textPrimary),
    'theme-code': toHex(colors.surfaceElevated),
    'theme-on-code': toHex(colors.textPrimary),

    // TYPOGRAPHY SYSTEM
    'font-family': typography.fontFamily.mono,
    'font-size-root': typography.fontSize.base.size,
    'line-height-root': typography.lineHeight.normal,
    'button-font-family': typography.fontFamily.mono,
    'input-font-family': typography.fontFamily.mono,

    // SHAPE SYSTEM
    'border-radius-root': radius.base,
    'rounded-xs': radius.xs,
    'rounded-sm': radius.sm,
    rounded: radius.base,
    'rounded-md': radius.md,
    'rounded-lg': radius.lg,
    'rounded-xl': radius.xl,
    'rounded-pill': radius.full,

    // TRANSITION SYSTEM (motion design)
    'transition-fast-out-slow-in': `${transition.duration.base} ${transition.easing.easeInOut}`,
    'transition-fast-out-linear-in': `${transition.duration.fast} ${transition.easing.easeIn}`,
    'transition-linear-out-slow-in': `${transition.duration.slow} ${transition.easing.easeOut}`,
    'transition-spring': `${transition.duration.slow} ${transition.easing.spring}`,
  }
}
