import Loader from "@/components/Loader";
import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import WorkSection from "@/components/Work";
import Pricing from "@/components/Pricing";
import { PEOPLE, SERVICES, STEPS } from "@/lib/data";

const MARQUEE = [
  "Podcast → Shorts",
  "Brand motion systems",
  "SaaS product film",
  "Founder documentary",
  "Paid social cutdowns",
  "Title sequences",
];

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Page() {
  return (
    <Motion>
      <Loader />
      <a className="skip" href="#work">Skip to work</a>
      <div className="grain" aria-hidden="true" />
      <div className="cursor" aria-hidden="true">
        <span className="cursor__d" />
        <span className="cursor__r"><span /></span>
      </div>
      <div className="progress" aria-hidden="true"><i /></div>

      <Nav />

      <main id="top">
        {/* ---------------- hero ---------------- */}
        <section className="hero">
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__grid">
            <div>
              <p className="eyebrow" data-a="fade">
                <span className="dot" aria-hidden="true" />
                <span>Short-form</span><em>/</em>
                <span>Motion systems</span><em>/</em>
                <span>Documentary</span>
              </p>

              <h1 className="hero__h1 lines">
                <span className="l"><i>The first</i></span>
                <span className="l"><i><span className="accent">three seconds</span></i></span>
                <span className="l"><i>decide everything.</i></span>
              </h1>

              <p className="hero__sub" data-a="fade">
                Short-form and motion for B2B SaaS. Two people, every frame
                decided by hand.
              </p>

              <div className="hero__cta" data-a="fade">
                <a className="btn btn--primary magnet" href="#contact">
                  <span>Start a project</span>
                  <Arrow />
                </a>
                <a className="btn btn--ghost" href="#work">
                  <span>See the reel</span>
                </a>
              </div>

              <dl className="stats" data-a="fade">
                <div>
                  <dt>Turnaround</dt>
                  <dd><span data-count="48">48</span><em>hrs</em></dd>
                </div>
                <div>
                  <dt>Delivered in</dt>
                  <dd><span>4K</span><em>vertical</em></dd>
                </div>
                <div>
                  <dt>The studio</dt>
                  <dd><span data-count="2">2</span><em>people</em></dd>
                </div>
              </dl>
            </div>

            <figure className="hero__player" data-a="player">
              <div className="player">
                <video
                  className="player__v"
                  src="/video/work-03-preview.mp4"
                  poster="/poster/work-03.jpg"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  aria-label="Showreel excerpt"
                />
              </div>
              <figcaption className="player__meta">
                <span>Data-led viral cut</span>
                <span className="mono">36.6s · 56 cuts/min</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------- marquee ---------------- */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track" id="mq">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} style={{ display: "contents" }}>
                <span>{m}</span>
                <b>—</b>
              </span>
            ))}
          </div>
        </div>

        <WorkSection />

        {/* ---------------- services ---------------- */}
        <section className="section section--rule" id="services">
          <header className="shead">
            <span className="shead__n mono">02</span>
            <div className="shead__body">
              <p className="eyebrow" data-a="fade">
                <span className="dot" aria-hidden="true" />What we make
              </p>
              <h2 className="h2 lines">
                <span className="l"><i>Three lines.</i></span>
                <span className="l"><i>One standard.</i></span>
              </h2>
            </div>
          </header>

          <div className="svc">
            {SERVICES.map((s) => (
              <article className="svc__row" data-a="row" key={s.num}>
                <span className="svc__num mono">{s.num}</span>
                <div className="svc__main">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                <ul className="svc__tags">
                  {s.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- studio ---------------- */}
        <section className="section section--rule" id="studio">
          <header className="shead">
            <span className="shead__n mono">03</span>
            <div className="shead__body">
              <p className="eyebrow" data-a="fade">
                <span className="dot" aria-hidden="true" />The studio
              </p>
              <h2 className="h2 lines">
                <span className="l"><i>Two people.</i></span>
                <span className="l"><i>That&rsquo;s the whole studio.</i></span>
              </h2>
            </div>
            <p className="shead__note" data-a="fade">
              No account layer, no junior queue, no one to hand your footage down
              to. The person who answers your message is the person cutting your
              video.
            </p>
          </header>

          <div className="people">
            {PEOPLE.map((p) => (
              <article className="person" data-a="person" key={p.name}>
                <span className="person__i mono">{p.index}</span>
                <h3 className="person__name"><span>{p.name}</span></h3>
                <p className="person__role mono">{p.role}</p>
                <p className="person__line">{p.line}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- process ---------------- */}
        <section className="section section--rule" id="process">
          <header className="shead">
            <span className="shead__n mono">04</span>
            <div className="shead__body">
              <p className="eyebrow" data-a="fade">
                <span className="dot" aria-hidden="true" />How it runs
              </p>
              <h2 className="h2 lines">
                <span className="l"><i>Four steps.</i></span>
                <span className="l"><i>No surprises.</i></span>
              </h2>
            </div>
          </header>

          <ol className="steps">
            {STEPS.map((s) => (
              <li className="step" data-a="step" key={s.n}>
                <span className="step__n mono">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <Pricing />

        {/* ---------------- contact ---------------- */}
        <section className="section contact" id="contact">
          <div className="contact__inner">
            <p className="eyebrow" data-a="fade">
              <span className="dot" aria-hidden="true" />Next step
            </p>
            <h2 className="contact__h lines">
              <span className="l"><i>Send us one video</i></span>
              <span className="l"><i>you weren&rsquo;t happy with.</i></span>
            </h2>
            <p className="contact__p" data-a="fade">
              We&rsquo;ll re-cut the first fifteen seconds and send it back — no
              charge, no call required. If it&rsquo;s better, we&rsquo;ll talk
              about the rest.
            </p>
            <a
              className="btn btn--primary btn--lg magnet"
              data-a="fade"
              data-cursor="Mail"
              href="mailto:hello@kinesmith.com?subject=Re-cut%20my%20first%2015%20seconds"
            >
              <span>hello@kinesmith.com</span>
              <Arrow />
            </a>
            <p className="contact__alt" data-a="fade">
              Or find us on{" "}
              <a href="#">LinkedIn</a>, <a href="#">Instagram</a>,{" "}
              <a href="#">Vimeo</a>.
            </p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot__l">
          <span className="nav__glyph" aria-hidden="true" />
          <span>Kinesmith</span>
        </div>
        <p className="mono">Motion, forged.</p>
        <p className="mono">Pushpahas &amp; Ragavendhra</p>
      </footer>
    </Motion>
  );
}
