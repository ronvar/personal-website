'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMantineColorScheme, Switch } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useDevMode } from './DevModeContext';

const useStyles = createStyles(() => ({
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'var(--paper)',
    borderBottom: '1px solid var(--rule)',
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    height: 'var(--nav-h)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    fontFamily: 'var(--font-sans)',
    fontStretch: '125%',
    fontWeight: 800,
    fontSize: '1rem',
    letterSpacing: '-0.01em',
    color: 'var(--ink)',
    whiteSpace: 'nowrap',
  },
  devToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'var(--ink-3)',
    cursor: 'pointer',
  },
  devLabel: {
    '@media (max-width: 479px)': {
      display: 'none',
    },
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    listStyle: 'none',
  },
  desktopLinks: {
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
  mobileLinks: {
    display: 'none',
    '@media (max-width: 767px)': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '0 12px',
      padding: '0 0 4px',
    },
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
    color: 'var(--ink-2)',
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    '&:hover': {
      color: 'var(--ink)',
    },
  },
  linkActive: {
    color: 'var(--ink)',
    borderBottomColor: 'var(--accent)',
  },
  themeToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 'var(--radius)',
    color: 'var(--ink)',
    '&:hover': {
      backgroundColor: 'var(--paper-2)',
    },
  },
}));

const navItems = [
  { label: 'work', href: '#work', devLabel: '/work' },
  { label: 'experience', href: '#experience', devLabel: '/experience' },
  { label: 'about', href: '#about', devLabel: '/about' },
  { label: 'skills', href: '#skills', devLabel: '/skills' },
  { label: 'contact', href: '#contact', devLabel: '/contact' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { devMode, setDevMode } = useDevMode();
  const { classes, cx } = useStyles();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 120;
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          current = section;
        }
      }
      // The contact section is short, so treat the bottom of the page as contact.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = 'contact';
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDevModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDevMode(e.currentTarget.checked);
  }, [setDevMode]);

  const handleColorSchemeToggle = useCallback(() => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme, setColorScheme]);

  const renderLinks = (className: string) => (
    <ul className={cx(classes.links, className)}>
      {navItems.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className={cx(
              'mono',
              classes.link,
              activeSection === item.href.substring(1) && classes.linkActive
            )}
            aria-current={activeSection === item.href.substring(1) ? 'location' : undefined}
          >
            {devMode ? item.devLabel : item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className={classes.nav} aria-label="Main">
      <div className="wrap">
        <div className={classes.bar}>
          <div className={classes.left}>
            <a href="#top" className={classes.logo}>
              {devMode ? '>_ ronald' : 'Ronald Vargas'}
            </a>

            <Switch
              size="xs"
              checked={devMode}
              onChange={handleDevModeChange}
              color="var(--accent)"
              label="dev mode"
              labelPosition="left"
              aria-label="Developer mode"
              classNames={{ root: classes.devToggle, label: cx('mono', classes.devLabel) }}
              styles={{
                label: { color: 'var(--ink-3)', paddingInlineEnd: 8 },
                thumb: { backgroundColor: devMode ? '#000' : undefined },
              }}
            />
          </div>

          <div className={classes.right}>
            {renderLinks(classes.desktopLinks)}
            <button
              type="button"
              onClick={handleColorSchemeToggle}
              aria-label={colorScheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={classes.themeToggle}
            >
              {colorScheme === 'dark' ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
            </button>
          </div>
        </div>

        {renderLinks(classes.mobileLinks)}
      </div>
    </nav>
  );
}
