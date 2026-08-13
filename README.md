# Kinesmith — portfolio

Next.js 16 (App Router, TypeScript) + GSAP + Lenis. Static export —
`npm run build` emits a plain folder that drops onto any host.

**One theme, no switcher.** Ground `#070707`, accent `#DFFF00` (18:1 on the
ground, so `--ember-ink` is black — never put white on the accent). All tokens
live in the single `:root` block at the top of `globals.css`; there is no
`data-theme` attribute and nothing reads `prefers-color-scheme`.

`--ember-2` is a second accent slot that currently equals `--ember`. Only
`.shead__n` (the 01–05 section numbers) reads it — set it to a different colour
there if you ever want a two-accent scheme.

```bash
npm run dev      # http://localhost:3000
npm run build    # static site into ./out
```

## Where things are

```
app/layout.tsx        fonts, metadata, theme boot script
app/page.tsx          the page — hero, services, studio, process, contact
app/globals.css       all styling + the single :root palette
components/Motion.tsx Lenis + GSAP: intro, reveals, pinned rail, cursor, marquee
components/Nav.tsx    desktop nav, mobile menu, USD/INR switch
components/Work.tsx   horizontal work rail, lazy previews, lightbox
components/Pricing.tsx per-piece pricing, live currency conversion
lib/data.ts           ALL content + prices live here
lib/currency.tsx      USD/INR context, persisted to localStorage
public/video          web-encoded previews + full versions
public/poster         first-frame stills
_old-static-site/     the previous hand-written version — safe to delete
```

**Editing content or prices: `lib/data.ts` only.** Nothing is hard-coded in
components.

## Pricing model

Priced **per piece, not per month** — three groups (Short-form, Motion graphics
for SaaS, Documentary & brand film) plus scope-change surcharges.

USD is the source of truth. INR is derived at `USD_TO_INR` in `lib/data.ts`
(currently **88**) and rounded to the nearest hundred so it reads like a quote
rather than a converter output. **Update that constant when the rate drifts** —
nothing fetches a live rate, deliberately, so your prices never move on their own.

All three lines are entry-priced, below the published market bands, to win the
first clients. Raise them once the SaaS slots are filled and the reel carries
client names.

## Video

Two encodes per piece. The grid loads `*-preview.mp4` (540px, silent, ~1–2 MB)
and only decodes what's on screen; the full file loads on click. Never link the
4K masters from `Editing/ShortForms/Exports` — they're 200–400 MB each.

Adding a piece:

```bash
ffmpeg -i master.mov -an -vf "scale=540:-2" -c:v libx264 -preset slow -crf 30 \
  -pix_fmt yuv420p -movflags +faststart public/video/work-06-preview.mp4

ffmpeg -i master.mov -vf "scale=1080:-2" -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -movflags +faststart \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 128k public/video/work-06.mp4
```

Then add an entry to `WORK` in `lib/data.ts`. `kind: "motion" | "short"` sets
the corner tag.

### Landing the two 16:9 SaaS films

They do **not** go in `WORK` — that array is the vertical reel. They fill the
two reserved frames in the `.pipe` block, which swap themselves from placeholder
to playing video the moment `preview` is set. Three files, then four fields.

```bash
# 1. preview — silent, small, loops in the frame
ffmpeg -i master.mov -an -vf "scale=960:-2" -c:v libx264 -preset slow -crf 30 \
  -pix_fmt yuv420p -movflags +faststart public/video/saas-01-preview.mp4

# 2. full — loads only when someone clicks it open
ffmpeg -i master.mov -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -movflags +faststart \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 128k public/video/saas-01.mp4

# 3. poster — pick a real frame, not a transition or a white flash
ffmpeg -ss 00:00:04 -i master.mov -frames:v 1 -q:v 3 \
  -vf "scale=1280:-2" public/poster/saas-01.jpg

# measure it, don't estimate — this is the line under the frame
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height:format=duration -of default=nw=1 master.mov
```

Then in `SLOTS` (`lib/data.ts`):

```ts
{
  n: "A",
  title: "Acme — landing hero film",   // the real client + piece
  label: "Landing hero",
  stage: "",                            // only read while it's a placeholder
  preview: "/video/saas-01-preview.mp4",
  full:    "/video/saas-01.mp4",
  poster:  "/poster/saas-01.jpg",
  meta:    "62.0s · 1920×1080",         // from the ffprobe above
}
```

The block's heading, eyebrow and intro line rewrite themselves from how many
slots have a `preview` set — see `PIPE_COPY` in `components/Work.tsx`. Nothing
to hand-edit as the films land, and the page can't end up claiming both are
still in build when one has shipped.

Both slots are filled:

| Slot | Film | Files | Master |
|---|---|---|---|
| A | **PULSE — analytics product film** | `saas-01.*` | 18.4s, 1920×1080 @30, −14.5 LUFS |
| B | **SARA — AI workspace launch film** | `saas-02.*` | 13.5s, 3840×2160 @24, −14.6 LUFS |

Nothing in `SLOTS` is a placeholder now, so `PIPE_COPY` is on its third
variant. Adding a third film means adding a fourth entry to `PIPE_COPY` —
`Math.min(..., 2)` clamps to the last one, so the copy would otherwise go stale
silently.

## Motion

Lenis owns scrolling; GSAP's ticker steps it and ScrollTrigger listens to it.
That means three things must stay true:

- `scroll-behavior: smooth` must never come back in CSS — it fights Lenis.
- In-page anchors are intercepted in `Motion.tsx` and routed through
  `lenis.scrollTo`. A raw anchor jump would skip the smoothing.
- Anything that covers the page (lightbox, mobile menu) calls `lenis.stop()` /
  `lenis.start()` via `window.__lenis`, or the page scrolls behind it.

The work section has two blocks with deliberately opposite gestures. The reel
(finished vertical work) **slides past you**; the two in-build 16:9 films sit in
their own `.pipe` block below it and **open like an aperture** — each frame
scrub-reveals from a centre slit while the pair drifts together. Keep them
distinct: putting a horizontal film back into the vertical rail flattens both.

The reel is a **pinned horizontal rail** above 1025px: the section pins
and the track translates sideways for `track.scrollWidth - rail.clientWidth`
pixels. Below 1025px the identical markup is a native scroll-snap carousel and
nothing is pinned — that switch lives in one `gsap.matchMedia` block plus one
CSS media query, so keep the two breakpoints in sync.

`.rail` **must** keep `overflow: hidden` on desktop. The track is ~1.6k wider
than the viewport and without it the whole document gains that much horizontal
scroll.

GSAP is driven by `requestAnimationFrame`, which browsers **freeze in background
tabs**. If you open the page and nothing animates, check the window is focused —
that is not a bug. CSS transitions freeze the same way.

### One CSS trap worth knowing

Do **not** hand-write `-webkit-backdrop-filter` next to `backdrop-filter`.
Lightning CSS (Next's CSS pipeline) drops *both* declarations when you do, which
silently kills the frosted nav and lightbox. It adds the prefixes itself from
browserslist — the production bundle has them.

## Before this goes live

- **The two role lines in `PEOPLE` (`lib/data.ts`) are my assumption.** I wrote
  Pushpahas as "Edit & creative direction" and Ragavendhra as "Motion & design"
  because that's the usual split. Correct them if wrong — it's the only claim on
  the page I couldn't verify.
- `metadataBase` in `app/layout.tsx` points at `https://kinesmith.com`. Register
  the domain before publishing — or change it to wherever this actually lands.
- **Contact is a Gmail address and two Indian mobile numbers.** For a studio
  selling to US SaaS companies that is a visible tell. A domain address on the
  registered domain is the single cheapest credibility fix available.
- **No social links.** The contact section links WhatsApp only. Add LinkedIn and
  Instagram to `.contact__alt` in `app/page.tsx` when the accounts exist.
- **Piece 05 is a WhatsApp-compressed 720×1280 file** — noticeably softer than
  the other four. Re-encode from the real master when you have it.
- **Watch the loader and the pinned rail on a real focused window.** They were
  built and verified structurally, but a backgrounded automation tab freezes rAF
  so their timing was never observed running end to end.

## Deliberately absent

No client logos, no testimonials, no view-count claims. Everything on the page
is either your own work or a factual statement about how you work. Add social
proof only when it's real.
