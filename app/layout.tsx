import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { CurrencyProvider } from "@/lib/currency";
import "./globals.css";

/* Two families for the whole page, self-hosted at build time by next/font.
   Inter carries display (at Black, 900) and the tracked technical labels;
   DM Sans carries every line of running text. */
const display = Inter({
  subsets: ["latin"],
  variable: "--f-disp",
  display: "swap",
});

const text = DM_Sans({
  subsets: ["latin"],
  variable: "--f-text",
  display: "swap",
});

export const metadata: Metadata = {
  // change to the real domain once it's registered — this only affects the
  // absolute URLs Next generates for og:image
  metadataBase: new URL("https://kinesmith.com"),
  title: "Kinesmith — Short-form & motion for B2B SaaS",
  description:
    "A two-person short-form and motion studio. Every frame decided by a person. Priced per video, not per month.",
  openGraph: {
    title: "Kinesmith — Motion, forged.",
    description:
      "A two-person short-form and motion studio. Every frame decided by a person.",
    type: "website",
    images: ["/poster/work-03.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${text.variable}`}>
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
