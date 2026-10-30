'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Tooltip } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { useDevMode } from './DevModeContext';
import { BackgroundAnimation } from './BackgroundAnimation';
import { ContactButton } from './ContactButton';

const useStyles = createStyles(() => ({
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: 'calc(var(--nav-h) + 40px) 0 40px',
    '@media (max-width: 767px)': {
      // The phone nav adds a second row of links.
      paddingTop: 'calc(var(--nav-h) + 88px)',
    },
  },
  grid: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
    gap: 64,
    alignItems: 'end',
    '@media (max-width: 899px) and (min-width: 768px)': {
      gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
      gap: 32,
    },
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
      gap: 28,
    },
  },
  name: {
    margin: '16px 0 20px',
    cursor: 'default',
    userSelect: 'none',
    '@media (max-width: 767px)': {
      fontSize: 'clamp(3rem, 11vw, 4.5rem)',
      margin: '12px 0 16px',
    },
  },
  summary: {
    maxWidth: '52ch',
    color: 'var(--ink-2)',
    marginTop: 12,
  },
  actions: {
    marginTop: 24,
  },
  secondary: {
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
  proof: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 24,
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& dd': {
      order: -1,
      fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
      lineHeight: 1.2,
      color: 'var(--accent)',
      marginBottom: 8,
      fontVariantNumeric: 'tabular-nums',
    },
    '& dt': {
      color: 'var(--ink-2)',
      fontSize: '0.9375rem',
      lineHeight: 1.4,
    },
    '& small': {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      color: 'var(--ink-3)',
      fontSize: '0.75rem',
      marginTop: 4,
    },
  },
  spec: {
    borderTop: '1px solid var(--rule-strong)',
    '& > div': {
      display: 'grid',
      gridTemplateColumns: '96px minmax(0, 1fr)',
      gap: 16,
      padding: '12px 0',
      borderBottom: '1px solid var(--rule)',
      '@media (max-width: 767px)': {
        gridTemplateColumns: '80px minmax(0, 1fr)',
      },
    },
    '& dt': {
      color: 'var(--ink-3)',
    },
    '& dd': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px 16px',
    },
  },
  toolbox: {
    '@media (max-width: 767px)': {
      display: 'none !important',
    },
  },
}));

const proof = [
  { value: '>40%', label: 'Frontend performance gain', source: 'BP.fun / engineering' },
  { value: '3,000+', label: 'Monthly users on dashboards I built', source: 'Mentaport / engineering' },
];

export function Hero() {
  const [, setClickCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { devMode } = useDevMode();
  const { classes, cx } = useStyles();

  const handleNameClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      if (newCount >= 3) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
        return 0;
      }

      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 500);

      return newCount;
    });
  };

  return (
    <section id="top" className={classes.hero} aria-labelledby="hero-title">
      {devMode && <BackgroundAnimation />}
      <div className={cx('wrap', classes.grid)}>
        <div>
          <p className="label">
            <strong>{devMode ? '$ whoami' : 'Software engineer'}</strong> / IT support &amp; consulting
          </p>

          <Tooltip
            label="Nice, you found one of my easter eggs!"
            opened={showTooltip}
            position="bottom-start"
            withArrow
            transitionProps={{ transition: 'pop', duration: 200 }}
          >
            <h1 id="hero-title" className={cx('display', classes.name)} onClick={handleNameClick}>
              Ronald<br />Vargas
            </h1>
          </Tooltip>

          <p className="lead">I build software and help people use it.</p>
          <p className={classes.summary}>
            6+ years shipping web products, troubleshooting systems, and
            supporting the teams behind them.
          </p>

          <div className={cx('actions', classes.actions)}>
            <ContactButton className="btn btn-primary">Get in touch</ContactButton>
            <a href="#work" className={cx('btn btn-secondary', classes.secondary)}>See the work</a>
            <Link href="/resume" className="link mono quiet-button">View résumé</Link>
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <dl className={classes.proof} aria-label="Engineering results">
            {proof.map((item) => (
              <div key={item.value}>
                <dt>
                  {item.label}
                  <small>{item.source}</small>
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <dl className={cx('mono', classes.spec)}>
            <div>
              <dt>now</dt>
              <dd>Technical consultant at Handl Health</dd>
            </div>
            <div className={classes.toolbox}>
              <dt>builds with</dt>
              <dd>React, Next.js, TypeScript, Node.js, AWS</dd>
            </div>
            <div className={classes.toolbox}>
              <dt>supports</dt>
              <dd>macOS, Windows, Jamf, Google Workspace, networks</dd>
            </div>
            <div>
              <dt>elsewhere</dt>
              <dd>
                <a className="link" href="https://github.com/ronvar" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                <a className="link" href="https://linkedin.com/in/rvar" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
