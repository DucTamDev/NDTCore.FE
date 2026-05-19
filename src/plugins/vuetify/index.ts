import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

import { componentDefaults } from './defaults'
import { mdiIcons } from './icons'
import { DEFAULT_THEME, THEME_MODE } from './theme/theme.types'
import { darkTheme, lightTheme, webDarkTheme, webLightTheme } from './themes'

export const vuetify = createVuetify({
    blueprint: md3,
    theme: {
        defaultTheme: DEFAULT_THEME,
        themes: {
            [THEME_MODE.Light]: lightTheme,
            [THEME_MODE.Dark]: darkTheme,
            [THEME_MODE.WebLight]: webLightTheme,
            [THEME_MODE.WebDark]: webDarkTheme,
        },
        variations: {
            colors: ['primary', 'secondary', 'accent', 'error', 'warning', 'success', 'info'],
            lighten: 2,
            darken: 2,
        },
    },
    icons: mdiIcons,
    defaults: componentDefaults,
})
