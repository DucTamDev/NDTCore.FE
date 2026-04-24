import type { ThemeDefinition } from 'vuetify'
import { darkTokens, lightTokens, soliDarkTokens, soliLightTokens } from '@/plugins/vuetify/tokens'
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

export const soliLightTheme: ThemeDefinition = {
  dark: false,
  colors: buildColors(soliLightTokens.color.semantic),
  variables: buildVariables(
    soliLightTokens.color.semantic,
    darkTokens.radius,
    darkTokens.typography,
    darkTokens.transition,
  ),
}

export const soliDarkTheme: ThemeDefinition = {
  dark: true,
  colors: buildColors(soliDarkTokens.color.semantic),
  variables: buildVariables(
    soliDarkTokens.color.semantic,
    darkTokens.radius,
    darkTokens.typography,
    darkTokens.transition,
  ),
}
