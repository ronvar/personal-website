import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 3600;
const EMAIL_PATTERN = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const UNAVAILABLE = 'Messaging is temporarily unavailable. Please contact me on LinkedIn.';

interface ContactConfig {
  siteUrl: URL;
  siteKey: string;
  turnstileSecret: string;
  resendKey: string;
  from: string;
  to: string;
  redisUrl: string;
  redisToken: string;
}

interface ContactMessage {
  name: string;
  email: string;
  message: string;
  website: string;
  turnstileToken: string;
}

class ContactError extends Error {
  status: number;
  retryAfter?: number;

  constructor(status: number, message: string, retryAfter?: number) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

function json(body: Record<string, unknown>, status = 200, retryAfter?: number) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {}),
    },
  });
}

function singleLine(value: string) {
  return !Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

function getConfig(): ContactConfig | null {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const siteUrlString = process.env.CONTACT_SITE_URL?.trim();

  if (!siteKey || !turnstileSecret || !resendKey || !from || !to || !redisUrl || !redisToken || !siteUrlString) {
    return null;
  }

  const senderAddress = from.match(/<([^<>]+)>$/)?.[1] ?? from;
  if (!singleLine(from) || !EMAIL_PATTERN.test(senderAddress) || !EMAIL_PATTERN.test(to)) return null;

  // Cloudflare's test keys must never enable a production form.
  const usesTestKeys = [siteKey, turnstileSecret].some((key) => /^[123]x000/.test(key));
  if (process.env.NODE_ENV === 'production' && usesTestKeys) return null;

  try {
    const siteUrl = new URL(siteUrlString);
    if (siteUrl.protocol !== 'https:' || new URL(redisUrl).protocol !== 'https:') return null;
    return { siteUrl, siteKey, turnstileSecret, resendKey, from, to, redisUrl, redisToken };
  } catch {
    return null;
  }
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  const origins = new Set<string>();
  try {
    if (process.env.CONTACT_SITE_URL) origins.add(new URL(process.env.CONTACT_SITE_URL).origin);
    if (process.env.VERCEL === '1' && process.env.VERCEL_URL) {
      origins.add(new URL(`https://${process.env.VERCEL_URL}`).origin);
    }
    const requestUrl = new URL(request.url);
    if (process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(requestUrl.hostname)) {
      origins.add(requestUrl.origin);
    }
  } catch {
    return false;
  }
  return origins.has(origin);
}

async function readMessage(request: Request): Promise<ContactMessage> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new ContactError(415, 'Please submit the contact form as JSON.');
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    throw new ContactError(413, 'Your message is too long.');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ContactError(400, 'Please complete the contact form.');

  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new ContactError(413, 'Your message is too long.');
    }
    chunks.push(value);
  }

  let body: unknown;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new ContactError(400, 'Please complete the contact form.');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ContactError(400, 'Please complete the contact form.');
  }
  const fields = body as Record<string, unknown>;
  if (['name', 'email', 'message', 'turnstileToken'].some((key) => typeof fields[key] !== 'string') ||
    (fields.website !== undefined && typeof fields.website !== 'string')) {
    throw new ContactError(400, 'Please complete the contact form.');
  }
  const message = {
    name: (fields.name as string).trim(),
    email: (fields.email as string).trim(),
    message: (fields.message as string).trim(),
    website: ((fields.website as string | undefined) ?? '').trim(),
    turnstileToken: (fields.turnstileToken as string).trim(),
  };
  if (message.name.length < 2 || message.name.length > 80 || !singleLine(message.name) ||
    message.email.length > 254 || !EMAIL_PATTERN.test(message.email) ||
    message.message.length < 10 || message.message.length > 4000 ||
    !message.turnstileToken || message.turnstileToken.length > 2048) {
    throw new ContactError(400, 'Please enter a valid name, email, and message (10-4,000 characters).');
  }
  return message;
}

function clientIp(request: Request) {
  // Only trust forwarding headers when Vercel is the serving platform.
  const ip = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for')?.trim() : undefined;
  if (ip && isIP(ip)) return ip;
  return process.env.NODE_ENV === 'production' ? 'unknown' : '127.0.0.1';
}

async function enforceRateLimit(config: ContactConfig, ip: string) {
  const key = `contact:${createHmac('sha256', config.redisToken).update(ip).digest('hex')}`;
  const script = `local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return {count, redis.call('TTL', KEYS[1])}`;
  const response = await fetch(config.redisUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.redisToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', script, '1', key, String(RATE_WINDOW_SECONDS)]),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  });
  if (!response.ok) throw new ContactError(503, UNAVAILABLE);
  const result = await response.json();
  if (result.error || !Array.isArray(result.result) || result.result.length !== 2 ||
    !result.result.every((value: unknown) => typeof value === 'number') || result.result[1] < 0) {
    throw new ContactError(503, UNAVAILABLE);
  }
  if (result.result[0] > RATE_LIMIT) {
    const retryAfter = Math.max(1, result.result[1]);
    throw new ContactError(429, 'You have sent several messages recently. Please try again later.', retryAfter);
  }
}

async function verifyVisitor(config: ContactConfig, request: Request, token: string, ip: string) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: config.turnstileSecret,
      response: token,
      ...(isIP(ip) ? { remoteip: ip } : {}),
    }),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  });
  if (!response.ok) throw new ContactError(503, UNAVAILABLE);
  const result = await response.json();
  const hostname = new URL(request.headers.get('origin')!).hostname;
  if (result.success !== true || result.action !== 'contact' || result.hostname !== hostname) {
    throw new ContactError(400, 'Verification failed or expired. Please verify again and resend.');
  }
}

async function sendMessage(config: ContactConfig, message: ContactMessage) {
  // Stable provider keys prevent duplicate delivery when a response is lost.
  const fingerprint = createHmac('sha256', config.resendKey)
    .update(JSON.stringify([message.name, message.email, message.message])).digest('hex');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `contact/${fingerprint}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: message.email,
      subject: `Portfolio message from ${message.name}`,
      text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
    }),
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  });
  if (!response.ok) throw new ContactError(502, 'Your message could not be sent. Please try again or contact me on LinkedIn.');
  const result = await response.json();
  if (typeof result.id !== 'string' || !result.id) throw new ContactError(502, UNAVAILABLE);
}

export function GET() {
  const config = getConfig();
  return json({ available: config !== null, siteKey: config?.siteKey ?? null });
}

export async function POST(request: Request) {
  try {
    if (!allowedOrigin(request)) return json({ error: 'Please send your message through the website.' }, 403);
    const message = await readMessage(request);
    if (message.website) return json({ success: true });

    const config = getConfig();
    if (!config) return json({ error: UNAVAILABLE }, 503);
    const ip = clientIp(request);
    await enforceRateLimit(config, ip);
    await verifyVisitor(config, request, message.turnstileToken, ip);
    await sendMessage(config, message);
    return json({ success: true });
  } catch (error) {
    if (error instanceof ContactError) return json({ error: error.message }, error.status, error.retryAfter);
    return json({ error: UNAVAILABLE }, 503);
  }
}
