# Public marketing assets

Covers and carousels referenced from the landing page and per-deliverable
product pages. These files are served at `/marketing/...` on the storefront.

## Naming convention

```
public/marketing/
├── covers/
│   ├── ai-literacy-training.png            [TODO]
│   ├── system-register.png                 ✓ shipped
│   ├── acceptable-use-policy.png           ✓ shipped
│   ├── annex-iv-techdoc.png                [TODO]
│   ├── 90-day-roadmap.png                  [TODO]
│   └── vendor-due-diligence.png            [TODO]
└── carousels/
    ├── system-register.pdf                 ✓ shipped
    └── acceptable-use-policy.pdf           ✓ shipped
```

Each filename matches the deliverable's `slug` in `lib/deliverables.ts` —
that's how the page components look them up. Drop new covers / carousels in
under the same naming and they'll be picked up automatically.

## Cover specs

- Square, 1200×1200 PNG
- Brand fonts (Fraunces + Inter) — see the original marketing-kit README for
  font substitution caveats
- Brand palette per `lib/design-tokens.ts`

## Carousels

Multi-slide PDFs (e.g. ~6 slides). Used as "See a sample (PDF)" links from
the product page hero. Optional per deliverable.
