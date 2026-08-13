/* --------------------------------------------------------------------------
   Content + pricing. Everything the site says about itself lives here.
   -------------------------------------------------------------------------- */

export type Work = {
  id: string;
  index: string;
  title: string;
  desc: string;
  /** measured from the delivered master with ffprobe — re-measure if you re-edit */
  meta: string;
  duration: string;
  preview: string;
  full: string;
  poster: string;
  kind: "short" | "motion";
};

export const WORK: Work[] = [
  {
    id: "w1",
    index: "01",
    title: "Founder podcast — retention cut",
    desc: "Multi-angle assembly, word-level captions, kinetic figure callout.",
    meta: "51.1s · 2160×3840 · 47 cuts/min",
    duration: "51.1s",
    preview: "/video/work-01-preview.mp4",
    full: "/video/work-01.mp4",
    poster: "/poster/work-01.jpg",
    kind: "short",
  },
  {
    id: "w2",
    index: "02",
    title: "Long-form → cinematic short",
    desc: "Graded mono-to-colour open, archival inserts, longer holds.",
    meta: "64.0s · 2160×3840 · 26 cuts/min",
    duration: "64.0s",
    preview: "/video/work-02-preview.mp4",
    full: "/video/work-02.mp4",
    poster: "/poster/work-02.jpg",
    kind: "short",
  },
  {
    id: "w3",
    index: "03",
    title: "Data-led viral cut",
    desc: "Device compositing, dimensional type, callouts on a held glow grade.",
    meta: "36.6s · 2160×3840 · 56 cuts/min",
    duration: "36.6s",
    preview: "/video/work-03-preview.mp4",
    full: "/video/work-03.mp4",
    poster: "/poster/work-03.jpg",
    kind: "motion",
  },
  {
    id: "w4",
    index: "04",
    title: "Product explainer — motion system",
    desc: "Built element set: neon iconography, label cards, UI stack, branded captions.",
    meta: "30.0s · 1080×1920 · 32 cuts/min",
    duration: "30.0s",
    preview: "/video/work-04-preview.mp4",
    full: "/video/work-04.mp4",
    poster: "/poster/work-04.jpg",
    kind: "motion",
  },
  {
    id: "w5",
    index: "05",
    title: "Title sequence — 2.5D composite",
    desc: "Layered polaroid build on suspended lines, clapper and reel elements, desaturated grade with a single held red.",
    meta: "10.2s · 720×1280 · 2.5D composite",
    duration: "10.2s",
    preview: "/video/work-05-preview.mp4",
    full: "/video/work-05.mp4",
    poster: "/poster/work-05.jpg",
    kind: "motion",
  },
];

/* The two 16:9 SaaS films. They sit in their own block below the shorts reel,
   not inside it — a horizontal film has no business in a vertical rail.

   WHEN A FILM SHIPS: encode it, drop the three files in public/, then fill in
   preview/full/poster/meta below and give it a real title. The frame swaps
   itself from placeholder to a playing, clickable video — no code to touch.
   `stage` is only read while a slot is still a placeholder. */
export type Slot = {
  n: string;
  title: string;
  label: string;
  /** shown on the placeholder only — a claim, so keep it true or blank it */
  stage: string;
  /** fill these four in and this stops being a placeholder */
  preview?: string;
  full?: string;
  poster?: string;
  meta?: string;
};

export const SLOTS: Slot[] = [
  {
    n: "A",
    title: "PULSE — analytics product film",
    label: "Landing hero",
    stage: "",
    preview: "/video/saas-01-preview.mp4",
    full: "/video/saas-01.mp4",
    poster: "/poster/saas-01.jpg",
    meta: "18.4s · 1920×1080 · UI build + kinetic type",
  },
  {
    n: "B",
    title: "SARA — AI workspace launch film",
    label: "Product launch",
    stage: "",
    preview: "/video/saas-02-preview.mp4",
    full: "/video/saas-02.mp4",
    poster: "/poster/saas-02.jpg",
    meta: "13.5s · 3840×2160 · continuous build",
  },
];

/* --------------------------------------------------------------------------
   PRICING — priced per piece, not per month.

   USD is the source of truth. INR is a straight conversion at the rate below,
   rounded to the nearest hundred so it reads like a real quote rather than a
   currency-converter output. Update RATE when it drifts.
   -------------------------------------------------------------------------- */

export const USD_TO_INR = 88;

export type Item = {
  name: string;
  note: string;
  usd: number;
  /** shown with a "from" prefix when the scope genuinely varies */
  from?: boolean;
  pick?: boolean;
};

export type Group = {
  id: string;
  label: string;
  kicker: string;
  blurb: string;
  unit: string;
  items: Item[];
};

/* Entry pricing across all three lines, deliberately under the published 2026
   bands (short-form commonly $50–$250/video; SaaS motion $500–$2,500 for 30s;
   documentary post far above this per finished minute). A two-person studio
   without a client roster wins on price and craft, not on rate card.
   Raise these once the SaaS slots are filled and the reel has client names. */
export const PRICING: Group[] = [
  {
    id: "shortform",
    label: "Short-form",
    kicker: "Per video",
    blurb:
      "Cut from footage you already have. Priced by how much craft the piece needs, not by a monthly quota you may not use.",
    unit: "per video",
    items: [
      {
        name: "Standard cut",
        note: "Up to 60s. Assembly, word-level captions, sourced inserts, one hook, all aspect ratios.",
        usd: 60,
      },
      {
        name: "Advanced cut + motion graphics",
        note: "Everything above plus custom on-brand motion graphics, three written hook variants and a full grade.",
        usd: 130,
        pick: true,
      },
    ],
  },
  {
    id: "motion",
    label: "Motion graphics — SaaS",
    kicker: "Per video",
    blurb:
      "Built frame by frame against your product, not dropped into a template. Custom vector, isometric UI, real easing.",
    unit: "per video",
    items: [
      {
        name: "Feature explainer",
        note: "Up to 30 seconds. Script pass, storyboard, custom vector build, VO sync and sound design.",
        usd: 400,
      },
      {
        name: "Product explainer",
        note: "60 seconds. Full narrative build, isometric dashboard UI, custom camera choreography.",
        usd: 500,
        pick: true,
      },
      {
        name: "Homepage hero film",
        note: "90 seconds. The flagship piece — the one that anchors the site and the launch.",
        usd: 600,
      },
    ],
  },
  {
    id: "doc",
    label: "Documentary &amp; brand film",
    kicker: "Per film",
    blurb:
      "You shoot, we build the story. Paper edit, assembly, grade, sound and titles — cutdown pack included in every one.",
    unit: "per film",
    items: [
      {
        name: "Customer story",
        note: "Up to 2 minutes. Story structure, grade, mix, lower thirds, plus three social cutdowns.",
        usd: 500,
      },
      {
        name: "Founder film",
        note: "2–4 minutes. Archival integration, custom title package, six cutdowns.",
        usd: 650,
        pick: true,
      },
      {
        name: "Long-form documentary",
        note: "6–10 minutes. Full paper edit, sound design, licensed score, nine cutdowns.",
        usd: 800,
        from: true,
      },
    ],
  },
];

export const ADDONS = [
  { name: "Rush delivery, under 48h", usd: "+35%" },
  { name: "Source files released", usd: "+30%" },
  { name: "Perpetual buyout", usd: "+25%" },
  { name: "Extra revision round", usd: "$25" },
  { name: "Additional language", usd: "$35" },
  { name: "Runtime beyond scope", usd: "$4/sec" },
];

export const PEOPLE = [
  {
    index: "01",
    name: "Pushpahas",
    // NOTE: confirm these two role lines — they are an assumption, not a fact.
    role: "Edit & creative direction",
    line: "Decides what the first three seconds are. Cuts the retention pass, writes the hook variants, and owns the standard every piece ships against.",
  },
  {
    index: "02",
    name: "Ragavendhra",
    role: "Motion & design",
    line: "Builds the motion system — type, easing, transitions, sound signature — then everything downstream inherits it and gets faster.",
  },
];

export const SERVICES = [
  {
    num: "L1",
    title: "Short-form",
    body: "Reels, Shorts and TikTok cut from your long-form. Three hooks written per video so you know which one to run. Word-level captions, sourced inserts, platform-correct exports.",
    tags: ["Podcast repurposing", "Hook variants", "Caption systems", "Paid cutdowns"],
  },
  {
    num: "L2",
    title: "Motion systems",
    body: "The part a model cannot copy. Your own easing curves, type stack, transition grammar and sound signature — built once, inherited by everything after it.",
    tags: ["Brand motion kit", "Product explainers", "UI & Lottie", "Data viz"],
  },
  {
    num: "L3",
    title: "Documentary post",
    body: "You shoot, we build the story. Paper edit, assembly, grade, sound and title package — plus the cutdown pack that turns one film into nine shorts.",
    tags: ["Founder films", "Customer stories", "Grade & mix", "Cutdown packs"],
  },
];

export const STEPS = [
  { n: "01", t: "Brief", p: "You send footage and what the piece has to do. We come back with scope and a fixed price before anything starts." },
  { n: "02", t: "Build", p: "First cut inside the agreed turnaround. Two revision rounds per stage, consolidated and in writing." },
  { n: "03", t: "Ship", p: "Master plus every aspect ratio you need, colour and loudness correct for the platform it lands on." },
  { n: "04", t: "Read", p: "We go through retention curves and hook drop-off with you, then cut the next piece against what actually held." },
];
