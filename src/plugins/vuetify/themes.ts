import type { ThemeDefinition } from 'vuetify'
import { darkTokens, lightTokens, webDarkTokens as webDarkTokens, webLightTokens as webLightTokens } from '@/plugins/vuetify/tokens'
import { buildColors } from './build-colors'
import { buildVariables } from './build-variables'

export const lightTheme: ThemeDefinition = {
  dark: false,
  colors: buildColors(lightTokens.color.semantic),
  variables: buildVariables(
    lightTokens.color.semantic,
    lightTokens.radius,
    lightTokens.typography,
    lightTokens.transition,
  ),
}

export const darkTheme: ThemeDefinition = {
  dark: true,
  colors: buildColors(darkTokens.color.semantic),
  variables: buildVariables(
    darkTokens.color.semantic,
    darkTokens.radius,
    darkTokens.typography,
    darkTokens.transition,
  ),
}

export const webLightTheme: ThemeDefinition = {
  dark: false,
  colors: buildColors(webLightTokens.color.semantic),
  variables: buildVariables(
    webLightTokens.color.semantic,
    darkTokens.radius,
    darkTokens.typography,
    darkTokens.transition,
  ),
}

export const webDarkTheme: ThemeDefinition = {
  dark: true,
  colors: buildColors(webDarkTokens.color.semantic),
  variables: buildVariables(
    webDarkTokens.color.semantic,
    darkTokens.radius,
    darkTokens.typography,
    darkTokens.transition,
  ),
}
