'use client';

import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e5f4ff',
      '#cde4ff',
      '#9ac6ff',
      '#64a6ff',
      '#3a8cfe',
      '#1f7bfe',
      '#007AFF', // Apple blue
      '#006adb',
      '#005cc4',
      '#004dac',
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '600',
  },
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },
  defaultRadius: 'md',
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  other: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
});
