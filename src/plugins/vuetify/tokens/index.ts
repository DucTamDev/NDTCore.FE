import { lightColorTokens, darkColorTokens } from './color'
import { spacingTokens } from './spacing'
import { typographyTokens } from './typography'
import { radiusTokens } from './radius'
import { shadowTokens } from './shadow'
import { zIndexTokens } from './z-index'
import { breakpointTokens } from './breakpoint'
import { transitionTokens } from './transition'
import type { ColorTokens, ThemeTokens } from '../types'
import { soliDarkColorTokens, soliLightColorTokens } from './themes/soli'

const base = {
    spacing: spacingTokens,
    typography: typographyTokens,
    radius: radiusTokens,
    shadow: shadowTokens,
    zIndex: zIndexTokens,
    breakpoint: breakpointTokens,
    transition: transitionTokens,
}

export const baseTokens = base

export const lightTokens = createTheme(lightColorTokens)
export const darkTokens = createTheme(darkColorTokens)
export const soliLightTokens = createTheme(soliLightColorTokens)
export const soliDarkTokens = createTheme(soliDarkColorTokens)

function createTheme(colorTokens: ColorTokens): ThemeTokens {
    return {
        color: colorTokens,
        ...base,
    }
}
