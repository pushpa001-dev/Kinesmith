"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { USD_TO_INR } from "./data";

export type Cur = "USD" | "INR";

type Ctx = {
  cur: Cur;
  setCur: (c: Cur) => void;
  toggle: () => void;
  /** formatted price string for the active currency */
  price: (usd: number) => string;
  symbol: string;
};

const CurrencyCtx = createContext<Ctx | null>(null);

/** INR is rounded to the nearest thousand so it reads as a quote, not a conversion. */
function toINR(usd: number) {
  return Math.round((usd * USD_TO_INR) / 1000) * 1000;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [cur, setCurState] = useState<Cur>("USD");

  // restore choice; guarded so SSR/static export never touches localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem("ks-cur");
      if (s === "USD" || s === "INR") setCurState(s);
    } catch {}
  }, []);

  const setCur = useCallback((c: Cur) => {
    setCurState(c);
    try {
      localStorage.setItem("ks-cur", c);
    } catch {}
  }, []);

  const toggle = useCallback(
    () => setCur(cur === "USD" ? "INR" : "USD"),
    [cur, setCur]
  );

  const value = useMemo<Ctx>(
    () => ({
      cur,
      setCur,
      toggle,
      symbol: cur === "USD" ? "$" : "₹",
      price: (usd: number) =>
        cur === "USD"
          ? usd.toLocaleString("en-US")
          : toINR(usd).toLocaleString("en-IN"),
    }),
    [cur, setCur, toggle]
  );

  return (
    <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>
  );
}

export function useCurrency() {
  const c = useContext(CurrencyCtx);
  if (!c) throw new Error("useCurrency must be used inside CurrencyProvider");
  return c;
}
