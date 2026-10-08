# Contact Form Setup

The email icon opens a contact modal. `/api/contact` sends messages through
Resend, verifies Cloudflare Turnstile tokens, and limits submissions with Upstash
Redis. The recipient address is never sent to the browser.

The code is ready, but messages remain disabled until all credentials are set.
Visitors can use LinkedIn while messaging is unavailable. No messages are
silently saved or presented as delivered before the provider accepts them.

## 1. Email Delivery

1. Create a [Resend account](https://resend.com/).
2. Add a sending domain you own, such as `ronvargas.dev` or a dedicated subdomain.
3. Add the DNS records Resend supplies and wait for domain verification.
4. Create a sending API key restricted to that domain.
5. Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` using the verified domain.
6. Set `CONTACT_TO_EMAIL` to the private inbox that should receive messages.

The current inbox has been moved into the ignored `.env.local` file. Set that
same value in Vercel; `.env.local` is not uploaded by Git. You do not need to move
your inbox to Resend: it only sends the form messages. Replying to a message uses
the visitor's email address via the `Reply-To` header.

See [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction).

## 2. Bot Protection

1. Create a [Cloudflare account](https://dash.cloudflare.com/sign-up).
2. Open Turnstile and add a widget using Managed mode.
3. Allow the site's hostname, such as `ronvargas.dev`, plus `www.ronvargas.dev` if
   used. Add `localhost` and `127.0.0.1` if you want to test with live keys locally.
4. Set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.

You can use Turnstile without moving the site or its DNS to Cloudflare. The
server verifies token validity, action (`contact`), and hostname. Tokens are
single-use and refreshed after every submission attempt. Official test keys
are rejected in production.

See [Turnstile setup](https://developers.cloudflare.com/turnstile/get-started/).

## 3. Rate Limiting

1. Create an [Upstash account](https://console.upstash.com/).
2. Create a Redis database near your Vercel deployment's region.
3. Copy its REST URL and standard read/write token into
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

The limit is five valid-form submission attempts per IP per hour. Counters are
updated atomically and shared between deployment instances. IP addresses are
stored as keyed hashes; the counters expire after one hour. If Redis is
unavailable, the endpoint rejects the submission instead of bypassing limits.

The endpoint trusts Vercel's `x-vercel-forwarded-for` header only when running
on Vercel. Local development shares one loopback-IP counter. If hosting elsewhere,
configure a trusted platform IP source before enabling the production form;
otherwise all visitors share the conservative `unknown` counter.

## 4. Local and Production Configuration

Fill the existing ignored `.env.local` file using `.env.example` as the reference.
Keep credentials out of Git and chat. Restart the development server after adding
values. All eight variables listed in `.env.example` are required.

In Vercel, open the project's Settings -> Environment Variables, add the same
values for Production, and redeploy. `CONTACT_SITE_URL` must match the canonical
production origin. The public Turnstile site key is fetched at runtime; the
recipient address, API keys, and verification secret are server-only.

For preview deployments, use separate preview credentials and allow the specific
preview hostname in Turnstile. Vercel's deployment URL is accepted as an origin;
unregistered preview hostnames cannot complete verification.

## Verification

- Open the contact icon and submit a real message after configuration.
- Confirm the message arrives in the intended inbox and Reply addresses the visitor.
- Confirm both mobile and desktop can complete the challenge.
- An invalid/expired challenge must never send email.
- The sixth attempt in an hour returns `429` and a `Retry-After` header.
- Provider failures keep the form text and show an error instead of success.
- Existing email addresses in public resumes or previous deployments may still
  be discoverable; this change removes the address from the current page.

The automated contact tests mock the three external services and send no email.
Run `npm run test:contact` with Node.js 22.6 or later.
