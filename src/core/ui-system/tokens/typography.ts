import type { TypographyTokens } from '../types';

const fontFamily = {
  sans:    '"Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
  serif:   '"Playfair Display", "Georgia", ui-serif, serif',
  mono:    '"JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace',
  display: '"Sora", "Inter Variable", ui-sans-serif, sans-serif',
} as const;

const fontSize = {
  xs:   { size: '0.75rem',  lineHeight: '1rem',    letterSpacing:  '0.025em'  },
  sm:   { size: '0.875rem', lineHeight: '1.25rem', letterSpacing:  '0.01em'   },
  base: { size: '1rem',     lineHeight: '1.5rem',  letterSpacing:  '0em'      },
  lg:   { size: '1.125rem', lineHeight: '1.75rem', letterSpacing: '-0.005em'  },
  xl:   { size: '1.25rem',  lineHeight: '1.75rem', letterSpacing: '-0.01em'   },
  '2xl':{ size: '1.5rem',   lineHeight: '2rem',    letterSpacing: '-0.015em'  },
  '3xl':{ size: '1.875rem', lineHeight: '2.25rem', letterSpacing: '-0.02em'   },
  '4xl':{ size: '2.25rem',  lineHeight: '2.5rem',  letterSpacing: '-0.025em'  },
  '5xl':{ size: '3rem',     lineHeight: '1.1',     letterSpacing: '-0.03em'   },
  '6xl':{ size: '3.75rem',  lineHeight: '1.05',    letterSpacing: '-0.035em'  },
  '7xl':{ size: '4.5rem',   lineHeight: '1',       letterSpacing: '-0.04em'   },
  '8xl':{ size: '6rem',     lineHeight: '1',       letterSpacing: '-0.045em'  },
  '9xl':{ size: '8rem',     lineHeight: '1',       letterSpacing: '-0.05em'   },
} as const;

const fontWeight = {
  thin:       '100',
  extralight: '200',
  light:      '300',
  normal:     '400',
  medium:     '500',
  semibold:   '600',
  bold:       '700',
  extrabold:  '800',
  black:      '900',
} as const;

const lineHeight = {
  none:    '1',
  tight:   '1.25',
  snug:    '1.375',
  normal:  '1.5',
  relaxed: '1.625',
  loose:   '2',
} as const;

const letterSpacing = {
  tighter: '-0.05em',
  tight:   '-0.025em',
  normal:   '0em',
  wide:     '0.025em',
  wider:    '0.05em',
  widest:   '0.1em',
} as const;

export const typographyTokens = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} as const satisfies TypographyTokens;