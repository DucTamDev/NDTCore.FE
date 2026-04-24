import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

import { componentDefaults } from './defaults'
import { mdiIcons } from './icons'
import { DEFAULT_THEME, RESOLVED_THEME_MODE } from './theme/theme.types'
import { darkTheme, lightTheme, soliDarkTheme, soliLightTheme } from './themes'

export const vuetify = createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: DEFAULT_THEME,
    themes: {
      [RESOLVED_THEME_MODE.Light]: lightTheme,
      [RESOLVED_THEME_MODE.Dark]: darkTheme,
      [RESOLVED_THEME_MODE.SoliLight]: soliLightTheme,
      [RESOLVED_THEME_MODE.SoliDark]: soliDarkTheme,
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
