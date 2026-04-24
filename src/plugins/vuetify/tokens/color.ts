import {
  indigo, slate, violet, emerald,
  amber, red, sky, gray, zinc, white, green
} from '../palette';
import type { ColorTokens } from '../types';

export const lightColorTokens = {
  semantic: {
    primary:        indigo[600],
    primaryHover:   indigo[700],
    primaryActive:  indigo[800],
    primarySubtle:  indigo[50],
    onPrimary:      white,

    secondary:        slate[600],
    secondaryHover:   slate[700],
    secondaryActive:  slate[800],
    secondarySubtle:  slate[50],
    onSecondary:      white,

    accent:        violet[500],
    accentHover:   violet[600],
    accentActive:  violet[700],
    accentSubtle:  violet[50],
    onAccent:      white,

    success:        emerald[600],
    successSubtle:  emerald[50],
    onSuccess:      white,

    warning:        amber[500],
    warningSubtle:  amber[50],
    onWarning:      amber[950],

    error:        red[600],
    errorSubtle:  red[50],
    onError:      white,

    info:        sky[600],
    infoSubtle:  sky[50],
    onInfo:      white,

    background:      gray[50],
    surface:         white,
    surfaceElevated: white,
    surfaceOverlay:  gray[900],

    border:       gray[200],
    borderSubtle: gray[100],
    borderStrong: gray[400],
    borderFocus:  indigo[500],

    textPrimary:   gray[900],
    textSecondary: gray[600],
    textTertiary:  gray[400],
    textDisabled:  gray[300],
    textInverse:   white,
    textLink:      indigo[600],
    textLinkHover: indigo[800],
  },
} as const satisfies ColorTokens;

export const darkColorTokens = {
  semantic: {
    primary:        indigo[400],
    primaryHover:   indigo[300],
    primaryActive:  indigo[200],
    primarySubtle:  indigo[950],
    onPrimary:      indigo[950],

    secondary:        slate[400],
    secondaryHover:   slate[300],
    secondaryActive:  slate[200],
    secondarySubtle:  slate[900],
    onSecondary:      slate[950],

    accent:        violet[400],
    accentHover:   violet[300],
    accentActive:  violet[200],
    accentSubtle:  violet[950],
    onAccent:      violet[950],

    success:        emerald[400],
    successSubtle:  emerald[950],
    onSuccess:      emerald[950],

    warning:        amber[400],
    warningSubtle:  amber[950],
    onWarning:      amber[950],

    error:        red[400],
    errorSubtle:  red[950],
    onError:      red[950],

    info:        sky[400],
    infoSubtle:  sky[950],
    onInfo:      sky[950],

    background:      zinc[950],
    surface:         zinc[900],
    surfaceElevated: zinc[800],
    surfaceOverlay:  zinc[950],

    border:       zinc[700],
    borderSubtle: zinc[800],
    borderStrong: zinc[500],
    borderFocus:  indigo[400],

    textPrimary:   gray[50],
    textSecondary: gray[400],
    textTertiary:  gray[500],
    textDisabled:  gray[700],
    textInverse:   gray[900],
    textLink:      indigo[400],
    textLinkHover: indigo[300],
  },
} as const satisfies ColorTokens;