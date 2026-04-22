import type { RadiusTokens } from '../types';

export const radiusTokens = {
  none:  '0px',
  xs:    '0.125rem',
  sm:    '0.25rem',
  base:  '0.375rem',
  md:    '0.5rem',
  lg:    '0.75rem',
  xl:    '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full:  '9999px',
} as const satisfies RadiusTokens;