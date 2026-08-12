"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLOTS, WORK, type Work } from "@/lib/data";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  );
}

function lenis() {
  return (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
}

/** everything the lightbox needs — a reel piece or a shipped slot both satisfy it */
type Playable = Pick<Work, "title" | "meta" | "full" | "poster">;

/* The block's copy has to stay true as the films land, so it reads off how many
   of them actually have a video rather than being hand-edited each time. */
const PIPE_COPY = [
  {
    eyebrow: "Reserved",
    l1: "Two SaaS product films,",
    l2: "mid-build.",
    note: "16:9, landing-page length. These frames are held for them — they drop straight in here the day they ship.",
  },
  {
    eyebrow: "SaaS product films",
    l1: "One shipped.",
    l2: "One still in build.",
    note: "16:9, landing-page length. The second frame is held — it fills the day that film ships.",
  },
  {
    eyebrow: "SaaS product films",
    l1: "Built frame by frame",
    l2: "against the product.",
    note: "16:9, landing-page length. Custom vector, real easing, sound designed to the cut — not a template with your logo dropped in.",
  },
];

export default function WorkSection() {
  const [open, setOpen] = useState<Playable | null>(null);
  const vids = useRef<Map<string, HTMLVideoElement>>(new Map());
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const copy = PIPE_COPY[Math.min(SLOTS.filter((s) => s.preview).length, 2)];

  /* previews decode only while on screen — 5 looping videos otherwise cost real CPU */
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          const v = en.target as HTMLVideoElement;
          if (en.isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src;
            v.play().catch(() => {});
          } else if (!v.paused) {
            v.pause();
          }
        });
      },
      { rootMargin: "250px", threshold: 0.15 }
    );
    vids.current.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    document.body.classList.remove("lock");
    lenis()?.start();
    returnTo.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("lock");
    lenis()?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <section className="section" id="work">
      <header className="shead">
        <span className="shead__n mono">01</span>
        <div className="shead__body">
          <p className="eyebrow" data-a="fade">
            <span className="dot" aria-hidden="true" />
            Selected work
          </p>
          <h2 className="h2 lines">
            <span className="l"><i>Every frame</i></span>
            <span className="l"><i>decided by a person.</i></span>
          </h2>
        </div>
        <p className="shead__note" data-a="fade">
          Click any piece to watch it with sound. The numbers under each one are
          measured from the delivered master with ffprobe — not estimated.
        </p>
      </header>

      <p className="railhint mono" data-a="fade">
        <i aria-hidden="true" />
        Scroll to run the reel
      </p>

      <div className="rail">
        <div className="rail__track">
          {WORK.map((w) => (
            <article className="rail__item" data-a="card" key={w.id}>
              <div className="card">
                <button
                  className="card__hit"
                  type="button"
                  data-cursor="Play"
                  onClick={(e) => {
                    returnTo.current = e.currentTarget;
                    setOpen(w);
                  }}
                >
                  <span className="sr">Play: {w.title}</span>
                </button>
                <div className="card__media">
                  <span className="card__tag">
                    {w.kind === "motion" ? "Motion" : "Short-form"}
                  </span>
                  <video
                    className="card__v"
                    data-src={w.preview}
                    poster={w.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    ref={(el) => {
                      if (el) vids.current.set(w.id, el);
                      else vids.current.delete(w.id);
                    }}
                  />
                  <span className="card__play" aria-hidden="true">
                    <PlayIcon />
                  </span>
                </div>
                <div className="card__body">
                  <div className="card__row">
                    <span className="card__idx mono">{w.index}</span>
                    <span className="card__meta mono">{w.duration}</span>
                  </div>
                  <h3 className="card__title">{w.title}</h3>
                  <p className="card__desc">{w.desc}</p>
                </div>
              </div>
            </article>
          ))}

          <div className="rail__end">
            <h3>Yours is the next one on this shelf.</h3>
            <p>
              Send one video you weren&rsquo;t happy with. We re-cut the first
              fifteen seconds, free.
            </p>
            <a className="btn btn--ghost magnet" href="#contact">
              <span>Start a project</span>
            </a>
          </div>
        </div>
      </div>

      {/* the 16:9 films still in build — deliberately outside the vertical
          reel, with a scroll-scrubbed aperture instead of the rail's slide */}
      <div className="pipe">
        <header className="pipe__head">
          <p className="eyebrow" data-a="fade">
            <span className="dot" aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h3 className="pipe__h lines">
            <span className="l"><i>{copy.l1}</i></span>
            <span className="l"><i>{copy.l2}</i></span>
          </h3>
          <p className="pipe__note" data-a="fade">{copy.note}</p>
        </header>

        <div className="pipe__grid">
          {SLOTS.map((s, i) => (
            <article className="slot" data-slot={i} key={s.label}>
              {s.preview ? (
                /* shipped: same card the reel uses, just 16:9 */
                <div className="card">
                  <button
                    className="card__hit"
                    type="button"
                    data-cursor="Play"
                    onClick={(e) => {
                      returnTo.current = e.currentTarget;
                      setOpen({
                        title: s.title,
                        meta: s.meta ?? "",
                        full: s.full ?? "",
                        poster: s.poster ?? "",
                      });
                    }}
                  >
                    <span className="sr">Play: {s.title}</span>
                  </button>
                  <div className="card__media card__media--wide">
                    <span className="card__tag">Motion</span>
                    <video
                      className="card__v"
                      data-src={s.preview}
                      poster={s.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      ref={(el) => {
                        if (el) vids.current.set(`slot-${s.n}`, el);
                        else vids.current.delete(`slot-${s.n}`);
                      }}
                    />
                    <span className="card__play" aria-hidden="true">
                      <PlayIcon />
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="slot__frame"
                  aria-label={`${s.title} in production, ${s.label}`}
                >
                  <span className="slot__scan" aria-hidden="true" />
                  <span className="slot__corner slot__corner--tl" aria-hidden="true" />
                  <span className="slot__corner slot__corner--tr" aria-hidden="true" />
                  <span className="slot__corner slot__corner--bl" aria-hidden="true" />
                  <span className="slot__corner slot__corner--br" aria-hidden="true" />
                  <div className="slot__mid">
                    <span className="slot__badge mono">
                      <i aria-hidden="true" />
                      {s.stage}
                    </span>
                    <p className="slot__title">{s.title}</p>
                    <p className="slot__meta mono">16:9 · {s.label}</p>
                  </div>
                  <span className="slot__bar" aria-hidden="true"><i /></span>
                </div>
              )}
              <div className="slot__foot">
                <span className="mono">Slot {s.n}</span>
                <span className="mono">{s.preview ? s.meta : s.label}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button className="lb__close" type="button" onClick={close} ref={closeRef} aria-label="Close player">
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <figure className="lb__box">
            <video
              className="lb__v"
              src={open.full}
              poster={open.poster}
              controls
              autoPlay
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                if (v.videoWidth && v.videoHeight)
                  v.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`;
              }}
            />
            <figcaption className="lb__cap">
              <span>{open.title}</span>
              <span className="mono">{open.meta}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
