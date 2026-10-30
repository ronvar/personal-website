'use client';

import { createStyles } from '@mantine/emotion';
import { ContactButton } from './ContactButton';
import { SectionHead } from './SectionHead';
import { useDevMode } from './DevModeContext';

const useStyles = createStyles(() => ({
  section: {
    paddingBottom: 40,
  },
  colophon: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 72,
    paddingTop: 16,
    borderTop: '1px solid var(--rule)',
    '@media (max-width: 767px)': {
      marginTop: 64,
    },
  },
}));

export function Contact() {
  const { classes, cx } = useStyles();
  const { devMode } = useDevMode();

  return (
    <footer id="contact" className={cx('section', classes.section)} aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead
          index="05"
          name="contact"
          id="contact-title"
          title="Something to build or fix?"
          lead="Send me a note about a role, a project, or a problem you're stuck on. I reply by email."
        />

        <div className="split">
          <span aria-hidden="true" />
          <div className="actions">
            <ContactButton className="btn btn-primary">Write to me</ContactButton>
            <a className="link mono" href="https://linkedin.com/in/rvar" target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a className="link mono" href="https://github.com/ronvar" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>

        <div className={cx('tags', classes.colophon)}>
          <span>© {new Date().getFullYear()} Ronald Vargas</span>
          <span>
            {devMode ? 'exit dev mode from the switch up top' : 'Software, systems, and the people who use them.'}
          </span>
        </div>
      </div>
    </footer>
  );
}
