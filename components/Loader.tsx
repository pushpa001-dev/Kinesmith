"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Loader, doubling as the page transition.
 *
 * The K wipes up from its own baseline, the wordmark's letters rise behind it,
 * a real counter runs the bar along the bottom — then the whole lockup lifts
 * away and the screen splits down the middle to reveal the page. The split is
 * the point: it reads as a shutter opening rather than a curtain falling, and
 * the hero intro is released as it starts so the two moves are one shot.
 *
 * Hard rule: it must never trap the page. A backgrounded tab freezes rAF, so
 * the release is also driven by setTimeout and capped by a ceiling.
 */
const MAX_MS = 3400;
const WORD = "Kinesmith";

export default function Loader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let done = false;
    let released = false;
    const el = rootRef.current;

    // hands the page over: flag first, then event, so Motion cannot miss it
    const release = () => {
      if (released) return;
      released = true;
      document.body.classList.remove("loading");
      (window as unknown as { __ksReady?: boolean }).__ksReady = true;
      window.dispatchEvent(new Event("ks:ready"));
    };
    const finish = () => {
      release();
      setGone(true);
    };

    document.body.classList.add("loading");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduced || document.hidden) {
      const t = window.setTimeout(finish, reduced ? 0 : 500);
      return () => {
        window.clearTimeout(t);
        document.body.classList.remove("loading");
      };
    }

    const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));
    const letters = q<HTMLElement>(".loader__word i");
    const counter = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        if (done) return;
        done = true;
        finish();
      },
    });

    tl
      // the mark draws itself upward out of nothing
      .fromTo(
        ".loader__k",
        { clipPath: "inset(100% 0% 0% 0%)", yPercent: 8 },
        { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, duration: 0.85, ease: "power3.out" },
        0
      )
      // letters follow, resolving out of a blur — nothing is clipped
      .fromTo(
        letters,
        { opacity: 0, y: 16, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.04,
        },
        0.12
      )
      // a real number, not a fake one — it counts the timeline it sits under
      .to(
        counter,
        {
          v: 100,
          duration: 1.3,
          ease: "power2.inOut",
          onUpdate: () => {
            if (pctRef.current)
              pctRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0
      )
      .fromTo(".loader__bar i", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0)
      // lockup leaves first, so the split opens on an empty frame
      .to(".loader__inner", { yPercent: -6, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.5)
      .to(".loader__meta", { opacity: 0, duration: 0.35, ease: "power2.in" }, 1.5)
      // …then the shutter opens
      .to(".loader__panel--t", { yPercent: -100, duration: 0.95, ease: "expo.inOut", onStart: release }, 1.8)
      .to(".loader__panel--b", { yPercent: 100, duration: 0.95, ease: "expo.inOut" }, 1.8);

    // ceiling: fires even if the tab is throttled mid-timeline
    const ceiling = window.setTimeout(() => {
      if (done) return;
      done = true;
      tl.kill();
      finish();
    }, MAX_MS);

    return () => {
      window.clearTimeout(ceiling);
      tl.kill();
      document.body.classList.remove("loading");
    };
  }, []);

  if (gone) return null;

  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <span className="loader__panel loader__panel--t" />
      <span className="loader__panel loader__panel--b" />

      <div className="loader__inner">
        {/* same geometry as app/icon.svg — keep the two in step */}
        <svg className="loader__k" viewBox="0 0 100 100" aria-hidden="true">
          <path
            fill="var(--ember)"
            d="M16 20h15v60H16z M20 50 62 20h22L42 50z M20 50h22l42 30H62z"
          />
        </svg>
        <div className="loader__word">
          {WORD.split("").map((c, i) => (
            <span key={i}>
              <i>{c}</i>
            </span>
          ))}
        </div>
      </div>

      <div className="loader__meta">
        <span className="loader__pct mono" ref={pctRef}>
          000
        </span>
        <span className="loader__bar">
          <i />
        </span>
      </div>
    </div>
  );
}
