# andyodore.com

Personal site built from the [`ao website 2026`](https://www.figma.com/design/gkKl2lktE7l8lkrbdG2pIK/ao-website-2026?node-id=29-2651) Figma file (frame `Home`, node `29:2651`).

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Design tokens

Colors, type sizes, and the font stack come straight from the Figma frames and live
in `src/app/globals.css`. The desktop frame is 1728px wide with a 1636px content
column and 46px gutters, which is what `max-w-[1636px]` and `xl:px-[46px]` reproduce.

`globals.css` splits color into a raw palette (`--espresso`, `--parchment`,
`--taupe`, `--amber`, …) and semantic slots (`--canvas`, `--ink`, `--muted`,
`--lede`, `--accent`, `--rule`, `--monogram-*`). Only the slots get remapped per
theme, and `@theme inline` makes the Tailwind utilities point at the variables
rather than copying their values, so a theme switch needs no extra classes.

## Dark mode

Driven by `prefers-color-scheme`, with values from Figma node `33:700`. Two things
in that frame don't follow a simple invert:

- the subtitle goes from muted brown to amber, so it has its own `--lede` slot
  rather than sharing `--muted` with the body copy
- the monogram inverts — its ring becomes taupe and its glyph becomes the canvas
  color — while section labels stay amber, so the monogram can't reuse `--accent`

Home card labels and the tints behind those card photos are deliberately fixed in
both themes, since they sit on top of the photography. The prev/next cards carry no
photo, so they follow the theme like everything else.

## Case study palettes

Each case study owns a canvas and an ink (`--strategy-*`, `--post-office-*`,
`--campaign-*`), and `html:has([data-case-study])` points the semantic slots at the
right pair — on the document root rather than a wrapper, so the body background and
the scrollbar pick them up too.

The prev/next cards at the foot of a case study are painted in the palette of the
project they lead to, which is why those pairs are named variables rather than
inline values. A `.palette-*` class on the card rebinds `--canvas` and `--ink`
locally, so `bg-canvas` and `text-ink` inside it resolve to the destination's
colors with no second set of Tailwind tokens. The class can't be replaced by a
`data-case-study` attribute on the card: that selector is unscoped, so a second
match would repaint the whole page.

## Theme toggle

The control in the header (Figma nodes `41:1306` light / `41:1323` dark) is a
32x32 circular button showing a moon in light mode and a sun in dark mode.

With no stored preference the site follows the OS. Clicking stores a choice in
`localStorage` and puts `.theme-light` or `.theme-dark` on `<html>`, which only
has to set `color-scheme` — `light-dark()` does the rest, so no component carries
a `dark:` variant. `themeScript` in `src/lib/theme.ts` runs in the document head
before first paint so a stored choice never flashes, which is also why `<html>`
needs `suppressHydrationWarning`.

The button renders both icons and lets CSS pick one, so the right icon is in the
first paint rather than appearing after hydration. The two `sr-only` labels and
the two hover tooltips ("Nighty night" / "Wake me up") are swapped the same way.
No CSS selector can read a `color-scheme`, so that swap is the one place the
media query and override class are spelled out by hand.

The tooltips are `aria-hidden` flavor text; the `sr-only` labels remain the
accessible name so screen readers and voice control get the actual action rather
than the joke. They're right-aligned under the button because the button sits on
the content edge and a centred bubble would overhang the viewport on mobile.

Figma gives the icon stroke as `#2a170f` in *both* frames, which would be
invisible on the dark canvas — the dark artboard sits loose beside the light one
and kept its stroke from the duplicate. The stroke is bound to `--ink` instead:
exactly `#2a170f` in light, parchment in dark.

## Two things to swap in

**The display typeface.** The headline is set in Canela Trial, a licensed face
from Commercial Type that can't be fetched from a CDN. Cormorant Garamond Light
stands in for it. To use the real thing, drop the web fonts into the project, load
them with `next/font/local`, and expose them as `--font-canela`; the
`--font-display` stack in `globals.css` already prefers `"Canela"` over the
fallback, so nothing else needs to change. Canela is a little wider than Cormorant,
so the headline will reflow slightly when you do.

**Social URLs.** The Figma frame has icons but no links, so `src/components/site-footer.tsx`
points at generic profile URLs and `mailto:aodore@gmail.com`. Replace them with
real handles.

## Images

`public/images/*.webp` are the three card photos, cropped to the exact window each
card clips in Figma (535x700 at 2x) so `object-cover` needs no offset. They came out
of the Figma REST API at 4096x3072 PNG (75MB total) and are 628KB as cropped WebP.
The `*-nav.webp` landscape crops are unreferenced — the prev/next cards now use flat
color — and can be deleted if that isn't going to be reversed.
The logos, monogram, and social icons are inlined as React components in
`src/components/brand.tsx`.

To re-export assets you'll need a Figma token with the `file_content:read` scope.
