'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mantine/core';
import Script from 'next/script';

interface TurnstileApi {
  render: (container: HTMLElement, options: {
    sitekey: string;
    action: string;
    theme: 'light' | 'dark';
    size: 'flexible';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  theme: 'light' | 'dark';
  onToken: (token: string) => void;
  onError: () => void;
}

export function TurnstileWidget({ siteKey, theme, onToken, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const api = window.turnstile;
    if (!scriptReady || !container) return;
    if (!api) {
      onError();
      return;
    }
    let widgetId: string;
    try {
      widgetId = api.render(container, {
        sitekey: siteKey,
        action: 'contact',
        theme,
        size: 'flexible',
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': onError,
      });
    } catch {
      onError();
      return;
    }
    return () => {
      api.remove(widgetId);
      onToken('');
    };
  }, [scriptReady, siteKey, theme, onToken, onError]);

  useEffect(() => {
    if (scriptReady) return;
    const timeout = window.setTimeout(onError, 15_000);
    return () => window.clearTimeout(timeout);
  }, [scriptReady, onError]);

  return (
    <>
      <Script
        id="contact-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={onError}
      />
      <Box ref={containerRef} mih={65} />
    </>
  );
}
