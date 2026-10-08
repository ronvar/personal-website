'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionIcon, Alert, Anchor, Box, Button, Group, Loader, Modal, Stack,
  Text, Textarea, TextInput, ThemeIcon, Title, Tooltip, useComputedColorScheme,
} from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { IconArrowUpRight, IconCheck, IconMail, IconSend } from '@tabler/icons-react';
import { useDevMode } from './DevModeContext';
import { TurnstileWidget } from './TurnstileWidget';

const LINKEDIN_URL = 'https://linkedin.com/in/rvar';

const useStyles = createStyles((_, { devMode }: { devMode: boolean }) => ({
  content: {
    minHeight: 'auto',
    padding: 0,
    backgroundColor: devMode ? '#0a0a0a' : 'var(--background)',
    border: `1px solid ${devMode ? 'rgba(0, 255, 0, 0.25)' : 'var(--gray-200)'}`,
    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.2)',
  },
  header: {
    backgroundColor: devMode ? '#0a0a0a' : 'var(--background)',
  },
  title: {
    color: devMode ? '#00ff00' : 'var(--foreground)',
    fontSize: '1.8rem',
    fontWeight: 600,
    letterSpacing: '-0.04em',
  },
  input: {
    backgroundColor: devMode ? '#0d1a0d' : 'var(--gray-100)',
    borderColor: devMode ? '#1a2f1a' : 'var(--gray-200)',
    color: devMode ? '#00ff00' : 'var(--foreground)',
    fontSize: 16,
    '&:focus': {
      borderColor: devMode ? '#00ff00' : 'var(--apple-blue)',
    },
  },
  label: {
    color: devMode ? '#00ff00' : 'var(--foreground)',
    fontWeight: 500,
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

interface ContactFormProps {
  devMode: boolean;
  onClose: () => void;
  onBusyChange: (busy: boolean) => void;
}

function ContactForm({ devMode, onClose, onBusyChange }: ContactFormProps) {
  const { classes } = useStyles({ devMode });
  const colorScheme = useComputedColorScheme('light');
  const [config, setConfig] = useState<{ available: boolean; siteKey: string | null } | null>(null);
  const [token, setToken] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const [verificationKey, setVerificationKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const sendingRef = useRef(false);
  const hintColor = devMode ? 'rgba(0, 255, 0, 0.7)' : 'dimmed';

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
      <Stack align="center" gap="lg" py="xl" role="status">
        <ThemeIcon size={64} radius="xl" variant="light" color={devMode ? 'green' : 'blue'}>
          <IconCheck size={30} stroke={1.5} />
        </ThemeIcon>
        <Box ta="center">
          <Title order={3} size="xl" c={devMode ? '#00ff00' : 'var(--foreground)'} mb="xs">
            Thanks for reaching out.
          </Title>
          <Text c={hintColor}>Your message is on its way. I&apos;ll reply by email.</Text>
        </Box>
        <Button radius="xl" variant="light" color={devMode ? 'green' : 'blue'} onClick={onClose}>
          Back to exploring
        </Button>
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
          radius="md" size="md" disabled={sending}
          classNames={{ input: classes.input, label: classes.label }}
        />
        <TextInput
          name="email" type="email" label="Your email" placeholder="alex@example.com" required
          maxLength={254} autoComplete="email" radius="md" size="md" disabled={sending}
          classNames={{ input: classes.input, label: classes.label }}
        />
        <Textarea
          name="message" label="Your message" placeholder="Tell me a little about what you have in mind..."
          required minLength={10} maxLength={4000} rows={4} radius="md" size="md" disabled={sending}
          classNames={{ input: classes.input, label: classes.label }}
        />
        <Box className={classes.honeypot} aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
        </Box>

        {!config && (
          <Group gap="xs" role="status">
            <Loader size="xs" />
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
            <Button variant="subtle" size="xs" onClick={retryVerification} style={{ alignSelf: 'flex-start' }}>
              Retry verification
            </Button>
          </Stack>
        )}
        {config && !config.available && (
          <Alert color={devMode ? 'green' : 'blue'} radius="md">
            Messaging is temporarily unavailable. You can still{' '}
            <Anchor href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" fw={500}>
              reach me on LinkedIn
            </Anchor>.
          </Alert>
        )}
        {error && <Alert color="red" radius="md" role="alert">{error}</Alert>}

        <Button
          type="submit" fullWidth size="md" radius="xl" loading={sending}
          disabled={!config?.available || !token || verificationError}
          rightSection={<IconSend size={18} stroke={1.5} />}
          color={devMode ? 'green' : 'blue'}
        >
          Send message
        </Button>
        <Group justify="space-between" gap="xs">
          <Text size="xs" c={hintColor}>Your email is only used to reply.</Text>
          <Anchor href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" size="xs">
            <Group gap={3} wrap="nowrap">LinkedIn <IconArrowUpRight size={12} /></Group>
          </Anchor>
        </Group>
      </Stack>
    </Box>
  );
}

export function ContactButton() {
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const { devMode } = useDevMode();
  const { classes } = useStyles({ devMode });
  const close = () => { if (!busy) setOpened(false); };

  return (
    <>
      <Tooltip label="Contact me" withArrow>
        <ActionIcon
          variant="subtle" size="xl" radius="xl" aria-label="Contact me"
          aria-haspopup="dialog" onClick={() => setOpened(true)}
        >
          <IconMail size={24} />
        </ActionIcon>
      </Tooltip>
      <Modal
        opened={opened} onClose={close} centered size={480} padding="xl" radius="xl"
        title="Let's talk." zIndex={2000}
        classNames={{ content: classes.content, header: classes.header, title: classes.title }}
        closeButtonProps={{ 'aria-label': 'Close contact form', disabled: busy }}
        closeOnEscape={!busy} closeOnClickOutside={!busy}
        overlayProps={{ backgroundOpacity: 0.25, blur: 8 }}
        transitionProps={{ transition: 'fade', duration: 180 }}
      >
        {opened && <ContactForm devMode={devMode} onClose={close} onBusyChange={setBusy} />}
      </Modal>
    </>
  );
}
