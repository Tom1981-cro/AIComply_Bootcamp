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
- **Hetzner Object Storage** (S3-compatible) for protected downloads (signed, gated)
- **PostHog** for product analytics (optional; no-ops when unset)
- Deploy: Hetzner via **Dokploy/Coolify**, EU region

## Routing decision

The storefront is served at the **`hub.ai-comply.ie`** subdomain, so it
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

## Preview in GitHub Codespaces (no local setup)

This repo ships a dev container (`.devcontainer/`) with Node 22 + a Postgres
service pre-wired.

1. On GitHub: **Code → Codespaces → Create codespace** on this branch.
2. Wait for the post-create step (`npm install` + `npm run db:push`) to finish.
3. Run `npm run dev`. Codespaces forwards **port 3000** and opens a preview;
   the "Ports" tab gives you a shareable URL.

`DATABASE_URL` and `NEXT_PUBLIC_APP_URL` are preset by the dev container, so the
landing page and all DB-backed pages work out of the box. Add the optional
integration keys (Resend / R2 / Lemon / PostHog) as Codespaces secrets or in a
local `.env` to exercise those flows — **don't** override `DATABASE_URL` there.

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
| `S3_ENDPOINT` / `S3_REGION` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_BUCKET` | for downloads | Hetzner Object Storage (S3-compatible) |
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
S3 presigned URLs only support expiry — not download caps or IP binding. So
customers never get a raw bucket URL. They get a link to `/api/download/[grant]`
which enforces:
- **1-hour** grant window,
- **max 5** downloads,
- **IP binding** (bound on first download),

then 302-redirects to a freshly-minted, very short-lived (60s) S3 presigned URL.

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

### Hetzner Object Storage (S3-compatible)
1. In the Hetzner Cloud Console → **Object Storage**, create a project and a
   bucket → `S3_BUCKET`. Pick a location (Falkenstein / Nuremberg / Helsinki)
   and set the matching endpoint + region:
   - Falkenstein → `S3_ENDPOINT="https://fsn1.your-objectstorage.com"`, `S3_REGION="fsn1"`
   - Nuremberg   → `S3_ENDPOINT="https://nbg1.your-objectstorage.com"`, `S3_REGION="nbg1"`
   - Helsinki    → `S3_ENDPOINT="https://hel1.your-objectstorage.com"`, `S3_REGION="hel1"`
2. Keep the bucket **private** (no public read).
3. Create an **S3 credential** for the project → `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`.
4. Upload the deliverable bundles under the `files/` prefix:
   - `files/article-50-disclosure-pack.zip` (lead magnet)
   - `files/toolkit-starter.zip`, `files/toolkit-pro.zip`,
     `files/toolkit-consultant.zip`
   - `files/white-label-license.pdf`
   For local testing, any dummy zip/pdf with these keys works.

> **A note on naming:** Hetzner ships two distinct storage products. "Hetzner
> Object Storage" is S3-compatible (this is what the app uses). "Hetzner
> Storage Box" is SFTP / WebDAV / SMB and is **not** S3 — picking it instead
> would require swapping out `lib/storage.ts` for an SFTP-based delivery flow.
> Confirm you're using Object Storage before going to production.

### Assembling the tier bundles

The six deliverables ship as individual product packages (see `lib/deliverables.ts`).
For each customer-facing tier, zip the appropriate set together once and upload
the result to Object Storage:

| Bundle | Contents | Tier scope |
| --- | --- | --- |
| `toolkit-starter.zip` | All six v1.0 deliverable bundles + per-bundle READMEs | Starter / Pro / Consultant |
| `toolkit-pro.zip` | Starter contents + editable Markdown/structured sources for prose docs | Pro / Consultant |
| `toolkit-consultant.zip` | Pro contents + a `BRANDING.md` for the white-label workflow | Consultant only |
| `white-label-license.pdf` | The consultant licence document | Consultant only |
| `article-50-disclosure-pack.zip` | The free lead-magnet pack | Anyone who confirms email |

The same `fileKey` → tier mapping lives in `lib/tiers.ts`; if you change the
filenames, update both that file and Object Storage.

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

The repo ships a multi-stage `Dockerfile` and a `next.config.ts` set to
`output: "standalone"`, so the app builds into a small self-contained
image. Migrations run on container start before the server boots.

Full walkthrough: **[`docs/deploy-dokploy.md`](docs/deploy-dokploy.md)**.
The 30-second version:

1. New Dokploy project → add Postgres service inside it.
2. Add Application → Git → this repo + branch → build type **Dockerfile** → port **3000**.
3. Paste env from `.env.example`, point `DATABASE_URL` at the internal Postgres URL.
4. Add domain (`hub.ai-comply.ie`), enable Let's Encrypt.
5. Deploy. First boot runs `prisma migrate deploy` then starts.
6. Wire the Lemon Squeezy webhook to `/api/webhooks/lemon-squeezy` and verify the Resend sending domain.

Multi-app on one Dokploy host is the standard pattern — each app is its
own project with its own Postgres, its own env, its own subdomain. See
the walkthrough for capacity / backup / rollback notes.

---

## Project layout

```
app/
  page.tsx                       landing (assembles sections)
  products/[slug]/               per-deliverable product detail pages
  lead-magnet/confirm/           double opt-in confirmation
  orders/[order_id]/             re-download (magic link)
  legal/[doc]/                   placeholder legal pages
  admin/                         basic-auth dashboard
  api/
    lead-magnet/                 capture
    webhooks/lemon-squeezy/      webhook + fulfillment
    download/[grant]/            gated download → S3 presign
    orders/magic-link/           magic-link request
    admin/                       re-issue, CSV export
components/landing/ …            landing sections
components/ui/ …                 shadcn-style primitives
lib/
  deliverables.ts                six-deliverable catalog + product copy
  storage.ts                     S3-compatible client (Hetzner Object Storage)
  tiers.ts                       tier prices, variant ids, bundle file keys
  prisma.ts, resend.ts, lemon.ts, download.ts, magic-link.ts, fulfillment.ts, …
content/ …                       human-authored placeholder content
public/marketing/                covers + carousels for product pages
prisma/schema.prisma             data model
```
