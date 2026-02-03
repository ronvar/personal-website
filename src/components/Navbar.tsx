'use client';

import { useState, useEffect, useCallback } from 'react';
import { Group, Box, UnstyledButton, useMantineColorScheme, ActionIcon, Switch, Text } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { createStyles } from '@mantine/emotion';
import { IconSun, IconMoon, IconTerminal2 } from '@tabler/icons-react';
import { useDevMode } from './DevModeContext';

interface StyleParams {
  devMode: boolean;
  isScrolled: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
}

const useStyles = createStyles((_, { devMode, isScrolled, colorScheme }: StyleParams) => ({
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '12px 24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: isScrolled || devMode ? 'blur(7px) saturate(180%)' : 'none',
    WebkitBackdropFilter: isScrolled || devMode ? 'blur(7px) saturate(180%)' : 'none',
    backgroundColor: devMode
      ? 'rgba(0, 20, 0, 0.9)'
      : isScrolled
        ? colorScheme === 'dark'
          ? 'rgba(0, 0, 0, 0.72)'
          : 'rgba(255, 255, 255, 0.72)'
        : 'transparent',
    borderBottom: isScrolled || devMode
      ? `1px solid ${devMode ? '#00ff00' : 'var(--gray-200)'}`
      : '1px solid transparent',
  },
  logo: {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: devMode ? '#00ff00' : 'var(--foreground)',
    fontFamily: devMode ? 'monospace' : 'inherit',
  },
  devToggleGroup: {
    padding: '4px 10px',
    borderRadius: '16px',
    backgroundColor: devMode ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
    border: devMode ? '1px solid rgba(0, 255, 0, 0.3)' : '1px solid transparent',
    transition: 'all 0.2s ease',
  },
  devIcon: {
    color: devMode ? '#00ff00' : 'var(--gray-400)',
    transition: 'color 0.2s ease',
  },
  devLabel: {
    color: devMode ? '#00ff00' : 'var(--gray-500)',
    fontFamily: 'monospace',
    transition: 'color 0.2s ease',
  },
  navItem: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 500,
    fontFamily: devMode ? 'monospace' : 'inherit',
    transition: 'all 0.2s ease',
  },
  navItemActive: {
    color: devMode ? '#00ff00' : 'var(--apple-blue)',
    backgroundColor: devMode
      ? 'rgba(0, 255, 0, 0.15)'
      : colorScheme === 'dark'
        ? 'rgba(0, 122, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
  },
  navItemInactive: {
    color: devMode ? 'rgba(0, 255, 0, 0.6)' : 'var(--foreground)',
    backgroundColor: 'transparent',
  },
  colorSchemeToggle: {
    marginLeft: '8px',
    color: devMode ? '#00ff00' : undefined,
  },
}));

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
];

export function Navbar() {
  const [scroll] = useWindowScroll();
  const [activeSection, setActiveSection] = useState('about');
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { devMode, setDevMode } = useDevMode();
  const isScrolled = scroll.y > 50;

  const { classes, cx } = useStyles({ devMode, isScrolled, colorScheme });

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleDevModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDevMode(e.currentTarget.checked);
  }, [setDevMode]);

  const handleColorSchemeToggle = useCallback(() => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme, setColorScheme]);

  return (
    <Box component="nav" className={classes.nav}>
      <Group justify="space-between" maw={1200} mx="auto">
        <Group gap="md">
          <UnstyledButton
            onClick={() => handleNavClick('#about')}
            className={classes.logo}
          >
            {devMode ? '>_RV' : 'RV'}
          </UnstyledButton>

          {/* Developer Mode Toggle */}
          <Group gap={6} className={classes.devToggleGroup}>
            <IconTerminal2 size={16} className={classes.devIcon} />
            <Text size="xs" fw={500} className={classes.devLabel}>
              dev
            </Text>
            <Switch
              size="xs"
              checked={devMode}
              onChange={handleDevModeChange}
              styles={{
                track: {
                  backgroundColor: devMode ? '#00ff00' : undefined,
                  borderColor: devMode ? '#00ff00' : undefined,
                },
                thumb: {
                  backgroundColor: devMode ? '#000' : undefined,
                },
              }}
            />
          </Group>
        </Group>

        <Group gap="xs">
          {navItems.map((item) => (
            <UnstyledButton
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cx(
                classes.navItem,
                activeSection === item.href.substring(1)
                  ? classes.navItemActive
                  : classes.navItemInactive
              )}
            >
              {devMode ? `/${item.label.toLowerCase()}` : item.label}
            </UnstyledButton>
          ))}

          <ActionIcon
            variant="subtle"
            size="lg"
            radius="xl"
            onClick={handleColorSchemeToggle}
            aria-label="Toggle color scheme"
            className={classes.colorSchemeToggle}
          >
            {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}
