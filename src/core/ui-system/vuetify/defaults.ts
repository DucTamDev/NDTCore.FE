// defaults.ts
import { lightTokens } from '@/core/ui-system/tokens'
import type { VuetifyOptions } from 'vuetify'

const { radius } = lightTokens

export const componentDefaults: NonNullable<VuetifyOptions['defaults']> = {
  // ── Inputs ────────────────────────────────────────────────────────
  VTextField:    { variant: 'outlined', density: 'comfortable', rounded: radius.md,   hideDetails: 'auto' },
  VTextarea:     { variant: 'outlined', density: 'comfortable', rounded: radius.md,   hideDetails: 'auto', autoGrow: true },
  VSelect:       { variant: 'outlined', density: 'comfortable', rounded: radius.md,   hideDetails: 'auto' },
  VAutocomplete: { variant: 'outlined', density: 'comfortable', rounded: radius.md,   hideDetails: 'auto' },
  VCombobox:     { variant: 'outlined', density: 'comfortable', rounded: radius.md,   hideDetails: 'auto' },
  VFileInput:    { variant: 'outlined', density: 'comfortable', rounded: radius.md,   hideDetails: 'auto' },

  // ── Buttons ───────────────────────────────────────────────────────
  VBtn:      { rounded: radius.md, elevation: 0, density: 'default' },
  VBtnGroup: { rounded: radius.md, elevation: 0, density: 'default' },
  VFab:      { rounded: radius.lg, elevation: 3 },
  VIconBtn:  { rounded: radius.md, elevation: 0 },

  // ── Containers ────────────────────────────────────────────────────
  VCard:            { rounded: radius.lg,   elevation: 1 },
  VSheet:           { rounded: radius.base, elevation: 0 },
  VExpansionPanels: { rounded: radius.lg,   variant: 'accordion' },
  VExpansionPanel:  { rounded: radius.lg },

  // ── Chips & Badges ────────────────────────────────────────────────
  VChip:  { rounded: radius.full, density: 'comfortable', variant: 'tonal' },
  VBadge: { rounded: radius.full },

  // ── Overlays ──────────────────────────────────────────────────────
  VDialog:           { rounded: radius.xl,  elevation: 8, maxWidth: '600px', scrollable: true },
  VBottomSheet:      { rounded: `${radius['2xl']} ${radius['2xl']} 0 0` },
  VNavigationDrawer: { elevation: 0 },

  // ── Popups ────────────────────────────────────────────────────────
  VMenu:     { rounded: radius.lg, elevation: 4, offset: 4 },
  VTooltip:  { rounded: radius.md, location: 'top' },
  VSnackbar: { rounded: radius.md, elevation: 4, timeout: 4000, location: 'bottom right' },

  // ── Lists ─────────────────────────────────────────────────────────
  VList:     { rounded: radius.md,   density: 'comfortable', elevation: 0 },
  VListItem: { rounded: radius.base, density: 'comfortable' },

  // ── Feedback ──────────────────────────────────────────────────────
  VAlert:  { rounded: radius.md, density: 'comfortable', variant: 'tonal' },
  VBanner: { rounded: radius.md, elevation: 0 },

  // ── Progress ──────────────────────────────────────────────────────
  VProgressLinear:   { rounded: radius.full, height: 4 },
  VProgressCircular: { size: 32, width: 3 },

  // ── Tables ────────────────────────────────────────────────────────
  VDataTable:       { density: 'comfortable', hover: true, fixedHeader: true },
  VDataTableServer: { density: 'comfortable', hover: true, fixedHeader: true },

  // ── Misc ──────────────────────────────────────────────────────────
  VTabs:           { density: 'comfortable', color: 'primary', alignTabs: 'start' },
  VDivider:        { color: 'border' },
  VTimeline:       { density: 'comfortable' },
  VSkeletonLoader: { type: 'card' },
}