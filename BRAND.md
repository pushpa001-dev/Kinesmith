# Kinesmith — agency & brand report

Full written record of the agency as it exists on the site today: positioning,
voice, palette, type, motion, services, pricing, work, and the build log.
Everything below is what the live page actually says — no aspirational copy.

Generated 13 August 2026. Repo `pushpa001-dev/Kinesmith`, branch `main`.

---

## 1. The agency

**Kinesmith.** A two-person video post studio. Not an agency in the staffed
sense — there is no account layer, no junior queue, no one to hand footage down
to. Both people cut.

| | |
|---|---|
| People | Pushpahas, Ragavendhra |
| Model | Per-piece, not retainer |
| Primary market | US B2B SaaS |
| Secondary | Documentary / founder film |
| Email | `kinesmith21@gmail.com` |
| WhatsApp | +91 93920 47174 · +91 63027 56369 |
| Social | None yet — no LinkedIn, no Instagram |
| Turnaround claim | 48 hrs |
| Delivery claim | 4K vertical |

**Three lines of work, one standard:**

- **L1 — Short-form.** Reels, Shorts, TikTok cut from existing long-form.
  Three written hooks per video. Word-level captions, sourced inserts,
  platform-correct exports.
- **L2 — Motion systems.** Custom easing curves, type stack, transition
  grammar, sound signature — built once, inherited by everything after.
- **L3 — Documentary post.** You shoot, we build the story. Paper edit,
  assembly, grade, sound, titles, plus the cutdown pack.

### Positioning

The whole page argues one thing: **a person decided every frame.** That is the
only defensible claim against generative video, and it is the axis every
headline, service line and price row is written along.

The hero states it directly — *"The first three seconds decide everything"* —
and the work section header is literally *"Every frame decided by a person."*

### The offer

> Send one video you weren't happy with. We re-cut the first fifteen seconds,
> free, no call required.

This is the only call-to-action on the page. It repeats in three places: the
end of the work rail, the contact section, and the mailto subject line.

### Voice

Short declaratives. No adjective stacking. Numbers wherever a number exists —
every runtime on the page was measured with `ffprobe`, not estimated, and the
page says so out loud.

**Deliberately absent, and it should stay that way:** no client logos, no
testimonials, no view-count claims, no "trusted by". Everything on the page is
either the studio's own work or a factual statement about how it works. There
was a fake "● LIVE" badge in an early draft; it was removed. Add social proof
only when it is real.

---

## 2. Brand palette

One theme. Near-black room, one acid accent. The metaphor is a grading suite:
the room is dark so the work is the only lit thing in it.

All tokens live in a single `:root` block at the top of `app/globals.css`.
There is no theme switcher, no `data-theme` attribute, and nothing reads
`prefers-color-scheme`.

### Core tokens

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#070707` | The room. Page ground. |
| `--bg-2` | `#0B0B0B` | Recessed panel — menus, popovers. |
| `--card` | `#111111` | Lifted surface — cards, media wells. |
| `--ink` | `#F5F5F5` | Primary text, headlines. |
| `--ink-2` | `#BDBDBD` | Body copy, secondary lines. |
| `--steel` | `#7A7A7A` | Labels, captions, muted meta. |
| `--rule` | `#1D1D1D` | Hairline dividers. |
| `--rule-2` | `#303030` | Visible borders, pills, chips. |
| `--ember` | `#DFFF00` | **The accent.** Acid yellow. |
| `--ember-ink` | `#0A0A0A` | Text placed *on* the accent. Always dark. |
| `--ember-2` | = `--ember` | Second-accent slot; only `.shead__n` reads it. |
| `--glow` | `rgba(223,255,0,.16)` | Accent at 16% — bloom and shadows. |

### Contrast, measured

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--bg` | **18.5:1** | AAA |
| `--ink-2` on `--bg` | **10.7:1** | AAA |
| `--steel` on `--bg` | **4.69:1** | AA (clears 4.5) |
| `--ember` on `--bg` | **17.7:1** | AAA |
| `--ember-ink` on `--ember` | **17.4:1** | AAA |

**Hard rule: never put white on `#DFFF00`.** It is a light accent — white on it
is roughly 1.06:1, invisible. That is why `--ember-ink` exists and why every
filled-accent surface (buttons on hover, the "Most chosen" price tag, the play
button, the lightbox close) reads `var(--ember-ink)`.

### Where the accent is allowed

Rationed on purpose. It appears on: the wordmark dot, the italic hero phrase
*three seconds*, section numbers, the eyebrow dot, the scroll-progress bar, card
indices and tags, the play button on hover, the currency-switch pill, price
currency symbols, the "Most chosen" tag, addon values, and the marquee dashes.

Nothing else. If the accent starts appearing on body copy or backgrounds, the
grading-suite idea collapses.

### The mark

There is no pictorial logo and deliberately none is needed — the brand is
carried by the **wordmark**: `Kinesmith` set in Inter Black, tracked `-.03em`,
with a small accent disc beside it (`.nav__glyph`, a conic gradient). It appears
in the nav, the footer, and as the entire loader animation.

For the places a square icon is mandatory — browser tab, iOS home screen,
social avatars — there is a **geometric `K`**, accent on ground:

```
viewBox 0 0 100 100        ground #070707, K #DFFF00, corner radius 22
stem  rect  16,20 → 31,80
arm   poly  20,50 · 62,20 · 84,20 · 42,50
leg   poly  20,50 · 42,50 · 84,80 · 62,80
```

Drawn as three polygons, no font dependency, so it renders identically anywhere.
The arm and leg are true parallelograms sharing an edge at `y=50`, and both
begin at `x=20` so they overlap the stem (16–31) rather than meeting it at a
single point — that overlap is what stops the join breaking up at 16px.

| File | Size | Purpose |
|---|---|---|
| `app/icon.svg` | vector | browser tab, any size |
| `app/favicon.ico` | 16/32/48/64 | legacy fallback |
| `app/apple-icon.png` | 180 | iOS home screen |
| `~/Downloads/kinesmith-mark-1080.png` | 1080 | social avatars |
| `~/Downloads/kinesmith-mark-512.png` | 512 | smaller avatar slots |

Next wires the three in `app/` automatically from the file convention — there
are no `<link>` tags to maintain. Verified legible at 16px.

### Surface treatments

- **Film grain** — fixed SVG `feTurbulence` overlay, 5.5% opacity,
  `mix-blend-mode: overlay`, stepped 6-frame shuffle over 7s. Hidden entirely
  under `prefers-reduced-motion`.
- **Shadows** — two rungs, both near-black rather than tinted:
  `--sh-1: 0 2px 6px rgba(0,0,0,.5), 0 24px 54px -34px #000`
  `--sh-2: 0 4px 12px rgba(0,0,0,.6), 0 64px 110px -50px #000`
- **Radii** — pills at `100px` for anything interactive and small; `14px` on
  popovers; media wells square-ish. No mid-size rounded rectangles.

---

## 3. Typography

Two families, both self-hosted at build time via `next/font/google`.

| | Family | Where |
|---|---|---|
| Display | **Inter** | Every headline, all tracked technical labels, all numerals |
| Text | **DM Sans** | Every line of running copy |

**Inter is only ever used at Black (900) or at Medium/Semibold for the small
tracked labels.** There is no 400-weight Inter anywhere. The tension between
tight-tracked 900 display and wide-tracked 11px labels is the whole type idea.

### Scale

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Hero H1 | `clamp(38px, 5.6vw, 86px)` | 900 | `-.048em` |
| Contact H2 | `clamp(34px, 5.4vw, 78px)` | 900 | `-.052em` |
| Section H2 | `clamp(30px, 4.3vw, 62px)` | 900 | `-.045em` |
| Person name | `clamp(34px, 5vw, 70px)` | 900 | `-.055em` |
| Service title | `clamp(25px, 3vw, 42px)` | 900 | `-.042em` |
| Pipe heading | `clamp(24px, 3.2vw, 46px)` | 900 | `-.045em` |
| Price figure | `clamp(26px, 2.5vw, 36px)` | 900 | `-.05em`, tabular |
| Price name | `19px` | 900 | `-.032em` |
| Body | `16.5px` / hero sub `clamp(15.5, 1.15vw, 17.5)` | 400 | — |
| `.mono` label | `11px` | 500 | `+.10em` |
| Eyebrow | `11.5px` | — | `+.11em` |
| Card tag | `9.5px` | — | `+.13em` uppercase |

Display tracking tightens as size grows — the bigger the type, the more negative
the letter-spacing. Labels do the opposite. Numerals are `tabular-nums`
everywhere they can change (prices, stats, durations) so nothing jitters.

Measure is capped at `44ch` on the hero sub and `max-width` on notes; headlines
use `text-wrap: balance`.

---

## 4. Motion language

Lenis owns scrolling. GSAP's ticker steps it; ScrollTrigger listens to it.

```
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add(t => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

Three rules that must stay true or the whole thing desyncs:

1. `scroll-behavior: smooth` must never come back in CSS — it fights Lenis.
2. In-page anchors are intercepted and routed through `lenis.scrollTo`.
3. Anything covering the page (lightbox, mobile menu) calls
   `lenis.stop()` / `.start()` via `window.__lenis`.

### Inventory

| Moment | Gesture |
|---|---|
| **Loader** | Wordmark scales 7.5 → 1 (expo.out, 1.15s), holds 0.32s, punches 1 → 9 (expo.in, 0.8s), then a curtain wipes up via `clip-path`. Hard ceiling 3.6s; releases instantly if the tab is hidden. |
| **Intro** | Nav drops in; hero lines rise from masked overflow, staggered 0.08; player fades and settles; sub, CTA, stats follow; the 48/2 counters run. |
| **Work reel** | Above 1025px the section **pins** and the track slides sideways for `scrollWidth - clientWidth`. Velocity-driven `skewX` on the track. Below 1025px the same markup is a native `scroll-snap` carousel — nothing pins. |
| **SaaS films** | Deliberately the **opposite gesture**: each 16:9 frame scrub-reveals from a centre slit (`clip-path: inset(0 50% 0 50%)` → `0`), the pair drifts together from ±9%, and the media scales 1.14 → 1. |
| **Headings** | Line-by-line rise from masked containers on `ScrollTrigger.batch`. |
| **Buttons** | `::before` fill sweeps up from below; text sits in a `<span>` above it. Magnetic hover on `.magnet`. |
| **Cursor** | Custom dot + ring on fine pointers only; ring fills with the accent and shows a word (`Play`, `Mail`) over `[data-cursor]` targets. Hidden on coarse pointers. |
| **Marquee** | Infinite horizontal loop, dashes in the accent. |
| **Progress** | 2px accent bar, top of viewport, scaled to scroll. |

Easing is two curves, used everywhere:
`--e-out: cubic-bezier(.16,1,.3,1)` and `--e-soft: cubic-bezier(.4,0,.2,1)`.

`prefers-reduced-motion` kills grain, the custom cursor, and clamps every
animation and transition to 0.001ms.

> **The reel slides. The films open.** Those two gestures must stay distinct —
> putting a horizontal film back into the vertical rail flattens both.

---

## 5. Pricing

Priced **per piece, not per month.** No retainer to fill, no unused quota, no
minimum term. The price is on the page so neither side wastes a call finding out
they are far apart.

USD is the source of truth. INR is derived at `USD_TO_INR = 88` and rounded to
the nearest hundred.

### Short-form — per video

| Tier | USD | INR | Scope |
|---|---|---|---|
| Standard cut | **$60** | ₹5,300 | Up to 60s. Assembly, word-level captions, sourced inserts, one hook, all aspect ratios. |
| **Advanced cut + motion graphics** ★ | **$130** | ₹11,400 | Everything above plus custom on-brand motion graphics, three written hook variants, full grade. |

### Motion graphics, SaaS — per video

| Tier | USD | INR | Scope |
|---|---|---|---|
| Feature explainer | **$400** | ₹35,200 | Up to 30s. Script pass, storyboard, custom vector build, VO sync, sound design. |
| **Product explainer** ★ | **$500** | ₹44,000 | 60s. Full narrative build, isometric dashboard UI, custom camera choreography. |
| Homepage hero film | **$600** | ₹52,800 | 90s. The flagship piece — anchors the site and the launch. |

### Documentary & brand film — per film

| Tier | USD | INR | Scope |
|---|---|---|---|
| Customer story | **$500** | ₹44,000 | Up to 2 min. Structure, grade, mix, lower thirds, three social cutdowns. |
| **Founder film** ★ | **$650** | ₹57,200 | 2–4 min. Archival integration, custom title package, six cutdowns. |
| Long-form documentary | **from $800** | from ₹70,400 | 6–10 min. Full paper edit, sound design, licensed score, nine cutdowns. |

★ = marked "Most chosen" on the page.

### Scope changes

Quoted upfront, never discovered on the invoice. Two revision rounds per stage
are included in every price above.

| | |
|---|---|
| Rush delivery, under 48h | +35% |
| Source files released | +30% |
| Perpetual buyout | +25% |
| Extra revision round | $25 |
| Additional language | $35 |
| Runtime beyond scope | $4/sec |

### Pricing rationale, stated plainly

All three lines sit **below** the published 2026 market bands (short-form
commonly $50–$250/video; SaaS motion $500–$2,500 for 30s; documentary post far
above this per finished minute). That is deliberate entry pricing — a two-person
studio with no client roster wins on price and craft, not on rate card. Raise
them once the SaaS slots are filled and the reel carries client names.

The ladder now reads cleanly end to end: **$60 → $130 → $400 → $600 → $800.**
A 90-second SaaS hero film at $600 and a 10-minute documentary at $800 are the
two ends of it, and nothing on the page jumps a tier.

**One inconsistency to be aware of:** scope-change values are literal strings, so
they **stay in dollars even when the page is switched to INR.** Fixable by moving
them to numbers, but it currently means an Indian client sees ₹ prices and $
surcharges side by side.

---

## 6. The work

### Reel — five finished vertical pieces

| # | Piece | Runtime | Master | Kind |
|---|---|---|---|---|
| 01 | Founder podcast — retention cut | 51.1s | 2160×3840 | Short-form |
| 02 | Long-form → cinematic short | 64.0s | 2160×3840 | Short-form |
| 03 | Data-led viral cut | 36.6s | 2160×3840 | Motion |
| 04 | Product explainer — motion system | 30.0s | 1080×1920 | Motion |
| 05 | Title sequence — 2.5D composite | 10.2s | 720×1280 | Motion |

Piece 03 also runs silently in the hero player.

Every runtime and cut-rate above was measured with `ffprobe` on the delivered
master. The page says this explicitly under the section heading.

### SaaS 16:9 films — both slots shipped

| Slot | Piece | Runtime | Master | Loudness |
|---|---|---|---|---|
| A | **PULSE** — analytics product film | 18.4s | 1920×1080 @30 | −14.5 LUFS |
| B | **SARA** — AI workspace launch film | 13.5s | 3840×2160 @24 | −14.6 LUFS |

*PULSE* opens on consumer brand marks over "Every business generates data",
turns on "Data alone —", reveals the mark, then walks the landing page and
dashboard UI through "Complex metrics" → "Clear actionable insights" → "Just the
answers you need." Light blue and white throughout, which reads as a lit panel
against the near-black page.

These live in their own `.pipe` block below the reel, never inside it. The
block's eyebrow, headline and intro line **rewrite themselves** from how many
slots have a video. With both filled it now reads *"Built frame by frame against
the product"* — it moved off the in-build wording on its own, with no edit.

### Video pipeline

Two encodes per piece. The grid loads `*-preview.mp4` (silent, ~1–2 MB) and
decodes only what is on screen via IntersectionObserver; the full file loads on
click. The 4K masters in `Editing/ShortForms/Exports` are 200–400 MB and are
never linked from the site.

Audio is normalised to `loudnorm=I=-14:TP=-1.5:LRA=11` and verified with
`ebur128`. Every file gets `-movflags +faststart`. Poster frames are picked from
sampled candidates, never guessed — SARA's opening is a white blowout and its
tail fades to black, so both ends were unusable.

Full ffmpeg recipes are in `README.md`.

---

## 7. The site

| | |
|---|---|
| Framework | Next.js 16.3.0, App Router, Turbopack |
| Runtime | React 19.2.8 |
| Language | TypeScript |
| Motion | GSAP 3.15 + ScrollTrigger |
| Scroll | Lenis 1.3.26 |
| Output | `output: "export"` — static folder, drops on any host |
| Dependencies | Five. That is the whole list. |

```
app/layout.tsx          fonts, metadata
app/page.tsx            hero, services, studio, process, contact
app/globals.css         all styling + the single :root palette
components/Motion.tsx   Lenis + GSAP: intro, reveals, pinned rail, cursor
components/Nav.tsx      desktop nav, mobile menu, USD/INR switch
components/Work.tsx     work rail, SaaS slots, lightbox
components/Pricing.tsx  price rows, live currency conversion
components/Loader.tsx   wordmark punch + curtain wipe
lib/data.ts             ALL content and prices live here
lib/currency.tsx        USD/INR context, persisted to localStorage
public/video, /poster   encoded previews, full versions, stills
_old-static-site/       the previous hand-written version — safe to delete
```

**To change any content or price, edit `lib/data.ts`.** Nothing is hard-coded in
components.

### Page order

Hero → marquee → 01 Work → 02 Services → 03 Studio → 04 Process → 05 Pricing →
Contact → Footer.

### Responsive

- **> 1025px** — pinned horizontal reel, two-up SaaS grid, full nav.
- **≤ 1024px** — reel becomes a native scroll-snap carousel, nothing pins.
- **≤ 1040px** — nav links and the nav CTA collapse into the burger.
- **≤ 860px** — SaaS slots stack; the paired drift is disabled.

The 1024/1025 pair exists in exactly two places — one `gsap.matchMedia` block
and one CSS media query. Keep them in sync.

---

## 8. Build log

Chronological, what actually happened:

1. **Rebuilt from a hand-written static site to Next.js.** The old version
   survives in `_old-static-site/` and can be deleted.
2. **Dark-first redesign.** Palette, type scale, motion language, loader,
   custom cursor, grain, scroll progress. Removed a fake "● LIVE" badge.
3. **Lenis wired to GSAP** and the sticky nav rebuilt off the scroll position
   directly — a trigger-less `ScrollTrigger.create({start:26})` never reports
   active because it has no valid end, so the nav had been transparent over
   content the entire page.
4. **Pinned horizontal reel** built, with the mobile scroll-snap fallback.
5. **SaaS films moved out of the vertical rail** into their own block with the
   opposite gesture — a centre-slit aperture reveal.
6. **SARA landed in Slot B** — encoded to preview/full/poster, runtime measured,
   poster picked from six sampled candidates.
7. **Six audition palettes added**, then **cut back to one.** Yellow won; the
   picker, the boot script, the `data-theme` attribute and five palette blocks
   were deleted.
8. **Pricing reset** to the current numbers, scope-change fees rescaled, and INR
   rounding changed from nearest-thousand to nearest-hundred — at a $60 line the
   thousand-rounding was silently giving away 5%.
9. **Hero glow removed** — the radial accent bloom that followed the pointer,
   along with its mousemove handler.

### Traps found the hard way, documented so they aren't rediscovered

- **Lightning CSS drops `backdrop-filter` entirely** if you hand-write
  `-webkit-backdrop-filter` next to it. It adds the prefix itself from
  browserslist. This silently killed the frosted nav and lightbox.
- **`.rail` must keep `overflow: hidden` on desktop.** The track is ~1,600px
  wider than the viewport; without it the document gains that much horizontal
  scroll.
- **`scroll-padding-inline` is load-bearing** on the mobile carousel, or
  scroll-snap eats the left padding and the first card sits flush at x=0.
- **A class named `.cur` already exists** — it is the currency symbol in price
  rows. Naming the cursor container `.cur` made every `$` invisible.
- **Background tabs freeze `requestAnimationFrame` *and* CSS transitions.** If
  nothing animates, check the window is focused. That is not a bug.

---

## 9. Open before launch

- **Confirm the two role lines in `PEOPLE`.** "Edit & creative direction" for
  Pushpahas and "Motion & design" for Ragavendhra were assumed from the usual
  split. It is the only claim on the page that has not been verified.
- `metadataBase` points at `https://kinesmith.com`. Register the domain, or
  change it to wherever the site actually lands.
- **Move off Gmail.** `kinesmith21@gmail.com` and two Indian mobile numbers are
  the least convincing thing on a page selling to US SaaS companies — everything
  else on it reads like a studio. An address on the registered domain is the
  cheapest credibility available, and it costs nothing to forward to the same
  inbox.
- **No social presence.** The contact section links WhatsApp only. US B2B buyers
  check LinkedIn; nothing on the page currently survives that check.
- **Piece 05 is a WhatsApp-compressed 720×1280 file** — visibly softer than the
  other four. Re-encode from the real master.
- **"Brand motion kit" still appears as a Services tag with no price row behind
  it** — the $4,500 row was removed when SaaS was capped at $600.
- **Confirm PULSE and SARA can be shown publicly.** Both are named client
  products on the page; if either was spec work or is under NDA, the title needs
  changing before launch.
- **Nothing is committed yet.** The remote exists; the working tree does not.
- **Watch the loader and the pinned rail on a real focused window.** Both were
  verified structurally, but a backgrounded automation tab freezes rAF, so their
  timing has never been observed running end to end.
