"""Render the four missing AIComply deliverable cover images.

Matches the template used by the AI System Register and AI Acceptable Use
Policy covers shipped in the marketing kit:

  - 1200×1200 PNG, aubergine background
  - Top eyebrow (AICOMPLY · <line of business>)
  - Three lines of regulation text bleeding off both edges
  - Gold REG kicker
  - Two-line serif-bold title
  - Italic serif tagline (two lines)
  - Gold hairline + three-pillar small-caps strip
  - Bottom text band, AICOMPLY footer

Fonts: DejaVu Serif Bold (display), DejaVu Serif (regulation band),
Liberation Serif Italic (tagline), DejaVu Sans Bold (mono-tracked
eyebrow / kicker / pillars / footer).
"""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# --- Brand palette (matches lib/design-tokens.ts) ---------------------------
BG = (62, 31, 71)          # #3E1F47  aubergine
CREAM = (250, 246, 240)    # #FAF6F0
GOLD = (184, 153, 104)     # #B89968
BAND = (102, 79, 99)       # muted plum/taupe — barely-visible textured band

# --- Fonts -----------------------------------------------------------------
FONT_SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
FONT_ITALIC = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
FONT_SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# --- Canvas ----------------------------------------------------------------
W = H = 1200

# Vertical band positions (tuned to match the existing 2 covers).
EYEBROW_Y = 22
BAND_TOP_Y = 65
KICKER_Y = 235
TITLE_Y = 305
TAGLINE_Y_OFFSET = 40        # gap below the title block
HAIRLINE_Y = 880
PILLARS_Y = 910
BAND_BOT_Y = 985
FOOTER_Y = 1165


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def text_width(draw: ImageDraw.ImageDraw, s: str, f: ImageFont.FreeTypeFont) -> int:
    l, t, r, b = draw.textbbox((0, 0), s, font=f)
    return r - l


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    f: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking_px: int = 6,
) -> None:
    """Draw small-caps-style text with extra letter spacing, centered on W/2."""
    glyphs = list(text)
    widths = [text_width(draw, ch, f) for ch in glyphs]
    total = sum(widths) + tracking_px * (len(glyphs) - 1)
    x = (W - total) // 2
    for ch, w in zip(glyphs, widths):
        draw.text((x, y), ch, font=f, fill=fill)
        x += w + tracking_px


def draw_band(
    draw: ImageDraw.ImageDraw,
    text: str,
    y_start: int,
    n_lines: int,
    f: ImageFont.FreeTypeFont,
) -> None:
    """Repeating regulation text — bleeds off both edges, three or four
    lines stacked. Each line gets a different negative x offset so the
    seams between repeats don't visibly align across rows."""
    # Repeat enough times to span more than the canvas width.
    one_line_w = text_width(draw, text + "  ", f)
    repeats = max(2, (W // max(1, one_line_w)) + 3)
    rep = (text + "  ") * repeats
    line_h = f.size + 8
    offsets = [-180, -460, -740, -300]  # off-screen-left offsets per row
    for i in range(n_lines):
        draw.text((offsets[i % len(offsets)], y_start + i * line_h), rep, font=f, fill=BAND)


def draw_title(draw: ImageDraw.ImageDraw, lines: list[str]) -> int:
    """Centered two- or three-line title. Returns the y just below the
    last line (for the tagline to anchor against)."""
    # Pick the biggest size that fits the widest line within ~88% of canvas.
    target_w = int(W * 0.86)
    size = 170
    while size > 90:
        f = font(FONT_SERIF_BOLD, size)
        widest = max(text_width(draw, ln, f) for ln in lines)
        if widest <= target_w:
            break
        size -= 4
    f = font(FONT_SERIF_BOLD, size)
    line_h = int(size * 1.05)
    block_h = line_h * len(lines)
    # Vertically anchor the block so it occupies the middle band.
    y0 = TITLE_Y
    for i, ln in enumerate(lines):
        w = text_width(draw, ln, f)
        draw.text(((W - w) // 2, y0 + i * line_h), ln, font=f, fill=CREAM)
    return y0 + block_h


def draw_tagline(draw: ImageDraw.ImageDraw, lines: list[str], y_after_title: int) -> None:
    f = font(FONT_ITALIC, 44)
    line_h = 56
    y = y_after_title + TAGLINE_Y_OFFSET
    for i, ln in enumerate(lines):
        w = text_width(draw, ln, f)
        draw.text(((W - w) // 2, y + i * line_h), ln, font=f, fill=GOLD)


def render(out_path: Path, cover: dict) -> None:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Eyebrow — AICOMPLY · BOOTCAMP / TOOLKIT / DOCS
    f_eyebrow = font(FONT_SANS_BOLD, 22)
    draw_tracked(d, cover["eyebrow"], EYEBROW_Y, f_eyebrow, CREAM, tracking_px=8)

    # Top regulation band
    f_band = font(FONT_SERIF, 48)
    draw_band(d, cover["band_text"], BAND_TOP_Y, 3, f_band)

    # REG kicker
    f_kicker = font(FONT_SANS_BOLD, 22)
    draw_tracked(d, cover["kicker"], KICKER_Y, f_kicker, GOLD, tracking_px=8)

    # Title (two lines)
    y_after = draw_title(d, cover["title_lines"])

    # Tagline (italic, two lines)
    draw_tagline(d, cover["tagline_lines"], y_after)

    # Gold hairline
    rule_w = 170
    rule_x0 = (W - rule_w) // 2
    d.line([(rule_x0, HAIRLINE_Y), (rule_x0 + rule_w, HAIRLINE_Y)], fill=GOLD, width=2)

    # Three-pillar strip
    f_pillars = font(FONT_SANS_BOLD, 22)
    draw_tracked(d, cover["pillars"], PILLARS_Y, f_pillars, GOLD, tracking_px=8)

    # Bottom regulation band
    draw_band(d, cover["band_text"], BAND_BOT_Y, 3, f_band)

    # Footer
    f_footer = font(FONT_ITALIC, 22)
    footer = "AICOMPLY  ·  v1.0  ·  May 2026"
    fw = text_width(d, footer, f_footer)
    d.text(((W - fw) // 2, FOOTER_Y), footer, font=f_footer, fill=GOLD)

    img.save(out_path, "PNG", optimize=True)
    print(f"wrote {out_path} ({out_path.stat().st_size // 1024} KB)")


COVERS = {
    "ai-literacy-training": {
        "eyebrow": "AICOMPLY  ·  BOOTCAMP",
        "band_text": (
            "providers and deployers shall take measures to ensure to their best "
            "extent a sufficient level of AI literacy of their staff and other "
            "persons dealing with the operation and use of AI systems"
        ),
        "kicker": "EU AI ACT  ·  ARTICLE 4",
        "title_lines": ["AI Literacy", "Training Pack"],
        "tagline_lines": [
            "Article 4 evidenced —",
            "trainer’s guide, three tiers, one dossier",
        ],
        "pillars": "FIVE COMPONENTS  ·  THREE TIERS  ·  ONE DOSSIER",
    },
    "annex-iv-techdoc": {
        "eyebrow": "AICOMPLY  ·  DOCS",
        "band_text": (
            "the technical documentation of a high-risk AI system shall be drawn up "
            "before that system is placed on the market or put into service and "
            "shall be kept up to date thereafter"
        ),
        "kicker": "EU AI ACT  ·  ARTICLE 11  ·  ANNEX IV",
        "title_lines": ["Annex IV", "Technical File"],
        "tagline_lines": [
            "Simplified-form skeleton",
            "for European SME providers",
        ],
        "pillars": "NINE SECTIONS  ·  TWO WORKBOOKS  ·  ONE DOSSIER",
    },
    "90-day-roadmap": {
        "eyebrow": "AICOMPLY  ·  TOOLKIT",
        "band_text": (
            "classification first — Article 6 turns on the intended purpose of the "
            "system, not on the tool itself, and an SME that finds no high-risk "
            "systems has a lighter obligation set than the full programme implies"
        ),
        "kicker": "EU AI ACT  ·  REG (EU) 2024/1689",
        "title_lines": ["90-Day", "Roadmap"],
        "tagline_lines": [
            "A plan that tells you",
            "which weeks you can skip",
        ],
        "pillars": "FOURTEEN WEEKS  ·  ONE TRACKER  ·  ONE QUICKSTART",
    },
    "vendor-due-diligence": {
        "eyebrow": "AICOMPLY  ·  TOOLKIT",
        "band_text": (
            "providers of high-risk AI systems shall make available to deployers "
            "the information necessary to enable Article 26 compliance and to "
            "verify conformity assessment status before procurement"
        ),
        "kicker": "EU AI ACT  ·  ARTICLES 16 + 26",
        "title_lines": ["Vendor Due", "Diligence"],
        "tagline_lines": [
            "The questions to ask",
            "before you sign or renew",
        ],
        "pillars": "ARTICLE 16  ·  CONFORMITY  ·  POST-MARKET",
    },
}


def main() -> None:
    out_dir = Path(__file__).resolve().parents[1] / "public" / "marketing" / "covers"
    out_dir.mkdir(parents=True, exist_ok=True)
    for slug, spec in COVERS.items():
        render(out_dir / f"{slug}.png", spec)


if __name__ == "__main__":
    main()
