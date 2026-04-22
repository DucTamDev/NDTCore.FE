import type { ShadowTokens } from '../types';

// gray-900 hex — hardcoded intentionally: oklch không dùng được trong box-shadow alpha syntax
const base = '#111827';

export const shadowTokens = {
  none:    'none',
  xs:      `0 1px 2px 0 ${base}0d`,
  sm:      `0 1px 3px 0 ${base}1a, 0 1px 2px -1px ${base}1a`,
  base:    `0 4px 6px -1px ${base}1a, 0 2px 4px -2px ${base}1a`,
  md:      `0 10px 15px -3px ${base}1a, 0 4px 6px -4px ${base}1a`,
  lg:      `0 20px 25px -5px ${base}1a, 0 8px 10px -6px ${base}1a`,
  xl:      `0 25px 50px -12px ${base}40`,
  '2xl':   `0 50px 100px -20px ${base}4d`,
  inner:   `inset 0 2px 4px 0 ${base}0d`,
  innerMd: `inset 0 4px 8px 0 ${base}1a`,
} as const satisfies ShadowTokens;