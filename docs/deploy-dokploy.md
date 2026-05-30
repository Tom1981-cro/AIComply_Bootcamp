# Deploying to Hetzner via Dokploy

This walkthrough assumes you already have a Hetzner box running Dokploy (the
same one hosting your other app is fine — Dokploy is designed for multi-app
hosts). At the end you'll have this storefront live at the domain you point
at it, with its own Postgres, its own env, and a TLS cert via Traefik +
Let's Encrypt.

## 1. Create the project

Dokploy UI → **Projects** → **New Project**.

| Field | Value |
| --- | --- |
| Name | `aicomply-bootcamp` |
| Description | EU AI Act SME Compliance Pack storefront |

A project is just a namespace. The app and its Postgres live inside it.

## 2. Add a Postgres service inside the project

Inside the new project → **Add Service** → **Postgres**.

| Field | Value |
| --- | --- |
| Name | `aicomply-pg` |
| Image | `postgres:16-alpine` |
| Database | `aicomply` |
| Username | `aicomply` |
| Password | *(generate a strong one — Dokploy has a generator)* |

Click **Deploy**. Postgres comes up on the project's internal network.
**Copy the internal connection string** Dokploy shows you — it looks like
`postgresql://aicomply:<password>@aicomply-pg:5432/aicomply`. That's the
value for `DATABASE_URL` in the next step.

> Keeping Postgres inside this project (not shared with your other app)
> gives clean blast-radius isolation: one app's misbehaving migration
> can't take down the other.

## 3. Add the storefront application

Inside the project → **Add Service** → **Application** → **Git**.

| Field | Value |
| --- | --- |
| Name | `aicomply-bootcamp-web` |
| Provider | GitHub |
| Repository | `tom1981-cro/aicomply_bootcamp` |
| Branch | `claude/elegant-pasteur-V1Cuu` *(or `main` after merge)* |
| Build type | **Dockerfile** *(auto-detected from the repo root)* |
| Dockerfile | `Dockerfile` |
| Build context | `.` |
| Internal port | `3000` |

## 4. Environment variables

Open the application's **Environment** tab and paste from
[`/.env.example`](../.env.example), then fill in the live values. Minimum
to bring the storefront up:

```env
# App
NEXT_PUBLIC_APP_URL="https://hub.ai-comply.ie"

# Database — paste the internal URL from step 2
DATABASE_URL="postgresql://aicomply:...@aicomply-pg:5432/aicomply"

# Lemon Squeezy
LEMON_STORE_URL="https://yourstore.lemonsqueezy.com"
LEMON_WEBHOOK_SECRET="..."
LEMON_VARIANT_STARTER="..."
LEMON_VARIANT_PRO="..."
LEMON_VARIANT_CONSULTANT="..."

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM="AIComply Toolkit <toolkit@aicomply.com>"
RESEND_AUDIENCE_ID="..."

# Hetzner Object Storage — see /README.md for endpoint table
S3_ENDPOINT="https://fsn1.your-objectstorage.com"
S3_REGION="fsn1"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_BUCKET="aicomply-bootcamp"

# Admin dashboard
ADMIN_USER="admin"
ADMIN_PASSWORD="..."

# Optional
LOOM_WALKTHROUGH_URL=""
POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_KEY=""
```

> `NEXT_PUBLIC_APP_URL` is **baked into the client bundle at build time**
> (Next.js public envs are inlined). If you change it later, you need to
> redeploy — not just restart.

## 5. Domain + TLS

Application's **Domains** tab → **Add Domain**.

| Field | Value |
| --- | --- |
| Host | `hub.ai-comply.ie` |
| Path | `/` |
| Port | `3000` |
| HTTPS | ✅ |
| Certificate | Let's Encrypt |

Make sure `hub.ai-comply.ie` has an A record pointing at the
Dokploy host's public IP before saving — Let's Encrypt will fail
issuance otherwise. Traefik handles the cert renewal afterwards.

## 6. Deploy

Hit **Deploy**. First build takes ~3–5 min (Docker layer cache is cold).
What you should see in the logs:

```
[deps]     installing node_modules
[builder]  prisma generate
[builder]  npm run build  →  Next.js standalone output emitted
[runner]   prisma migrate deploy  →  applies any pending migrations
[runner]   ▲ Next.js 15.x  ready on 0.0.0.0:3000
```

Subsequent deploys take ~60–90s on top of the cache.

## 7. Post-deploy: wire the external webhooks

Once `https://hub.ai-comply.ie` is up:

1. **Lemon Squeezy webhook** — LS dashboard → Settings → Webhooks → Add
   Webhook:
   - URL: `https://hub.ai-comply.ie/api/webhooks/lemon-squeezy`
   - Secret: same value as `LEMON_WEBHOOK_SECRET`
   - Events: `order_created` (minimum), plus refund events if you want
     automatic revocation
2. **Resend domain verification** — Resend dashboard → Domains → add
   `ai-comply.ie` and create the DNS records they show you. Required
   before `RESEND_FROM` will deliver.
3. **Smoke-test the buyer flow** — buy the Starter tier with Lemon
   Squeezy's test card (`4242 4242 4242 4242`, any future expiry, any
   CVC) and confirm:
   - You receive the fulfillment email
   - The download grant link in the email redirects to your S3 bucket
   - The grant expires correctly (try opening it after 1 hour)

## Multi-app on one host — what to know

You can run as many of these stacks as you want on the same Dokploy box —
each becomes its own project. A few things to watch:

- **Internal hostnames** (`aicomply-pg` etc.) are scoped to the *project*.
  Two projects can both have a service named `pg` with no clash.
- **Memory headroom**: this app's runtime container needs ~200–300 MB
  idle. Plus ~150 MB for the Postgres instance. Plan capacity accordingly.
- **One Let's Encrypt per host**: Traefik is shared at the Dokploy level,
  so cert issuance and HTTP→HTTPS redirects are handled centrally.
- **Backups**: configure Dokploy's scheduled Postgres dump per service so
  one app's loss doesn't affect another's.

## Rolling back

Dokploy keeps the previous successful image. Application → **Deployments**
→ pick a previous green build → **Rollback**. The database is *not* rolled
back — Prisma migrations are forward-only, so a rollback to an older app
version against a newer schema is your problem to resolve. If you suspect
a migration is bad, fix it forward rather than rolling back.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Container restarts in a loop on first deploy | `DATABASE_URL` unreachable — check the Postgres service is healthy and the internal hostname matches |
| Build fails at `npx prisma generate` | `prisma/schema.prisma` syntax error, or `DATABASE_URL` is missing during build (it shouldn't be required for generate, but provider mismatch can complain) |
| Build succeeds, runtime 500s on the landing | Likely missing public env var like `NEXT_PUBLIC_APP_URL` at *build* time — set it as a Dokploy build arg, not just a runtime env |
| Lemon Squeezy webhooks 401 | `LEMON_WEBHOOK_SECRET` mismatch — the same value must be in both Dokploy env and LS dashboard |
| Download links 403 from S3 | Hetzner credentials don't have read access to the bucket, or the bucket name/region don't match the endpoint |
| TLS cert never issued | DNS A record not propagated; Let's Encrypt rate-limited after 5 failures/hour — wait, or use a staging cert first |
