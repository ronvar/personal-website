'use client';

import { createTheme, rem } from '@mantine/core';

// Values mirror the tokens in globals.css; see DESIGN.md.
export const theme = createTheme({
  primaryColor: 'signal',
  primaryShade: { light: 6, dark: 4 },
  colors: {
    signal: [
      '#fff3eb',
      '#ffe2cf',
      '#fdc29d',
      '#f9a067',
      '#f2772e',
      '#e05d17',
      '#c2410c', // accent
      '#a3370a',
      '#842d09',
      '#652307',
    ],
  },
  fontFamily: 'var(--font-sans)',
  fontFamilyMonospace: 'var(--font-mono)',
  headings: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '800',
  },
  radius: {
    xs: rem(2),
    sm: rem(2),
    md: rem(2),
    lg: rem(2),
    xl: rem(2),
  },
  defaultRadius: 'xs',
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
});
