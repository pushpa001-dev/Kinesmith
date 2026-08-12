"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Wordmark loader, doubling as the page transition.
 *
 * The mark starts oversized and dim, pulls down into a crisp lockup, holds a
 * beat, then blows back through the viewport — and the panel behind it wipes
 * upward to reveal the page. The hero intro is released as the wipe starts, so
 * the two moves read as one continuous shot rather than a handover.
 *
 * Hard rule: it must never trap the page. A backgrounded tab freezes rAF, so
 * the release is also driven by setTimeout and capped by a ceiling.
 */
const MAX_MS = 3600;

export default function Loader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let done = false;
    let released = false;
    const el = rootRef.current;
    const mark = markRef.current;

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
    if (!el || !mark || reduced || document.hidden) {
      const t = window.setTimeout(finish, reduced ? 0 : 600);
      return () => {
        window.clearTimeout(t);
        document.body.classList.remove("loading");
      };
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (done) return;
        done = true;
        finish();
      },
    });

    tl
      // oversized + dim, pulling down to the settled lockup
      .fromTo(
        mark,
        { scale: 7.5, opacity: 0.16, filter: "blur(1px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.15, ease: "expo.out" }
      )
      .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
      // …hold…
      .to(mark, { scale: 1, duration: 0.32 })
      // then blow through the viewport and out
      .to(mark, { scale: 9, opacity: 0, duration: 0.8, ease: "expo.in" })
      // curtain up — the page is already animating in behind it
      .to(
        el,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.95,
          ease: "expo.inOut",
          onStart: release,
        },
        "-=0.42"
      );

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
      <div className="loader__mark" ref={markRef}>
        Kinesmith
      </div>
      <span className="loader__bar">
        <i ref={barRef} />
      </span>
    </div>
  );
}
