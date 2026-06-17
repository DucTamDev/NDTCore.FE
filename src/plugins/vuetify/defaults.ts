import type { VuetifyOptions } from 'vuetify'
import { baseTokens } from '@/plugins/vuetify/tokens'
import { typographyTokens } from '@/plugins/vuetify/tokens/typography'

const { radius } = baseTokens

export const componentDefaults: NonNullable<VuetifyOptions['defaults']> = {
    // App
    VApp: {
        style: [{ fontFamily: typographyTokens.fontFamily.sans }],
    },

    // Inputs
    VTextField: {
        variant: 'solo-filled',
        flat: true,
        density: 'comfortable',
        rounded: radius.md,
        hideDetails: 'auto',
    },

    VTextarea: {
        variant: 'solo-filled',
        flat: true,
        density: 'comfortable',
        rounded: radius.md,
        hideDetails: 'auto',
        autoGrow: true,
    },

    VSelect: {
        variant: 'solo-filled',
        flat: true,
        density: 'comfortable',
        rounded: radius.md,
        hideDetails: 'auto',
    },

    VAutocomplete: {
        variant: 'solo-filled',
        flat: true,
        density: 'comfortable',
        rounded: radius.md,
        hideDetails: 'auto',
    },

    VCombobox: {
        variant: 'solo-filled',
        flat: true,
        density: 'comfortable',
        rounded: radius.md,
        hideDetails: 'auto',
    },

    VFileInput: {
        variant: 'solo-filled',
        flat: true,
        density: 'comfortable',
        rounded: radius.md,
        hideDetails: 'auto',
        clearable: true,
    },

    // Toggle Controls
    VSwitch: {
        color: 'primary',
        density: 'comfortable',
        hideDetails: 'auto',
        inset: true,
    },

    VCheckbox: {
        color: 'primary',
        density: 'comfortable',
        hideDetails: 'auto',
    },

    VRadioGroup: {
        density: 'comfortable',
        hideDetails: 'auto',
    },

    VRadio: {
        color: 'primary',
        density: 'comfortable',
    },

    // Actions
    VBtn: {
        rounded: radius.md,
        elevation: 0,
        density: 'comfortable',
    },

    VBtnGroup: {
        rounded: radius.md,
        elevation: 0,
        density: 'comfortable',
    },

    VFab: {
        rounded: radius.lg,
        elevation: 3,
    },

    // Surfaces
    VCard: {
        rounded: radius.lg,
        elevation: 0,
    },

    VSheet: {
        rounded: radius.lg,
        elevation: 0,
    },

    VDialog: {
        rounded: radius.lg,
        scrollable: true,
    },

    VBottomSheet: {
        rounded: radius.lg,
    },

    // Feedback
    VChip: {
        rounded: radius.full,
        density: 'comfortable',
        variant: 'tonal',
    },

    VAlert: {
        rounded: radius.md,
        density: 'comfortable',
        variant: 'tonal',
    },

    VSnackbar: {
        rounded: radius.md,
        elevation: 2,
        timeout: 3000,
        location: 'bottom right',
        multiLine: true,
    },

    VTooltip: {
        location: 'top',
        openDelay: 400,
        transition: 'fade-transition',
    },

    VProgressLinear: {
        rounded: radius.full,
        height: 3,
        color: 'primary',
    },

    VProgressCircular: {
        size: 32,
        width: 3,
        color: 'primary',
    },

    // Navigation
    VNavigationDrawer: {
        elevation: 0,
    },

    VMenu: {
        rounded: radius.lg,
        elevation: 2,
        offset: 4,
    },

    VTabs: {
        density: 'comfortable',
        color: 'primary',
    },

    VBreadcrumbs: {
        density: 'comfortable',
    },

    VPagination: {
        density: 'comfortable',
        rounded: 'circle',
        activeColor: 'primary',
    },

    // Lists
    VList: {
        rounded: radius.md,
        density: 'comfortable',
        elevation: 0,
    },

    VListItem: {
        rounded: radius.base,
        density: 'comfortable',
    },

    // Data Display
    VDataTable: {
        density: 'compact',
        hover: true,
        fixedHeader: true,
        itemsPerPage: 25,
    },

    VDataTableServer: {
        density: 'compact',
        hover: true,
        fixedHeader: true,
        itemsPerPage: 25,
    },

    VExpansionPanel: {
        rounded: radius.md,
    },
}
