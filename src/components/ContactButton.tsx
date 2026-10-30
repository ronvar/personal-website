'use client';

import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert, Box, Button, Group, Loader, Modal, Stack,
  Text, Textarea, TextInput, useComputedColorScheme,
} from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { useDevMode } from './DevModeContext';
import { TurnstileWidget } from './TurnstileWidget';

const LINKEDIN_URL = 'https://linkedin.com/in/rvar';

const useStyles = createStyles(() => ({
  content: {
    minHeight: 'auto',
    padding: 0,
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--rule-strong)',
    borderRadius: 'var(--radius)',
  },
  header: {
    backgroundColor: 'var(--paper)',
    borderBottom: '1px solid var(--rule)',
    marginBottom: 24,
  },
  title: {
    color: 'var(--ink)',
    fontSize: '1.75rem',
    fontWeight: 800,
    fontStretch: '125%',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  close: {
    color: 'var(--ink)',
  },
  input: {
    backgroundColor: 'var(--paper-2)',
    borderColor: 'var(--rule)',
    borderRadius: 'var(--radius)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    '&:focus': {
      borderColor: 'var(--accent)',
    },
  },
  label: {
    color: 'var(--ink-3)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8125rem',
    fontWeight: 400,
    marginBottom: 6,
  },
  honeypot: {
    position: 'absolute',
    left: '-10000px',
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
}));

// Mantine Button themed to the primary button tokens, so it keeps its loading state.
const submitStyle = {
  '--button-bg': 'var(--accent)',
  '--button-hover': 'var(--accent)',
  '--button-color': 'var(--accent-ink)',
  height: 48,
} as React.CSSProperties;

interface ContactFormProps {
  devMode: boolean;
  onClose: () => void;
  onBusyChange: (busy: boolean) => void;
}

function ContactForm({ devMode, onClose, onBusyChange }: ContactFormProps) {
  const { classes } = useStyles();
  const colorScheme = useComputedColorScheme('light');
  const [config, setConfig] = useState<{ available: boolean; siteKey: string | null } | null>(null);
  const [token, setToken] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const [verificationKey, setVerificationKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const sendingRef = useRef(false);
  const hintColor = 'var(--ink-2)';

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/contact', { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Contact unavailable');
        return response.json();
      })
      .then((result) => {
        if (!controller.signal.aborted) {
          setConfig({
            available: result.available === true && typeof result.siteKey === 'string',
            siteKey: typeof result.siteKey === 'string' ? result.siteKey : null,
          });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setConfig({ available: false, siteKey: null });
      });
    return () => controller.abort();
  }, []);

  const handleToken = useCallback((value: string) => {
    setToken(value);
    if (value) setVerificationError(false);
  }, []);

  const handleVerificationError = useCallback(() => {
    setToken('');
    setVerificationError(true);
  }, []);

  const retryVerification = () => {
    setToken('');
    setVerificationError(false);
    setVerificationKey((value) => value + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config?.available || !token || sendingRef.current) return;
    const fields = new FormData(event.currentTarget);
    sendingRef.current = true;
    setSending(true);
    onBusyChange(true);
    setError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.get('name'),
          email: fields.get('email'),
          message: fields.get('message'),
          website: fields.get('website'),
          turnstileToken: token,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setError(typeof result.error === 'string' ? result.error : 'Your message could not be sent. Please try again.');
        return;
      }
      setSent(true);
    } catch {
      setError('Your message could not be sent. Please try again or reach me on LinkedIn.');
    } finally {
      sendingRef.current = false;
      setSending(false);
      onBusyChange(false);
      retryVerification();
    }
  };

  if (sent) {
    return (
      <Stack align="flex-start" gap="lg" pb="md" role="status">
        <p className="label" style={{ color: 'var(--success)' }}>✓ message sent</p>
        <Box>
          <h3 className="h3" style={{ marginBottom: 8 }}>Thanks for reaching out.</h3>
          <Text c={hintColor}>Your message is on its way. I&apos;ll reply by email.</Text>
        </Box>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Back to the site
        </button>
      </Stack>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text c={hintColor} size="sm" style={{ lineHeight: 1.7 }}>
          Have a role, a project, or a technical challenge in mind? Send me a note.
        </Text>
        <TextInput
          name="name" label="Your name" placeholder="Alex Taylor" required
          minLength={2} maxLength={80} autoComplete="name" data-autofocus
          size="md" disabled={sending}
          classNames={{ input: classes.input, label: classes.label }}
        />
        <TextInput
          name="email" type="email" label="Your email" placeholder="alex@example.com" required
          maxLength={254} autoComplete="email" size="md" disabled={sending}
          classNames={{ input: classes.input, label: classes.label }}
        />
        <Textarea
          name="message" label="Your message" placeholder="Tell me a little about what you have in mind..."
          required minLength={10} maxLength={4000} rows={4} size="md" disabled={sending}
          classNames={{ input: classes.input, label: classes.label }}
        />
        <Box className={classes.honeypot} aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
        </Box>

        {!config && (
          <Group gap="xs" role="status">
            <Loader size="xs" color="var(--accent)" />
            <Text size="xs" c={hintColor}>Getting the form ready...</Text>
          </Group>
        )}
        {config?.available && config.siteKey && (
          <TurnstileWidget
            key={verificationKey}
            siteKey={config.siteKey}
            theme={devMode ? 'dark' : colorScheme}
            onToken={handleToken}
            onError={handleVerificationError}
          />
        )}
        {verificationError && (
          <Stack gap="xs" role="alert">
            <Text size="sm" c={hintColor}>Verification couldn&apos;t finish. Please try again.</Text>
            <button type="button" className="link mono" onClick={retryVerification} style={{ alignSelf: 'flex-start' }}>
              Retry verification
            </button>
          </Stack>
        )}
        {config && !config.available && (
          <Alert color="gray" variant="outline" styles={{ message: { color: 'var(--ink)' } }}>
            Messaging is temporarily unavailable. You can still{' '}
            <a className="link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              reach me on LinkedIn
            </a>.
          </Alert>
        )}
        {error && (
          <Alert color="red" variant="outline" role="alert" styles={{ message: { color: 'var(--danger)' } }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit" fullWidth loading={sending}
          disabled={!config?.available || !token || verificationError}
          className="btn" style={submitStyle}
        >
          Send message
        </Button>
        <Group justify="space-between" gap="xs">
          <span className="tags">Your email is only used to reply.</span>
          <a className="link tags" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </Group>
      </Stack>
    </Box>
  );
}

interface ContactButtonProps {
  className?: string;
  children: ReactNode;
}

export function ContactButton({ className, children }: ContactButtonProps) {
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const { devMode } = useDevMode();
  const { classes } = useStyles();
  const close = () => { if (!busy) setOpened(false); };

  return (
    <>
      <button
        type="button" className={className}
        aria-haspopup="dialog" onClick={() => setOpened(true)}
      >
        {children}
      </button>
      <Modal
        opened={opened} onClose={close} centered size={520} padding="xl"
        title="Let's talk." zIndex={2000}
        classNames={{ content: classes.content, header: classes.header, title: classes.title, close: classes.close }}
        closeButtonProps={{ 'aria-label': 'Close contact form', disabled: busy }}
        closeOnEscape={!busy} closeOnClickOutside={!busy}
        overlayProps={{ backgroundOpacity: 0.45, color: '#000' }}
        transitionProps={{ transition: 'fade', duration: 150 }}
      >
        {opened && <ContactForm devMode={devMode} onClose={close} onBusyChange={setBusy} />}
      </Modal>
    </>
  );
}
