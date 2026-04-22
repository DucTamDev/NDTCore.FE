// themes.ts
import type { ThemeDefinition } from 'vuetify'
import { lightTokens, darkTokens, soliLightTokens, soliDarkTokens } from '@/core/ui-system/tokens'
import { buildColors } from './build-colors'
import { buildVariables } from './build-variables'

const { radius, typography, transition } = lightTokens

export const lightTheme: ThemeDefinition = {
    dark: false,
    colors: buildColors(lightTokens.color.semantic),
    variables: buildVariables(lightTokens.color.semantic, radius, typography, transition),
}

export const darkTheme: ThemeDefinition = {
    dark: true,
    colors: buildColors(darkTokens.color.semantic),
    variables: buildVariables(darkTokens.color.semantic, radius, typography, transition),
}

export const soliLightTheme: ThemeDefinition = {
    dark: false,
    colors: buildColors(soliLightTokens.color.semantic),
    variables: buildVariables(soliLightTokens.color.semantic, radius, typography, transition),
}

export const soliDarkTheme: ThemeDefinition = {
    dark: true,
    colors: buildColors(soliDarkTokens.color.semantic),
    variables: buildVariables(soliDarkTokens.color.semantic, radius, typography, transition),
}
