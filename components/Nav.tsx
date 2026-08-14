"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCurrency } from "@/lib/currency";

const LINKS = [
  { href: "#work", label: "Work", n: "01" },
  { href: "#services", label: "Services", n: "02" },
  { href: "#studio", label: "Studio", n: "03" },
  { href: "#process", label: "Process", n: "04" },
  { href: "#pricing", label: "Pricing", n: "05" },
];

export default function Nav() {
  const { cur, setCur } = useCurrency();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  /* the menu is a real overlay, so scrolling behind it has to stop */
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    const items = el.querySelectorAll(".menu a > span");

    if (open) {
      lenis?.stop();
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .set(el, { display: "flex" })
        .fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.85 })
        .fromTo(items, { yPercent: 118 }, { yPercent: 0, duration: 0.95, stagger: 0.07 }, 0.2)
        .fromTo(".menu__foot", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.5);
    } else {
      lenis?.start();
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="nav">
        <a className="nav__mark" href="#top" aria-label="Kinesmith home">
          <span className="nav__glyph" aria-hidden="true" />
          <span className="nav__name">Kinesmith</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              <span data-t={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <div className="curswitch" data-cur={cur} role="group" aria-label="Currency">
            <span className="curswitch__pill" aria-hidden="true" />
            <button type="button" data-on={cur === "USD"} aria-pressed={cur === "USD"} onClick={() => setCur("USD")}>
              USD
            </button>
            <button type="button" data-on={cur === "INR"} aria-pressed={cur === "INR"} onClick={() => setCur("INR")}>
              INR
            </button>
          </div>

          <a className="btn btn--sm magnet" href="#contact">
            <span>Start a project</span>
          </a>

          <button
            className="burger"
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="menu" id="menu" ref={menu} style={{ display: "none" }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            <span>
              {l.label}
              <em>{l.n}</em>
            </span>
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)}>
          <span>
            Contact
            <em>06</em>
          </span>
        </a>
        <div className="menu__foot mono">
          <span>kinesmith21@gmail.com</span>
          <span>Motion, forged.</span>
        </div>
      </div>
    </>
  );
}
