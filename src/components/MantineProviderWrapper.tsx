'use client';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { MantineEmotionProvider } from '@mantine/emotion';
import { theme } from '@/theme/theme';
import '@mantine/core/styles.css';

export function MantineProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineEmotionProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </MantineEmotionProvider>
  );
}

export { ColorSchemeScript };
