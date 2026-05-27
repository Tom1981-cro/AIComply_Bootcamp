# Manual content & setup TODO (before launch)

Everything here is **your** job (the domain expert / business owner). The code
is built; these are the human-authored pieces and external setup it depends on.
Search the codebase for `[PLACEHOLDER]` and `TODO` to find every spot.

> Reminder: Claude built the plumbing only. No EU AI Act content, policy
> language, or marketing claims were written — those are all placeholders.

---

## 1. Decisions to confirm

- [x] **Design palette.** Extracted from the Tier-1 executive deck and applied
      in `lib/design-tokens.ts` + `app/globals.css`: cream paper, warm ink, plum
      primary, forest-green + bronze accents; Fraunces (serif) / Inter / JetBrains
      Mono. Adjust if the brand evolves.
- [ ] **Sender / support address.** Confirm `toolkit@aicomply.com` as sender
      and update the support line in `lib/email/templates.ts`.
- [ ] **Legal entity details** (name, address, VAT number) for the footer and
      legal pages.

## 2. Landing copy (all `[PLACEHOLDER]`)

- [ ] Hero eyebrow, headline (reference a real Article number), subhead
      — `components/landing/hero.tsx`
- [ ] Problem section — `content/landing/problem.md` (3–4 sentences, calm tone)
- [ ] Tier taglines + feature bullets — `lib/tiers.ts`
- [ ] Tier section intro line — `components/landing/tiers.tsx`
- [ ] Deliverable descriptions (2 sentences each) + confirm formats
      — `components/landing/deliverables.tsx`
- [ ] Persona descriptions — `components/landing/personas.tsx`
- [ ] About the author — `components/landing/about.tsx`
- [ ] FAQ (10 Q&As) — `components/landing/faq.tsx`
- [ ] Lead-magnet section blurb — `components/landing/lead-magnet-section.tsx`
- [ ] Final CTA copy — `components/landing/final-cta.tsx`
- [ ] Footer legal/VAT line — `components/landing/footer.tsx`
- [ ] **Testimonials** — intentionally empty. Add real ones once collected
      (`components/landing/testimonials.tsx`, marked `[TODO: add real testimonials]`).
- [ ] Site `<title>` / meta description — `app/layout.tsx`

## 3. Legal / consent (all `[PLACEHOLDER]`, in `content/legal/`)

- [ ] `consent-lead-magnet.md` — GDPR consent checkbox wording (shown on the form)
- [ ] `terms.md`
- [ ] `privacy.md` (list processors: Lemon Squeezy, Resend, R2, PostHog, host)
- [ ] `refunds.md` (EU 14-day withdrawal waiver pattern)
- [ ] `license-starter.md`, `license-pro.md`, `license-consultant.md`
      (Consultant = white-label rights)

> Legal pages currently render the raw markdown as plain text. If you want
> formatted rendering, add a markdown renderer — left out to keep deps minimal.

## 4. The six deliverables (compliance content — your domain)

Drafting notes live in each folder's README. **Do not** expect the code to
generate these.

- [ ] `content/deliverables/01-ai-literacy-training/` — slides, register, quiz, certificate, evidence checklist
- [ ] `content/deliverables/02-ai-system-register/` — spreadsheet schema + risk classification logic
- [ ] `content/deliverables/03-acceptable-use-policy/` — policy template
- [ ] `content/deliverables/04-annex-iv-lite/` — technical documentation skeleton
- [ ] `content/deliverables/05-ninety-day-roadmap/` — roadmap PDF
- [ ] `content/deliverables/06-vendor-due-diligence/` — vendor questionnaire

## 5. Files to upload to Cloudflare R2 (private bucket, `files/` prefix)

- [ ] `files/article-50-disclosure-pack.zip` (lead magnet)
- [ ] `files/toolkit-starter.zip`
- [ ] `files/toolkit-pro.zip`
- [ ] `files/toolkit-consultant.zip`
- [ ] `files/white-label-license.pdf`
- [ ] Record a Loom walkthrough → set `LOOM_WALKTHROUGH_URL`

## 6. External services to configure (see README walkthroughs)

- [ ] **Lemon Squeezy**: store, 3 products/variants (€49/€149/€399), webhook
      with signing secret, fill `LEMON_*` env vars. Test a purchase in test mode.
- [ ] **Cloudflare R2**: private bucket + API token; fill `R2_*` env vars.
- [ ] **Resend**: verify the `aicomply.com` sending domain (DKIM + SPF +
      DMARC DNS records), create API key + "ai-act-sme" audience.
- [ ] **PostHog** (optional): self-hosted EU instance URL + keys, or leave unset.
- [ ] **Admin**: set a strong `ADMIN_PASSWORD` (admin is locked until then).
- [ ] **Database**: provision Postgres, set `DATABASE_URL`, run
      `npx prisma migrate deploy`.
- [ ] **DNS**: point `bootcamp.ai-comply.ie` at the deployment; set
      `NEXT_PUBLIC_APP_URL` to match.

## 7. Known limitations to be aware of

- [ ] **Order country** is captured best-effort from the Lemon webhook
      (`tax_country`) and may be empty — Lemon's order payload doesn't reliably
      include the buyer country. Confirm against a real webhook payload and
      adjust `app/api/webhooks/lemon-squeezy/route.ts` if a better field exists.
- [ ] **Lead-magnet tags**: Resend audiences don't support per-contact tags via
      API, so `source:toolkit-lead-magnet` is stored in our DB only.
- [ ] No live chat / upsells / affiliate program / tracking pixels — by design.
