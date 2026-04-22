// src/app/plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { md3 } from 'vuetify/blueprints'

import { lightTheme, darkTheme, componentDefaults } from '@/core/ui-system/vuetify'
import { soliDarkTheme, soliLightTheme } from '@/core/ui-system/vuetify/themes'
import { ResolvedTheme } from '@/core/ui-system/theme'
import { DEFAULT_THEME } from '@/core/ui-system/theme/types'

export const vuetify = createVuetify({
    blueprint: md3,

    theme: {
        defaultTheme: DEFAULT_THEME,
        themes: {
            [ResolvedTheme.Light]: lightTheme,
            [ResolvedTheme.Dark]: darkTheme,
            [ResolvedTheme.SoliLight]: soliLightTheme,
            [ResolvedTheme.SoliDark]: soliDarkTheme,
        },
        variations: {
            colors: ['primary', 'secondary', 'accent', 'error', 'warning', 'success', 'info'],
            lighten: 2,
            darken: 2,
        },
    },

    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },

    defaults: componentDefaults,
})
