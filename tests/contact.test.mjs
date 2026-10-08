import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { GET, POST } from '../src/app/api/contact/route.ts';

const config = {
  NODE_ENV: 'test',
  VERCEL: '1',
  VERCEL_URL: 'preview.example.com',
  CONTACT_SITE_URL: 'https://portfolio.example.com',
  CONTACT_TO_EMAIL: 'private-owner@example.com',
  CONTACT_FROM_EMAIL: 'Portfolio <contact@example.com>',
  RESEND_API_KEY: 'resend-test-secret',
  TURNSTILE_SITE_KEY: 'sitekey-public',
  TURNSTILE_SECRET_KEY: 'turnstile-test-secret',
  UPSTASH_REDIS_REST_URL: 'https://redis.example.com',
  UPSTASH_REDIS_REST_TOKEN: 'redis-test-secret',
};
const savedEnv = Object.fromEntries(Object.keys(config).map((key) => [key, process.env[key]]));
const validMessage = {
  name: 'Alex Taylor',
  email: 'visitor@example.com',
  message: 'I would like to discuss a role with you.',
  website: '',
  turnstileToken: 'visitor-token',
};
let calls;
let count;
let verification;
let redisStatus;
let resendStatus;

function request(overrides = {}, headers = {}) {
  return new Request('https://portfolio.example.com/api/contact', {
    method: 'POST',
    headers: {
      Origin: 'https://portfolio.example.com',
      'Content-Type': 'application/json',
      'x-vercel-forwarded-for': '203.0.113.10',
      ...headers,
    },
    body: JSON.stringify({ ...validMessage, ...overrides }),
  });
}

beforeEach(() => {
  Object.assign(process.env, config);
  calls = [];
  count = 1;
  verification = { success: true, action: 'contact', hostname: 'portfolio.example.com' };
  redisStatus = 200;
  resendStatus = 200;
  mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    if (url === config.UPSTASH_REDIS_REST_URL) {
      return Response.json({ result: [count, 3590] }, { status: redisStatus });
    }
    if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
      return Response.json(verification);
    }
    if (url === 'https://api.resend.com/emails') {
      return Response.json({ id: 'mock-email-id' }, { status: resendStatus });
    }
    throw new Error('Unexpected network request');
  });
});

afterEach(() => {
  mock.restoreAll();
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test('public configuration exposes only availability and the public site key', async () => {
  const response = GET();
  assert.deepEqual(await response.json(), { available: true, siteKey: config.TURNSTILE_SITE_KEY });
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('missing credentials disable both the form and delivery', async () => {
  delete process.env.RESEND_API_KEY;
  assert.deepEqual(await GET().json(), { available: false, siteKey: null });
  assert.equal((await POST(request())).status, 503);
  assert.equal(calls.length, 0);
});

test('test challenge keys cannot activate a production form', async () => {
  process.env.NODE_ENV = 'production';
  process.env.TURNSTILE_SITE_KEY = '1x00000000000000000000AA';
  assert.equal((await GET().json()).available, false);
  assert.equal((await POST(request())).status, 503);
  assert.equal(calls.length, 0);
});

test('valid submissions verify the visitor and forward to the fixed private inbox', async () => {
  const response = await POST(request({ to: 'attacker@example.com' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(calls.length, 3);
  assert.equal(calls[0].body[0], 'EVAL');
  assert.equal(calls[0].body[4], '3600');
  assert.equal(calls[0].body[3].includes('203.0.113.10'), false);
  assert.equal(calls[1].body.remoteip, '203.0.113.10');
  assert.deepEqual(calls[2].body.to, [config.CONTACT_TO_EMAIL]);
  assert.equal(calls[2].body.from, config.CONTACT_FROM_EMAIL);
  assert.equal(calls[2].body.reply_to, validMessage.email);
  assert.equal(calls[2].body.text.includes(validMessage.message), true);
});

test('untrusted and missing origins never reach external services', async () => {
  assert.equal((await POST(request({}, { Origin: 'https://attacker.example' }))).status, 403);
  const missingOrigin = request();
  missingOrigin.headers.delete('origin');
  assert.equal((await POST(missingOrigin)).status, 403);
  assert.equal(calls.length, 0);
});

test('invalid fields and header injection are rejected on the server', async () => {
  for (const invalid of [
    { name: 'A' }, { name: 'Alex\r\nInjected: header' },
    { email: 'invalid' }, { email: 'visitor@example.com\r\nBcc: injected@example.com' },
    { message: 'short' }, { message: 'x'.repeat(4001) },
    { turnstileToken: '' }, { email: { nested: 'value' } },
  ]) {
    assert.equal((await POST(request(invalid))).status, 400);
  }
  assert.equal(calls.length, 0);
});

test('oversized bodies and unsupported content types are rejected', async () => {
  assert.equal((await POST(request({ message: 'x'.repeat(17000) }))).status, 413);
  assert.equal((await POST(request({}, { 'Content-Length': '99999' }))).status, 413);
  assert.equal((await POST(request({}, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal(calls.length, 0);
});

test('the honeypot discards bot submissions without sending email', async () => {
  const response = await POST(request({ website: 'spam.example' }));
  assert.equal(response.status, 200);
  assert.equal(calls.length, 0);
});

test('the sixth attempt is blocked before verification and delivery', async () => {
  count = 6;
  const response = await POST(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '3590');
  assert.equal(calls.length, 1);
});

test('failed verification, wrong hostnames, and wrong actions cannot send email', async () => {
  for (const result of [
    { success: false },
    { success: true, action: 'contact', hostname: 'attacker.example' },
    { success: true, action: 'login', hostname: 'portfolio.example.com' },
  ]) {
    verification = result;
    assert.equal((await POST(request())).status, 400);
  }
  assert.equal(calls.some((call) => call.url === 'https://api.resend.com/emails'), false);
});

test('rate limiter outages cannot bypass submission limits', async () => {
  redisStatus = 500;
  assert.equal((await POST(request())).status, 503);
  assert.equal(calls.length, 1);
});

test('email provider errors are not reported as successful delivery', async () => {
  resendStatus = 500;
  const response = await POST(request());
  assert.equal(response.status, 502);
  const result = await response.json();
  assert.equal(result.success, undefined);
  assert.equal(typeof result.error, 'string');
});

test('delivery retries reuse the provider idempotency key', async () => {
  await POST(request());
  await POST(request({ turnstileToken: 'fresh-token' }));
  const emails = calls.filter((call) => call.url === 'https://api.resend.com/emails');
  assert.equal(emails[0].options.headers['Idempotency-Key'], emails[1].options.headers['Idempotency-Key']);
});

test('forwarding headers are ignored outside Vercel', async () => {
  delete process.env.VERCEL;
  await POST(request());
  assert.equal(calls[1].body.remoteip, '127.0.0.1');
});
