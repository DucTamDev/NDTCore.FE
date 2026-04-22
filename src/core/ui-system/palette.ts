import colors from 'tailwindcss/colors';
import type { TailwindPalette } from './types';

export const slate   = colors.slate;
export const gray    = colors.gray;
export const zinc    = colors.zinc;
export const neutral = colors.neutral;
export const stone   = colors.stone;

export const red     = colors.red;
export const orange  = colors.orange;
export const amber   = colors.amber;
export const yellow  = colors.yellow;
export const lime    = colors.lime;
export const green   = colors.green;
export const emerald = colors.emerald;
export const teal    = colors.teal;
export const cyan    = colors.cyan;
export const sky     = colors.sky;
export const blue    = colors.blue;
export const indigo  = colors.indigo;
export const violet  = colors.violet;
export const purple  = colors.purple;
export const fuchsia = colors.fuchsia;
export const pink    = colors.pink;
export const rose    = colors.rose;

export const white       = colors.white;
export const black       = colors.black;
export const transparent = colors.transparent;

export const palette = {
  slate, gray, zinc, neutral, stone,
  red, orange, amber, yellow, lime,
  green, emerald, teal, cyan, sky,
  blue, indigo, violet, purple, fuchsia,
  pink, rose,
} as const satisfies TailwindPalette;

export type PaletteName = keyof typeof palette;