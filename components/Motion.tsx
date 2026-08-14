"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Every piece of page motion lives here. It queries the server-rendered DOM
 * after mount, so all the sections stay plain server components.
 *
 * Two rules that shaped this file:
 *  - Browsers freeze requestAnimationFrame in background tabs, so initial
 *    states are set in the same effect that animates them, never in CSS. A
 *    hidden tab shows finished content rather than a blank page.
 *  - Lenis drives scroll, so it must be the only thing driving it: ScrollTrigger
 *    listens to Lenis, Lenis is stepped by gsap.ticker, and lag smoothing is off
 *    so a dropped frame doesn't teleport the page.
 */
/**
 * Wraps each word of a line in a plain inline-block span and returns them.
 *
 * Nothing clips. The words are revealed with opacity, a short lift and a blur
 * that resolves — there is no overflow:hidden anywhere in the chain, so no
 * mask edge is ever visible and descenders and accents can never be cut.
 *
 * Element children (the accent span) are moved in whole rather than descended
 * into, so their styling survives the split.
 */
function splitWords(line: HTMLElement): HTMLElement[] {
  if (line.dataset.split) {
    return Array.from(line.querySelectorAll<HTMLElement>(".w"));
  }
  const out: HTMLElement[] = [];
  const frag = document.createDocumentFragment();

  const push = (content: Node | string) => {
    const w = document.createElement("span");
    w.className = "w";
    if (typeof content === "string") w.textContent = content;
    else w.appendChild(content);
    frag.appendChild(w);
    out.push(w);
  };

  Array.from(line.childNodes).forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      // keep the gaps as real text nodes so words can still wrap normally
      (n.textContent || "").split(/(\s+)/).forEach((tok) => {
        if (!tok) return;
        if (!tok.trim()) frag.appendChild(document.createTextNode(" "));
        else push(tok);
      });
    } else {
      push(n.cloneNode(true));
    }
  });

  line.replaceChildren(frag);
  line.dataset.split = "1";
  return out;
}

export default function Motion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- smooth scroll ---------- */
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      smoothWheel: !reduced,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    /* Sticky nav off the scroll position directly. A trigger-less
       ScrollTrigger.create({start:26}) never reports active — it has no valid
       end — so the class never landed and the nav stayed transparent. */
    const stick = () =>
      document.querySelector(".nav")?.classList.toggle("stuck", window.scrollY > 26);
    lenis.on("scroll", stick);
    stick();
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // anchors have to go through Lenis or they fight the smoothing
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -76, duration: 1.4 });
    };
    document.addEventListener("click", onAnchor);

    // the marquee runs off gsap.ticker, which context.revert() does not unhook
    let tickerFn: (() => void) | null = null;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const q = gsap.utils.toArray as <T>(s: string) => T[];

      /* Every heading is split once, up front, so nothing reflows mid-scroll.
         WORDS.get(headingEl) is the ordered word list for that heading. */
      const WORDS = new Map<HTMLElement, HTMLElement[]>();
      q<HTMLElement>(".lines").forEach((h) => {
        const words: HTMLElement[] = [];
        h.querySelectorAll<HTMLElement>(".l").forEach((line) =>
          words.push(...splitWords(line))
        );
        WORDS.set(h, words);
      });
      const lineInners = [...WORDS.values()].flat();
      const fades = q<HTMLElement>("[data-a='fade']");
      const cards = q<HTMLElement>("[data-a='card']");
      const rows = q<HTMLElement>("[data-a='row']");
      const steps = q<HTMLElement>("[data-a='step']");
      const prows = q<HTMLElement>("[data-a='prow']");
      const people = q<HTMLElement>("[data-a='person']");
      const player = document.querySelector<HTMLElement>("[data-a='player']");

      if (reduced) {
        gsap.set([...fades, ...cards, ...rows, ...steps, ...prows], { opacity: 1, y: 0 });
        return;
      }

      /* ---------- initial states ----------
         Words resolve out of a blur rather than sliding out from behind a
         mask edge. Travel is deliberately short — long slides are what make a
         page read as a template, because the eye tracks the movement instead
         of the words. The blur does the work the distance used to. */
      gsap.set(lineInners, { opacity: 0, y: 20, filter: "blur(10px)" });
      gsap.set(q<HTMLElement>(".person__name > span"), {
        opacity: 0,
        y: 20,
        filter: "blur(10px)",
      });
      gsap.set(fades, { opacity: 0, y: 10 });
      gsap.set(rows, { opacity: 0, y: 14 });
      gsap.set(steps, { opacity: 0, y: 14 });
      gsap.set(prows, { opacity: 0, y: 10 });
      // the work items wipe up rather than fade — it reads like a cut, not a dissolve
      const pick = (c: HTMLElement, sel: string) => c.querySelector(sel) ?? [];
      cards.forEach((c) => {
        gsap.set(pick(c, ".card__media, .slot__frame"), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(pick(c, ".card__body"), { opacity: 0, y: 16 });
        gsap.set(pick(c, "video"), { scale: 1.18 });
      });
      people.forEach((p) => {
        gsap.set(p.querySelector(".person__i"), { opacity: 0 });
        gsap.set([p.querySelector(".person__role"), p.querySelector(".person__line")], {
          opacity: 0,
          y: 16,
        });
      });
      if (player) gsap.set(player, { opacity: 0, y: 44, scale: 0.96 });

      /* ---------- intro ----------
         power3.out, not expo.out. expo covers 90% of the distance in the first
         fifth of its duration, which is what gives a page that snapped-then-
         drifted feel. power3 keeps moving through the middle and settles. */
      const heroH1 = document.querySelector<HTMLElement>(".hero__h1");
      const heroWords = (heroH1 && WORDS.get(heroH1)) || [];
      const intro = gsap
        .timeline({ defaults: { ease: "power3.out" }, paused: true })
        .from(".nav", { y: -18, opacity: 0, duration: 1 }, 0)
        .to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.9 }, 0.15)
        .to(
          heroWords,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.3, stagger: 0.055 },
          0.22
        )
        .to(player, { opacity: 1, y: 0, scale: 1, duration: 1.5 }, 0.42)
        .to(".hero__sub", { opacity: 1, y: 0, duration: 1 }, 0.78)
        .to(".hero__cta", { opacity: 1, y: 0, duration: 1 }, 0.88)
        .to(".stats", { opacity: 1, y: 0, duration: 1, onStart: counters }, 0.98);

      /* The loader hands off via ks:ready. Three guards so the hero can never be
         left hidden: a flag in case the event already fired, a listener for the
         normal path, and a timer in case the loader never mounts at all. */
      let launched = false;
      const launch = () => {
        if (launched) return;
        launched = true;
        intro.play();
      };
      if ((window as unknown as { __ksReady?: boolean }).__ksReady) launch();
      else window.addEventListener("ks:ready", launch, { once: true });
      gsap.delayedCall(3.6, launch);

      function counters() {
        q<HTMLElement>(".stats [data-count]").forEach((el) => {
          const end = parseFloat(el.dataset.count || "0");
          if (document.hidden) {
            el.textContent = String(end);
            return;
          }
          const o = { v: 0 };
          gsap.to(o, {
            v: end,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => (el.textContent = String(Math.round(o.v))),
            onComplete: () => (el.textContent = String(end)),
          });
        });
      }

      /* ---------- hero: scroll-out ---------- */
      gsap.to(".hero__grid", {
        opacity: 0.16,
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "50% top", end: "bottom top", scrub: 0.8 },
      });

      /* ---------- headings ----------
         Words arrive 40ms apart, which at reading distance reads as one
         settling gesture rather than a queue of separate slides. */
      WORDS.forEach((words, h) => {
        if (h.closest(".hero") || !words.length) return;
        ScrollTrigger.create({
          trigger: h,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(words, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.05,
            }),
        });
      });

      /* ---------- batched reveals ---------- */
      const batch = (els: HTMLElement[], vars: gsap.TweenVars, start = 88) => {
        if (!els.length) return;
        ScrollTrigger.batch(els, {
          start: `top ${start}%`,
          once: true,
          onEnter: (b) => gsap.to(b, vars),
        });
      };
      batch(
        fades.filter((f) => !f.closest(".hero")),
        { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", stagger: 0.06 }
      );
      batch(rows, { opacity: 1, y: 0, duration: 1.15, ease: "power3.out", stagger: 0.08 });
      batch(steps, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.07 });
      batch(prows, { opacity: 1, y: 0, duration: 0.95, ease: "power2.out", stagger: 0.05 });

      /* work items: whole rail wipes in on one trigger, so the stagger reads as
         one gesture instead of firing per-card off-screen inside the pin */
      const railEl = document.querySelector(".rail");
      if (railEl && cards.length) {
        ScrollTrigger.create({
          trigger: railEl,
          start: "top 82%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            cards.forEach((c, i) => {
              const at = i * 0.08;
              tl.to(pick(c, ".card__media, .slot__frame"), {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.25,
              }, at)
                .to(pick(c, "video"), { scale: 1, duration: 1.6 }, at)
                .to(pick(c, ".card__body"), { opacity: 1, y: 0, duration: 0.8 }, at + 0.25);
            });
          },
        });
      }

      /* ---------- in-production slots: scroll-scrubbed aperture ----------
         The rail sells finished work by sliding it past you, so these use the
         opposite gesture: the pair drifts together while each frame opens from
         a centre slit. All scrubbed, so it tracks the wheel rather than firing
         once and finishing on its own. */
      // the pair only sits side by side above 860px (see .pipe__grid); drifting
      // them sideways in a single column just pushes past the viewport edge
      const paired = window.matchMedia("(min-width:861px)").matches;
      q<HTMLElement>("[data-slot]").forEach((s, i) => {
        const from = i % 2 === 0 ? -9 : 9;
        const track = (start: string, end: string) => ({
          trigger: s,
          start,
          end,
          scrub: 0.8 as const,
        });
        // .card__media once the film has shipped, .slot__frame while it hasn't
        gsap.fromTo(
          pick(s, ".slot__frame, .card__media"),
          { clipPath: "inset(0% 50% 0% 50%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: track("top 94%", "top 48%") }
        );
        if (paired) {
          gsap.fromTo(
            s,
            { xPercent: from },
            { xPercent: 0, ease: "none", scrollTrigger: track("top 98%", "top 44%") }
          );
        }
        // placeholder chrome — absent once a real video is in the frame
        gsap.fromTo(
          pick(s, ".slot__mid, .card__v"),
          { scale: 1.14 },
          { scale: 1, ease: "none", scrollTrigger: track("top 94%", "top 44%") }
        );
        gsap.fromTo(
          pick(s, ".slot__bar i"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: track("top 86%", "bottom 60%") }
        );
      });

      /* ---------- people ---------- */
      people.forEach((p) => {
        ScrollTrigger.create({
          trigger: p,
          start: "top 84%",
          once: true,
          onEnter: () => {
            gsap
              .timeline({ defaults: { ease: "power3.out" } })
              .to(p.querySelector(".person__i"), { opacity: 1, duration: 0.5 }, 0)
              .to(
                p.querySelector(".person__name > span"),
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 },
                0.05
              )
              .to(
                [p.querySelector(".person__role"), p.querySelector(".person__line")],
                { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 },
                0.34
              );
          },
        });
      });

      if (player) {
        gsap.to(player, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 },
        });
      }

      /* ---------- marquee, sped up by scroll velocity ---------- */
      const track = document.getElementById("mq");
      if (track) {
        const half = track.scrollWidth / 2;
        let x = 0,
          dir = 1,
          boost = 0;
        ScrollTrigger.create({
          onUpdate: (self) => {
            dir = self.direction;
            boost = Math.min(Math.abs(self.getVelocity()) / 260, 9);
          },
        });
        const tick = () => {
          x -= (0.55 + boost) * dir;
          boost *= 0.93;
          if (x <= -half) x += half;
          if (x > 0) x -= half;
          track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
        };
        gsap.ticker.add(tick);
        tickerFn = tick;
      }

      /* ---------- progress ---------- */
      gsap.to(".progress i", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      /* ---------- magnetic buttons + custom cursor ---------- */
      if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
        q<HTMLElement>(".magnet").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
          el.addEventListener("mousemove", (e) => {
            const b = el.getBoundingClientRect();
            xTo((e.clientX - (b.left + b.width / 2)) * 0.28);
            yTo((e.clientY - (b.top + b.height / 2)) * 0.4);
          });
          el.addEventListener("mouseleave", () => {
            xTo(0);
            yTo(0);
          });
        });

        const cur = document.querySelector<HTMLElement>(".cursor");
        const dot = cur?.querySelector<HTMLElement>(".cursor__d");
        const ring = cur?.querySelector<HTMLElement>(".cursor__r");
        const label = cur?.querySelector<HTMLElement>(".cursor__r span");
        if (cur && dot && ring && label) {
          // dot tracks tight, ring lags — the lag is what makes it feel physical
          const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
          const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
          const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
          const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
          const scale = gsap.quickTo(ring, "scale", { duration: 0.45, ease: "power3" });

          window.addEventListener("mousemove", (e) => {
            gsap.to(cur, { opacity: 1, duration: 0.3, overwrite: "auto" });
            dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
          });
          document.addEventListener("mouseleave", () =>
            gsap.to(cur, { opacity: 0, duration: 0.3, overwrite: "auto" })
          );
          document.addEventListener("mouseover", (e) => {
            const t = (e.target as HTMLElement)?.closest?.<HTMLElement>("[data-cursor]");
            if (t) {
              label.textContent = t.dataset.cursor || "";
              cur.classList.add("is-on");
              scale(1.5);
            } else if ((e.target as HTMLElement)?.closest?.("a,button")) {
              cur.classList.remove("is-on");
              scale(1.35);
            } else {
              cur.classList.remove("is-on");
              scale(1);
            }
          });
        }
      }

      ScrollTrigger.refresh();
    }, scope);

    /* ---------- work rail: pinned horizontal scroll on desktop only ----------
       Below 1025px the same markup is a native snap carousel (see globals.css),
       so there is nothing to pin and nothing to tear down. */
    if (!reduced) {
      mm.add("(min-width:1025px)", () => {
        const rail = document.querySelector<HTMLElement>(".rail");
        const track = document.querySelector<HTMLElement>(".rail__track");
        if (!rail || !track) return;

        const dist = () => Math.max(0, track.scrollWidth - rail.clientWidth);

        const st = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: rail,
            start: "top 92px",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // velocity skew — the rail leans into the direction of travel
        const skew = gsap.quickTo(track, "skewX", { duration: 0.7, ease: "power3" });
        const lean = ScrollTrigger.create({
          trigger: rail,
          start: "top bottom",
          end: "bottom top",
          // ±2.5, not ±6 — at six degrees the lean is the thing you notice
          // instead of the work, which is the wrong way round
          onUpdate: (self) =>
            skew(gsap.utils.clamp(-2.5, 2.5, self.getVelocity() / -420)),
        });

        return () => {
          st.scrollTrigger?.kill();
          st.kill();
          lean.kill();
          gsap.set(track, { x: 0, skewX: 0 });
        };
      });
    }

    return () => {
      document.removeEventListener("click", onAnchor);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      mm.revert();
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <div ref={scope}>{children}</div>;
}
