# Public marketing assets

Covers and carousels referenced from the landing page and per-deliverable
product pages. These files are served at `/marketing/...` on the storefront.

## Naming convention

```
public/marketing/
├── covers/
│   ├── ai-literacy-training.png            ✓ shipped
│   ├── system-register.png                 ✓ shipped (marketing kit)
│   ├── acceptable-use-policy.png           ✓ shipped (marketing kit)
│   ├── annex-iv-techdoc.png                ✓ shipped
│   ├── 90-day-roadmap.png                  ✓ shipped
│   └── vendor-due-diligence.png            ✓ shipped
└── carousels/
    ├── system-register.pdf                 ✓ shipped (marketing kit)
    └── acceptable-use-policy.pdf           ✓ shipped (marketing kit)
```

Each filename matches the deliverable's `slug` in `lib/deliverables.ts` —
that's how the page components look them up. Drop new covers / carousels in
under the same naming and they'll be picked up automatically.

## Cover specs

- Square, 1200×1200 PNG
- Aubergine background (`#3E1F47`), cream type, gold accents
- Brand fonts (Fraunces + Inter). The two marketing-kit covers (Register +
  AUP) and the four storefront-generated covers all use DejaVu Serif / Sans
  as substitutes — see the marketing-kit README for the font-substitution
  caveat. Re-render with Fraunces + Inter installed for hi-res / print use.

## How the four storefront-generated covers were made

`scripts/render-covers.py` produces the AI Literacy, Annex IV, 90-Day
Roadmap, and Vendor Due Diligence covers in the same template as the
marketing-kit Register and AUP covers. Re-run to regenerate:

```
python3 scripts/render-covers.py
```

Edit the `COVERS` dict in the script to change titles, taglines, regulation
band excerpts, or pillar strings.

## Carousels

Multi-slide PDFs (e.g. ~6 slides). Used as "See a sample (PDF)" links from
the product page hero. Optional per deliverable — render carousels for the
other four if you want sample-PDF CTAs on every product page.
