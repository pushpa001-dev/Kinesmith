"use client";

import { ADDONS, PRICING, USD_TO_INR } from "@/lib/data";
import { useCurrency, type Cur } from "@/lib/currency";

export default function Pricing() {
  const { price, symbol, cur, setCur } = useCurrency();

  return (
    <section className="section section--rule" id="pricing">
      <header className="shead">
        <span className="shead__n mono">05</span>
        <div className="shead__body">
          <p className="eyebrow" data-a="fade">
            <span className="dot" aria-hidden="true" />
            Pricing
          </p>
          <h2 className="h2 lines">
            <span className="l">Per video.</span>
            <span className="l">Not per month.</span>
          </h2>
        </div>
        <p className="shead__note" data-a="fade">
          No retainer, no unused quota, no minimum term. The price is on the page
          so neither of us wastes a call finding out we&rsquo;re far apart.
        </p>
      </header>

      <div className="curbar" data-a="fade">
        <span className="curbar__label mono">Show prices in</span>
        <div className="curswitch curswitch--lg" data-cur={cur} role="group" aria-label="Currency">
          <span className="curswitch__pill" aria-hidden="true" />
          {(["USD", "INR"] as Cur[]).map((c) => (
            <button
              key={c}
              type="button"
              data-on={cur === c}
              aria-pressed={cur === c}
              onClick={() => setCur(c)}
            >
              {c === "USD" ? "$ USD" : "₹ INR"}
            </button>
          ))}
        </div>
      </div>

      <div className="pricewrap">
        {PRICING.map((g) => (
          <div key={g.id}>
            <div className="pgroup__head">
              <h3
                className="pgroup__title"
                dangerouslySetInnerHTML={{ __html: g.label }}
              />
              <span className="pgroup__kicker mono">{g.kicker}</span>
            </div>
            <p className="pgroup__blurb">{g.blurb}</p>

            <div className="plist">
              {g.items.map((it) => (
                <div
                  key={it.name}
                  className={`prow${it.pick ? " prow--pick" : ""}`}
                  data-a="prow"
                >
                  <div>
                    <p className="prow__name">{it.name}</p>
                    <p className="prow__note">{it.note}</p>
                  </div>
                  <p className="prow__price">
                    {it.from && <span className="from">from</span>}
                    <span className="cur">{symbol}</span>
                    <span>{price(it.usd)}</span>
                    <span className="prow__unit">{g.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className="pgroup__head">
            <h3 className="pgroup__title">Scope changes</h3>
            <span className="pgroup__kicker mono">Applied per piece</span>
          </div>
          <p className="pgroup__blurb">
            Quoted upfront, never discovered on the invoice.
          </p>
          <ul className="addons">
            {ADDONS.map((a) => (
              <li key={a.name}>
                {a.name}
                <b>{a.usd}</b>
              </li>
            ))}
          </ul>
          <p className="pricenote">
            {cur === "INR" ? (
              <>Converted at ₹{USD_TO_INR} = $1. Invoiced at the rate on the day of quoting.</>
            ) : (
              <>All prices in USD. Indian clients can switch the toggle above.</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
