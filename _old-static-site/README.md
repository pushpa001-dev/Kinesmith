# Kinesmith — portfolio site

Static site. No build step, no dependencies. Open it, edit it, ship it.

## Run it locally

Video needs to be served over HTTP — opening `index.html` as a file won't play reliably.
Python's built-in server does **not** support byte-range requests, which large video
files need, so use the included one:

```
python serve.py
```

Then open http://127.0.0.1:8080

Any real host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, nginx) supports
range requests natively — this script only exists for local preview.

## Deploy

Drag the whole folder into Netlify or Cloudflare Pages. That's it — it's static.

## Type

Bricolage Grotesque (display, variable optical-size + width) / Instrument Sans
(text) / Geist Mono (technical labels). Loaded from Google Fonts. If you'd
rather not depend on that, self-host the three families and swap the `<link>`.

## Motion

GSAP 3.12.5 + ScrollTrigger, **vendored into `assets/js/vendor/`** rather than
pulled from a CDN — the site keeps working offline and can't break when a CDN
changes. If GSAP fails to load for any reason, `main.js` detects it and reveals
every element immediately, so the page degrades to plain and readable rather
than blank.

Note: animations are driven by `requestAnimationFrame`, which browsers freeze in
background tabs. If you open the page and nothing animates, check the window is
actually focused — that is not a bug in the site.

## Structure

```
index.html              markup + copy
assets/css/style.css    all styling, both themes
assets/js/main.js       intro timeline, scroll reveals, parallax, lightbox
assets/js/vendor/       gsap.min.js + ScrollTrigger.min.js
assets/video/
  work-0N-preview.mp4   540px silent loop for the grid (~1-2 MB each)
  work-0N.mp4           1080px with audio, loads only in the lightbox
assets/poster/          first-frame stills, shown before video decodes
```

Two tiers on purpose: the page loads ~6 MB of silent previews, and the full
files are fetched only when someone actually clicks to watch. The 4K masters
in `Editing/ShortForms/Exports` are 200–400 MB each and must never be linked
directly.

## Things you must change before this goes live

- **The two roles in the Studio section are my assumption, not your answer.**
  I wrote Pushpahas as "Edit & creative direction" and Ragavendhra as
  "Motion & design" because that's the usual split in a two-person short-form
  studio. If it's wrong, fix `.person__role` and `.person__line` in
  `index.html` — it's the one place on the page making a claim I couldn't verify.
- `hello@kinesmith.com` in `index.html` (two places: the contact button and its
  `mailto:` subject) — swap for your real address
- The three social links in the contact section are `href="#"` placeholders,
  marked `data-placeholder`. Point them at real profiles or delete them.
- `og:image` points at `assets/poster/work-03.jpg`. Fine, but a purpose-made
  1200×630 share image is better.
- Register the domain before publishing anything under this name.

## Deliberately absent

No client logos, no testimonials, no view-count claims. Everything currently on
the page is either your own work or a factual statement about the process. Add
social proof only when it's real — a fabricated logo wall is the fastest way to
lose a serious B2B buyer.

## Adding the two SaaS films

The two 16:9 "In production" slots are in `index.html` under `<div class="slots">`.
When a film is ready, encode it the same way:

```
ffmpeg -i master.mov -an -vf "scale=960:-2" -c:v libx264 -preset slow -crf 31 \
  -pix_fmt yuv420p -movflags +faststart assets/video/film-01-preview.mp4

ffmpeg -i master.mov -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -movflags +faststart \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 128k assets/video/film-01.mp4
```

Then replace the `.slot` article with a `.card` article copied from the grid
above it, and drop `aspect-ratio:9/16` to `16/9` on that card's `.card__media`.

## Notes on the metadata shown on each card

Duration, resolution, cut density and loudness printed under each piece were
measured from the actual masters with ffprobe/ffmpeg — not estimated. If you
re-edit a piece, re-measure it rather than leaving a stale number on the page.
Cut density came from `select='gt(scene,0.22)'` scene detection.
