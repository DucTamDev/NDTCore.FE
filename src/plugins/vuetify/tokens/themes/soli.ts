
import {
  emerald, teal, lime,
  slate, zinc, gray, white,
  amber, red, sky, green
} from '../../palette';
import type { ColorTokens } from '../../types';

// ─── LIGHT ────────────────────────────────────────────────────────────────────
export const soliLightColorTokens = {
  semantic: {
    // Primary — Emerald: tươi mát, đặc trưng trà xanh
    primary:        emerald[600],
    primaryHover:   emerald[700],
    primaryActive:  emerald[800],
    primarySubtle:  emerald[50],
    onPrimary:      white,

    // Secondary — Slate: trung tính, dùng cho các action phụ
    secondary:        slate[500],
    secondaryHover:   slate[600],
    secondaryActive:  slate[700],
    secondarySubtle:  slate[50],
    onSecondary:      white,

    // Accent — Teal: bổ trợ xanh lá, dùng cho highlight / badge
    accent:        teal[500],
    accentHover:   teal[600],
    accentActive:  teal[700],
    accentSubtle:  teal[50],
    onAccent:      white,

    // Semantic states
    success:        green[600],
    successSubtle:  green[50],
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

    // Surface — nền trắng xanh nhạt, gợi cảm giác trong lành
    background:      emerald[50],
    surface:         white,
    surfaceElevated: white,
    surfaceOverlay:  gray[900],

    // Border
    border:       emerald[200],
    borderSubtle: emerald[100],
    borderStrong: emerald[400],
    borderFocus:  emerald[500],

    // Text
    textPrimary:   gray[900],
    textSecondary: gray[600],
    textTertiary:  gray[400],
    textDisabled:  gray[300],
    textInverse:   white,
    textLink:      emerald[700],
    textLinkHover: emerald[900],
  },
} as const satisfies ColorTokens;

// ─── DARK ─────────────────────────────────────────────────────────────────────
export const soliDarkColorTokens = {
  semantic: {
    primary:        emerald[400],
    primaryHover:   emerald[300],
    primaryActive:  emerald[200],
    primarySubtle:  emerald[950],
    onPrimary:      emerald[950],

    secondary:        slate[400],
    secondaryHover:   slate[300],
    secondaryActive:  slate[200],
    secondarySubtle:  slate[900],
    onSecondary:      slate[950],

    accent:        teal[400],
    accentHover:   teal[300],
    accentActive:  teal[200],
    accentSubtle:  teal[950],
    onAccent:      teal[950],

    success:        green[400],
    successSubtle:  green[950],
    onSuccess:      green[950],

    warning:        amber[400],
    warningSubtle:  amber[950],
    onWarning:      amber[950],

    error:        red[400],
    errorSubtle:  red[950],
    onError:      red[950],

    info:        sky[400],
    infoSubtle:  sky[950],
    onInfo:      sky[950],

    // Surface — dark mode lấy zinc nhưng thoáng màu emerald ở nền tổng
    background:      zinc[950],
    surface:         zinc[900],
    surfaceElevated: zinc[800],
    surfaceOverlay:  zinc[950],

    border:       emerald[800],
    borderSubtle: zinc[800],
    borderStrong: emerald[600],
    borderFocus:  emerald[400],

    textPrimary:   gray[50],
    textSecondary: gray[400],
    textTertiary:  gray[500],
    textDisabled:  gray[700],
    textInverse:   gray[900],
    textLink:      emerald[400],
    textLinkHover: emerald[300],
  },
} as const satisfies ColorTokens;