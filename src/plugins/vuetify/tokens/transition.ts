import type { TransitionTokens } from '../types';

const duration = {
  instant: '50ms',
  fast:    '100ms',
  base:    '200ms',
  slow:    '300ms',
  slower:  '500ms',
  slowest: '700ms',
} as const;

const easing = {
  linear:    'linear',
  easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
  easeOut:   'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring:    'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce:    'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const transitionTokens = { duration, easing } as const satisfies TransitionTokens;