# EU AI Act SME Compliance Pack — storefront

Storefront, checkout, and protected file-delivery infrastructure for **The EU
AI Act SME Compliance Pack**. This repo is the *plumbing* — landing page,
lead-magnet capture, Lemon Squeezy checkout + webhook fulfillment, signed
download delivery, a re-download flow, and a minimal admin dashboard.

> The compliance **content** (training, policies, Annex IV docs, etc.) is **not**
> in this repo. All such files are clearly-marked placeholders. See
> [`MANUAL-CONTENT-TODO.md`](./MANUAL-CONTENT-TODO.md).

## Stack

- **Next.js 15** (App Router) + TypeScript (strict)
- **Tailwind CSS 4** + a small set of shadcn/ui-style primitives
- **PostgreSQL** via **Prisma**
- **Lemon Squeezy** as Merchant of Record (hosted checkout overlay)
- **Resend** for transactional email + audience
- **Cloudflare R2** for protected downloads (signed, gated)
- **PostHog** for product analytics (optional; no-ops when unset)
- Deploy: Hetzner via **Dokploy/Coolify**, EU region

## Routing decision

The storefront is served at the **`bootcamp.ai-comply.ie`** subdomain, so it
lives at the app root (`/`) — no Next.js `basePath` needed. Transactional email
is sent from `toolkit@aicomply.com`.

---

## Local setup

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
#   …fill in DATABASE_URL at minimum; integrations can be added incrementally.

# 3. Create the schema
npm run db:push        # or: npm run db:migrate  (creates a migration)

# 4. Run
npm run dev            # http://localhost:3000
```

Useful scripts:

| Script | What |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push schema to the DB (no migration files) |
| `npm run db:migrate` | Create + apply a dev migration |
| `npm run db:studio` | Prisma Studio |

> **Note:** Many flows require external services. Without `RESEND_API_KEY` the
> lead-magnet/email steps return an error; without R2 credentials the actual
> file fetch fails (the grant/gating logic still works). You can develop the UI
> and webhook logic without them and wire each integration in turn.

---

## Environment variables

See [`.env.example`](./.env.example) for the full annotated list. Summary:

| Var | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | yes | Public base URL (links in emails, redirects) |
| `DATABASE_URL` | yes | Postgres connection |
| `LEMON_STORE_URL` | for checkout | Hosted-checkout base URL |
| `LEMON_WEBHOOK_SECRET` | for webhooks | HMAC signing secret (webhooks rejected without it) |
| `LEMON_VARIANT_STARTER/PRO/CONSULTANT` | for checkout | Variant IDs per tier |
| `RESEND_API_KEY` | for email | Resend API key |
| `RESEND_FROM` | optional | Sender (default `toolkit@aicomply.com`) |
| `RESEND_AUDIENCE_ID` | optional | "ai-act-sme" audience (skipped if unset) |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` | for downloads | Cloudflare R2 |
| `LOOM_WALKTHROUGH_URL` | optional | Included with Pro + Consultant |
| `ADMIN_USER` / `ADMIN_PASSWORD` | for `/admin` | Basic auth (admin locked out until password set) |
| `POSTHOG_KEY` / `POSTHOG_HOST` | optional | Server-side analytics |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | optional | Client-side analytics |

---

## How the pieces fit together

### Lead magnet (double opt-in)
1. `POST /api/lead-magnet` validates email + GDPR consent, upserts a
   `LeadMagnetSubscriber` (unconfirmed), and emails a confirmation link.
2. `/lead-magnet/confirm?token=…` confirms the subscriber, adds them to the
   Resend audience (best-effort), creates a download grant for the Article 50
   pack, and emails + shows the download link.

### Checkout
- The landing builds a Lemon Squeezy overlay URL per tier (server-side, since
  variant IDs are env secrets), passing `custom_data.tier`. The client opens it
  with `lemon.js`, prefilling the email captured from the lead magnet if present.

### Webhook → fulfillment (`/api/webhooks/lemon-squeezy`)
- Verifies the `X-Signature` HMAC (hard error if the secret is missing).
- Records every event in `WebhookEvent` (for audit/replay).
- On `order_created`: dedupes on `lemonOrderId`, writes an `Order`, then
  fulfills by tier:
  - **Starter** → `toolkit-starter.zip`
  - **Pro** → `toolkit-pro.zip` + Loom URL
  - **Consultant** → `toolkit-consultant.zip` + Loom URL + `white-label-license.pdf`
- `subscription_created` is acknowledged + logged (no subscriptions in v1).

### Protected downloads (the "signed URL" gate)
R2 presigned URLs only support expiry — not download caps or IP binding. So
customers never get a raw R2 URL. They get a link to `/api/download/[grant]`
which enforces:
- **1-hour** grant window,
- **max 5** downloads,
- **IP binding** (bound on first download),

then 302-redirects to a freshly-minted, very short-lived (60s) R2 presigned URL.

### Re-download (`/orders/[order_id]`)
Customer enters their purchase email → magic link (30-min) → page issues fresh
grants and shows links. Self-service re-issues are capped at **3 per order**.
Admins can re-issue manually from `/admin` without consuming that cap.

---

## Service setup walkthroughs

### Lemon Squeezy
1. Create a store. Note its URL → `LEMON_STORE_URL`
   (e.g. `https://yourstore.lemonsqueezy.com`).
2. Create **one product per tier** (or one product with three variants):
   - Starter — €49, Pro — €149, Consultant — €399.
   - For digital delivery, you can leave Lemon's own file delivery empty — we
     deliver via Resend + R2.
3. For each variant, copy its **Variant ID** →
   `LEMON_VARIANT_STARTER` / `_PRO` / `_CONSULTANT`.
4. **Settings → Webhooks → +**: URL `https://<your-domain>/api/webhooks/lemon-squeezy`,
   sign with a secret → `LEMON_WEBHOOK_SECRET`. Subscribe to at least
   `order_created` (and `subscription_created` if you like — it's a no-op).
5. Test mode: enable test mode, run a test purchase, confirm an `Order` row
   appears and the fulfillment email sends.

### Cloudflare R2
1. Create a bucket → `R2_BUCKET`. Keep it **private** (no public access).
2. Account → **R2 → Manage R2 API Tokens** → create a token with
   Object Read/Write for that bucket → `R2_ACCESS_KEY_ID` /
   `R2_SECRET_ACCESS_KEY`. Your account id → `R2_ACCOUNT_ID`.
3. Upload the deliverable files under the `files/` prefix:
   - `files/article-50-disclosure-pack.zip` (lead magnet)
   - `files/toolkit-starter.zip`, `files/toolkit-pro.zip`,
     `files/toolkit-consultant.zip`
   - `files/white-label-license.pdf`
   For local testing, any dummy zip/pdf with these keys works.

### Resend
1. Add and **verify your sending domain** (`aicomply.com`): add the DKIM and
   SPF/Return-Path DNS records Resend provides, plus a DMARC record. Wait for
   verification before sending from `toolkit@aicomply.com`.
2. Create an API key → `RESEND_API_KEY`.
3. Create an **Audience** named "ai-act-sme"; copy its id → `RESEND_AUDIENCE_ID`.
   (Resend contacts don't support arbitrary tags via API — the
   `source:toolkit-lead-magnet` tag is tracked in our DB instead.)

### PostHog (optional)
- Self-hosted EU instance preferred. Set `POSTHOG_HOST` /
  `NEXT_PUBLIC_POSTHOG_HOST` to its URL and the project keys. Left unset,
  analytics no-ops. Events: `lead_magnet_submitted`, `checkout_initiated`,
  `purchase_completed`, `download_clicked`, `magic_link_requested`.

---

## Deploy (Dokploy / Coolify on Hetzner, EU)

1. Provision a **PostgreSQL** service; set `DATABASE_URL`.
2. Create an application from this repo. Build command `npm run build`,
   start command `npm run start`, port `3000`.
3. Add all env vars from `.env.example`.
4. Run migrations on deploy (e.g. a release/pre-start command
   `npx prisma migrate deploy`).
5. Point `bootcamp.ai-comply.ie` at the app; enable TLS.
6. Set the Lemon Squeezy webhook URL to the live domain and do a test purchase.

> The app reads runtime env (the landing is `force-dynamic`), so env changes
> take effect on restart without a rebuild.

---

## Project layout

```
app/
  page.tsx                       landing (assembles sections)
  lead-magnet/confirm/           double opt-in confirmation
  orders/[order_id]/             re-download (magic link)
  legal/[doc]/                   placeholder legal pages
  admin/                         basic-auth dashboard
  api/
    lead-magnet/                 capture
    webhooks/lemon-squeezy/      webhook + fulfillment
    download/[grant]/            gated download → R2 presign
    orders/magic-link/           magic-link request
    admin/                       re-issue, CSV export
components/landing/ …            landing sections
components/ui/ …                 shadcn-style primitives
lib/ …                           prisma, r2, resend, lemon, tiers, download, …
content/ …                       human-authored placeholder content
prisma/schema.prisma             data model
```
