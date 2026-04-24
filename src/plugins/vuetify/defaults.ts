import type { VuetifyOptions } from 'vuetify'
import { baseTokens } from '@/plugins/vuetify/tokens'
import { typographyTokens } from '@/plugins/vuetify/tokens/typography'

const { radius } = baseTokens

export const componentDefaults: NonNullable<VuetifyOptions['defaults']> = {
  VApp: {
    style: [{ fontFamily: typographyTokens.fontFamily.sans }],
  },
  VTextField: { variant: 'outlined', density: 'comfortable', rounded: radius.md, hideDetails: 'auto' },
  VTextarea: {
    variant: 'outlined',
    density: 'comfortable',
    rounded: radius.md,
    hideDetails: 'auto',
    autoGrow: true,
  },
  VSelect: { variant: 'outlined', density: 'comfortable', rounded: radius.md, hideDetails: 'auto' },
  VAutocomplete: { variant: 'outlined', density: 'comfortable', rounded: radius.md, hideDetails: 'auto' },
  VCombobox: { variant: 'outlined', density: 'comfortable', rounded: radius.md, hideDetails: 'auto' },
  VFileInput: { variant: 'outlined', density: 'comfortable', rounded: radius.md, hideDetails: 'auto' },
  VBtn: { rounded: radius.md, elevation: 0, density: 'default' },
  VBtnGroup: { rounded: radius.md, elevation: 0, density: 'default' },
  VFab: { rounded: radius.lg, elevation: 3 },
  VCard: { rounded: radius.lg, elevation: 1 },
  VSheet: { rounded: radius.base, elevation: 0 },
  VChip: { rounded: radius.full, density: 'comfortable', variant: 'tonal' },
  VNavigationDrawer: { elevation: 0 },
  VMenu: { rounded: radius.lg, elevation: 4, offset: 4 },
  VSnackbar: { rounded: radius.md, elevation: 4, timeout: 4000, location: 'bottom right' },
  VList: { rounded: radius.md, density: 'comfortable', elevation: 0 },
  VListItem: { rounded: radius.base, density: 'comfortable' },
  VAlert: { rounded: radius.md, density: 'comfortable', variant: 'tonal' },
  VProgressLinear: { rounded: radius.full, height: 4 },
  VProgressCircular: { size: 32, width: 3 },
  VDataTable: { density: 'comfortable', hover: true, fixedHeader: true },
  VDataTableServer: { density: 'comfortable', hover: true, fixedHeader: true },
}
