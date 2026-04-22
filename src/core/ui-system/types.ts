export interface ColorScale {
  readonly 50: string;
  readonly 100: string;
  readonly 200: string;
  readonly 300: string;
  readonly 400: string;
  readonly 500: string;
  readonly 600: string;
  readonly 700: string;
  readonly 800: string;
  readonly 900: string;
  readonly 950: string;
}

export type TailwindPalette = Record<string, ColorScale>;

export interface SemanticColorRole {
  readonly primary: string;
  readonly primaryHover: string;
  readonly primaryActive: string;
  readonly primarySubtle: string;
  readonly onPrimary: string;

  readonly secondary: string;
  readonly secondaryHover: string;
  readonly secondaryActive: string;
  readonly secondarySubtle: string;
  readonly onSecondary: string;

  readonly accent: string;
  readonly accentHover: string;
  readonly accentActive: string;
  readonly accentSubtle: string;
  readonly onAccent: string;

  readonly success: string;
  readonly successSubtle: string;
  readonly onSuccess: string;

  readonly warning: string;
  readonly warningSubtle: string;
  readonly onWarning: string;

  readonly error: string;
  readonly errorSubtle: string;
  readonly onError: string;

  readonly info: string;
  readonly infoSubtle: string;
  readonly onInfo: string;

  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated: string;
  readonly surfaceOverlay: string;

  readonly border: string;
  readonly borderSubtle: string;
  readonly borderStrong: string;
  readonly borderFocus: string;

  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textTertiary: string;
  readonly textDisabled: string;
  readonly textInverse: string;
  readonly textLink: string;
  readonly textLinkHover: string;
}

export interface ColorTokens {
  readonly semantic: SemanticColorRole;
}

export interface SpacingTokens {
  readonly 0: string;
  readonly px: string;
  readonly 0.5: string;
  readonly 1: string;
  readonly 1.5: string;
  readonly 2: string;
  readonly 2.5: string;
  readonly 3: string;
  readonly 3.5: string;
  readonly 4: string;
  readonly 5: string;
  readonly 6: string;
  readonly 7: string;
  readonly 8: string;
  readonly 9: string;
  readonly 10: string;
  readonly 11: string;
  readonly 12: string;
  readonly 14: string;
  readonly 16: string;
  readonly 20: string;
  readonly 24: string;
  readonly 28: string;
  readonly 32: string;
  readonly 36: string;
  readonly 40: string;
  readonly 44: string;
  readonly 48: string;
  readonly 52: string;
  readonly 56: string;
  readonly 60: string;
  readonly 64: string;
  readonly 72: string;
  readonly 80: string;
  readonly 96: string;
}

export interface FontFamilyTokens {
  readonly sans: string;
  readonly serif: string;
  readonly mono: string;
  readonly display: string;
}

export interface FontSizeStep {
  readonly size: string;
  readonly lineHeight: string;
  readonly letterSpacing: string;
}

export interface FontSizeTokens {
  readonly xs: FontSizeStep;
  readonly sm: FontSizeStep;
  readonly base: FontSizeStep;
  readonly lg: FontSizeStep;
  readonly xl: FontSizeStep;
  readonly '2xl': FontSizeStep;
  readonly '3xl': FontSizeStep;
  readonly '4xl': FontSizeStep;
  readonly '5xl': FontSizeStep;
  readonly '6xl': FontSizeStep;
  readonly '7xl': FontSizeStep;
  readonly '8xl': FontSizeStep;
  readonly '9xl': FontSizeStep;
}

export interface FontWeightTokens {
  readonly thin: string;
  readonly extralight: string;
  readonly light: string;
  readonly normal: string;
  readonly medium: string;
  readonly semibold: string;
  readonly bold: string;
  readonly extrabold: string;
  readonly black: string;
}

export interface LineHeightTokens {
  readonly none: string;
  readonly tight: string;
  readonly snug: string;
  readonly normal: string;
  readonly relaxed: string;
  readonly loose: string;
}

export interface LetterSpacingTokens {
  readonly tighter: string;
  readonly tight: string;
  readonly normal: string;
  readonly wide: string;
  readonly wider: string;
  readonly widest: string;
}

export interface TypographyTokens {
  readonly fontFamily: FontFamilyTokens;
  readonly fontSize: FontSizeTokens;
  readonly fontWeight: FontWeightTokens;
  readonly lineHeight: LineHeightTokens;
  readonly letterSpacing: LetterSpacingTokens;
}

export interface RadiusTokens {
  readonly none: string;
  readonly xs: string;
  readonly sm: string;
  readonly base: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly '2xl': string;
  readonly '3xl': string;
  readonly full: string;
}

export interface ShadowTokens {
  readonly none: string;
  readonly xs: string;
  readonly sm: string;
  readonly base: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly '2xl': string;
  readonly inner: string;
  readonly innerMd: string;
}

export interface ZIndexTokens {
  readonly hide: number;
  readonly base: number;
  readonly raised: number;
  readonly dropdown: number;
  readonly sticky: number;
  readonly overlay: number;
  readonly modal: number;
  readonly popover: number;
  readonly toast: number;
  readonly tooltip: number;
}

export interface BreakpointTokens {
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly '2xl': string;
}

export interface TransitionDurationTokens {
  readonly instant: string;
  readonly fast: string;
  readonly base: string;
  readonly slow: string;
  readonly slower: string;
  readonly slowest: string;
}

export interface TransitionEasingTokens {
  readonly linear: string;
  readonly easeIn: string;
  readonly easeOut: string;
  readonly easeInOut: string;
  readonly spring: string;
  readonly bounce: string;
}

export interface TransitionTokens {
  readonly duration: TransitionDurationTokens;
  readonly easing: TransitionEasingTokens;
}

export interface ThemeTokens {
  readonly color: ColorTokens;
  readonly spacing: SpacingTokens;
  readonly typography: TypographyTokens;
  readonly radius: RadiusTokens;
  readonly shadow: ShadowTokens;
  readonly zIndex: ZIndexTokens;
  readonly breakpoint: BreakpointTokens;
  readonly transition: TransitionTokens;
}