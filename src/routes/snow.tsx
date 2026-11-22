import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { CopyButton } from "@/components/copy-button";

export const Route = createFileRoute("/snow")({
  head: () => ({
    meta: [
      { title: "Snowfall · CSS Only — CSS Showcase" },
      {
        name: "description",
        content:
          "A pure-CSS snowfall: layered gradient drift, swaying per-flake motion, a skewed blizzard, a night scene, an aurora sky, a swirlable snow globe, a frosted hero and a light flurry — no JavaScript, and prefers-reduced-motion pauses the sky.",
      },
      { property: "og:title", content: "Snowfall · CSS Only — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Nine snowfall patterns across desktop, iPad and mobile — layered drift, per-flake sway, blizzard gusts, night scene, aurora sky, snow globe, frosted hero and light flurry. Every flake is CSS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SnowDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "layered-drift"
  | "flake-sway"
  | "blizzard"
  | "night-scene"
  | "card-overlay"
  | "aurora-sky"
  | "snow-globe"
  | "frosted-hero"
  | "light-flurry";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    {
      id: "layered-drift",
      label: "Layered snowfall",
      desc: "Three gradient sheets, one seamless loop",
    },
    { id: "flake-sway", label: "Swaying flakes", desc: "Per-flake custom properties and drift" },
    { id: "blizzard", label: "Blizzard", desc: "Skewed field, streaks and a gust cycle" },
    { id: "night-scene", label: "Night scene", desc: "Gradient art: moon, pines and hills" },
  ],
  ipad: [
    {
      id: "card-overlay",
      label: "Overlay on real UI",
      desc: "pointer-events: none snow over a promo card",
    },
    { id: "aurora-sky", label: "Aurora sky", desc: "Blurred gradient bands behind the snow" },
    { id: "snow-globe", label: "Snow globe", desc: "Hover or press the globe to swirl the snow" },
  ],
  mobile: [
    { id: "frosted-hero", label: "Frosted hero", desc: "backdrop-filter glass over falling snow" },
    { id: "light-flurry", label: "Light flurry", desc: "Sparse flakes; layers added with width" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "layered-drift": `/* Layered snowfall — three radial-gradient sheets, seamless loop */
.snow-stage {
  position: relative;
  overflow: hidden;
  /* Fixed night palette (the Manila Sunrise hexes). A night sky is dark in
     both themes, and tokens like --primary-foreground invert per theme —
     so the art carries its own colors instead of theme tokens */
  --snow-ink: #171a00;
  --snow-cream: #f4f1e4;
  --snow-glow: #9b5a56;
  --snow-mauve: #9e7c88;
  --snow-rust: #874300;
  --snow-bark: #443100;
  background:
    radial-gradient(110% 65% at 82% -8%,
      color-mix(in srgb, var(--snow-glow) 30%, transparent), transparent 68%),
    linear-gradient(180deg,
      color-mix(in srgb, var(--snow-glow) 14%, var(--snow-ink)) 0%,
      var(--snow-ink) 62%);
}

.snow-layer {
  position: absolute;
  left: 0;
  right: 0;
  /* Extend one tile beyond the stage so the loop never shows an edge */
  top: calc(-1 * var(--fall, 200px));
  bottom: calc(-1 * var(--fall, 200px));
  pointer-events: none;
  background-repeat: repeat;
  animation: snow-fall var(--speed, 10s) linear infinite;
  animation-delay: var(--delay, 0s);
}

.snow-layer.far {
  --fall: 260px; --speed: 15s; --delay: -4.2s;
  opacity: 0.5;
  background-image:
    radial-gradient(2px 2px at 44px 66px, var(--snow-cream) 50%, transparent 51%),
    radial-gradient(1.6px 1.6px at 190px 210px,
      color-mix(in srgb, var(--snow-cream) 55%, transparent) 50%, transparent 51%);
  background-size: 260px 260px;
}

.snow-layer.mid {
  --fall: 200px; --speed: 9.5s; --delay: -7.8s;
  opacity: 0.72;
  background-image:
    radial-gradient(2.6px 2.6px at 96px 38px, var(--snow-cream) 50%, transparent 51%),
    radial-gradient(2px 2px at 210px 150px,
      color-mix(in srgb, var(--snow-cream) 75%, transparent) 50%, transparent 51%);
  background-size: 200px 200px;
}

.snow-layer.near {
  --fall: 160px; --speed: 6.4s; --delay: -2.5s;
  background-image:
    radial-gradient(3.6px 3.6px at 60px 96px, var(--snow-cream) 50%, transparent 51%),
    radial-gradient(3px 3px at 175px 34px,
      color-mix(in srgb, var(--snow-cream) 92%, transparent) 50%, transparent 51%);
  background-size: 160px 160px;
}

/* var() inside @keyframes resolves per element: each layer falls exactly
   one tile (--fall) before looping, so the pattern never jumps */
@keyframes snow-fall {
  to { transform: translateY(var(--fall, 200px)); }
}`,
  "flake-sway": `/* Swaying flakes — per-flake custom properties, negative delays */
/* Each wrapper spans the full stage height; the dot rides at its top */
.flake {
  position: absolute;
  inset-block: 0;
  left: var(--x);
  animation: flake-fall var(--t) linear infinite;
  /* Negative delay = every flake starts mid-fall, never in sync */
  animation-delay: var(--d);
}

.flake::before {
  content: "";
  display: block;
  inline-size: var(--s);
  block-size: var(--s);
  border-radius: 999px;
  background: var(--snow-cream);
  opacity: var(--o);
  animation: flake-sway var(--st) ease-in-out infinite alternate;
}

/* Fall runs on the wrapper, sway on the pseudo-element — two animations,
   no transform conflict */
@keyframes flake-fall {
  0%   { transform: translateY(-8%); opacity: 0; }
  8%   { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(108%); opacity: 0; }
}

@keyframes flake-sway {
  from { transform: translateX(calc(var(--sway) * -1)); }
  to   { transform: translateX(var(--sway)); }
}

/* In markup, each flake sets its data once:
   <span class="flake" style="--x: 12%; --s: 3px; --t: 12s;
                              --d: -6s; --sway: 14px; --st: 3.8s; --o: .8" /> */`,
  blizzard: `/* Blizzard — skewed field, streaks and a gust cycle */
.blizzard-field {
  position: absolute;
  inset: -30%;
  transform: rotate(-9deg);
  pointer-events: none;
  /* The gust rides the individual 'translate' property, so it composes
     with the rotate on 'transform' instead of overwriting it */
  animation: gust 5s ease-in-out infinite;
}

@keyframes gust {
  0%, 100% { translate: -3% 0; }
  50%      { translate: 5% 0; }
}

/* Wall: tiny dim flakes, dense tile, very fast */
.blizzard-field .wall {
  --fall: 90px; --speed: 1.9s; opacity: 0.4;
  background-image:
    radial-gradient(1.5px 1.5px at 20px 30px, var(--snow-cream) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 60px 70px,
      color-mix(in srgb, var(--snow-cream) 70%, transparent) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 45px 15px,
      color-mix(in srgb, var(--snow-cream) 50%, transparent) 50%, transparent 51%);
  background-size: 90px 90px;
}

/* Flying: mid-size flakes racing between the wall and the streaks */
.blizzard-field .flying {
  --fall: 160px; --speed: 2.6s; opacity: 0.7;
  background-image:
    radial-gradient(2.5px 2.5px at 40px 80px, var(--snow-cream) 50%, transparent 51%),
    radial-gradient(2px 2px at 110px 30px,
      color-mix(in srgb, var(--snow-cream) 80%, transparent) 50%, transparent 51%);
  background-size: 160px 160px;
}

/* Streaks: radials stretched into vertical smears (1.5px wide, 22px tall) */
.blizzard-field .streaks {
  --fall: 130px; --speed: 1.1s; opacity: 0.8;
  background-image:
    radial-gradient(1.5px 22px at 30px 40px,
      color-mix(in srgb, var(--snow-cream) 75%, transparent) 40%, transparent 55%),
    radial-gradient(1.5px 16px at 90px 90px,
      color-mix(in srgb, var(--snow-cream) 55%, transparent) 40%, transparent 55%);
  background-size: 130px 130px;
}

/* Layers reuse the shared .snow-layer scaffolding + @keyframes snow-fall */
@keyframes snow-fall {
  to { transform: translateY(var(--fall)); }
}`,
  "night-scene": `/* Night scene — gradient art under the snowfall */
.scene-moon {
  position: absolute;
  top: 10%;
  right: 14%;
  inline-size: 44px;
  block-size: 44px;
  border-radius: 999px;
  background: var(--snow-cream);
  box-shadow: 0 0 34px 10px
    color-mix(in srgb, var(--snow-cream) 28%, transparent);
  opacity: 0.9;
}

/* Trees sized in cqw — they scale with the device frame, not the viewport */
.pine {
  position: absolute;
  bottom: var(--b, 9%);
  left: var(--x, 20%);
  inline-size: var(--w, 16cqw);
  aspect-ratio: 3 / 4;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--snow-bark) 70%, var(--snow-ink)),
    var(--snow-ink));
  clip-path: polygon(50% 0%, 68% 30%, 58% 30%, 78% 58%, 64% 58%,
    88% 88%, 12% 88%, 36% 58%, 22% 58%, 42% 30%, 32% 30%);
}

/* Snowbank: an ellipse peeking up from below the frame edge */
.scene-ground {
  position: absolute;
  inset-inline: -10%;
  bottom: -14%;
  block-size: 26%;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  background: color-mix(in srgb, var(--snow-cream) 14%, var(--snow-ink));
}

/* Markup paints scene first, then two .snow-layer sheets on top,
   so the snow falls in front of the moon and trees.
   .snow-layer scaffolding: see the "Layered snowfall" pattern. */`,
  "card-overlay": `/* Overlay on real UI — snow over a promo card */
.promo-card {
  position: relative;
  overflow: hidden;          /* clips the snow to the rounded corners */
  inline-size: min(100%, 24rem);
  padding: 1.5rem;
  border-radius: 1.25rem;
  color: var(--snow-cream);
  border: 1px solid color-mix(in srgb, var(--snow-cream) 20%, transparent);
  background:
    radial-gradient(120% 100% at 85% 0%,
      color-mix(in srgb, var(--snow-glow) 38%, transparent), transparent 60%),
    linear-gradient(165deg,
      color-mix(in srgb, var(--snow-glow) 16%, var(--snow-ink)),
      var(--snow-ink));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

/* Snow layers render first in the DOM; the content wrapper sits above.
   pointer-events: none keeps the button fully clickable through the snow */
.promo-card .snow-layer { pointer-events: none; }
.promo-content { position: relative; }

.promo-eyebrow {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.75;
}

.promo-title { margin-top: 0.4rem; font-size: 1.35rem; font-weight: 700; }

.promo-copy { margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.8; }

.promo-cta {
  margin-top: 1rem;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 0;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--snow-cream);
  color: var(--snow-ink);
}

/* The two layers inside the card reuse .snow-layer far / near as-is —
   tiles repeat at any container size. */`,
  "aurora-sky": `/* Aurora sky — blurred gradient bands drifting behind the snow */
.aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  filter: blur(26px) saturate(1.15);
  opacity: 0.85;
}

.aurora::before,
.aurora::after {
  content: "";
  position: absolute;
  inset: -20% -10%;
}

.aurora::before {
  background: linear-gradient(100deg,
    transparent 15%,
    color-mix(in srgb, var(--snow-mauve) 55%, transparent) 40%,
    color-mix(in srgb, var(--snow-glow) 45%, transparent) 60%,
    transparent 85%);
  animation: aurora-drift 9s ease-in-out infinite alternate;
}

.aurora::after {
  background: linear-gradient(80deg,
    transparent 20%,
    color-mix(in srgb, var(--snow-glow) 40%, transparent) 55%,
    transparent 80%);
  animation: aurora-drift 13s ease-in-out infinite alternate-reverse;
}

@keyframes aurora-drift {
  from { transform: rotate(-8deg) translateX(-6%); }
  to   { transform: rotate(-6deg) translateX(8%); }
}

/* Paint order: .aurora, a .scene-ground snowbank, then .snow-layer far/near */`,
  "snow-globe": `/* Snow globe — hover or press to swirl */
/* .globe-figure is a full-width grid column (inline-size: 100%), so the
   globe's 72% resolves against the stage, not a shrink-to-fit box */
.globe {
  position: relative;
  overflow: hidden;                    /* keeps the snow inside the glass */
  inline-size: min(72%, 26rem);
  aspect-ratio: 1;
  border-radius: 999px;
  border: 3px solid
    color-mix(in srgb, var(--snow-cream) 35%, transparent);
  background: radial-gradient(circle at 32% 28%,
    color-mix(in srgb, var(--snow-glow) 30%, var(--snow-ink)),
    var(--snow-ink) 70%);
  box-shadow:
    inset 0 -14px 30px color-mix(in srgb, var(--snow-cream) 12%, transparent),
    0 18px 40px rgba(0, 0, 0, 0.35);
}

/* Wobble runs on :hover / :active — an interaction with zero JavaScript */
.globe-stage:hover .globe,
.globe-stage:active .globe {
  animation: globe-wobble 1.1s ease-in-out;
}

@keyframes globe-wobble {
  0%, 100% { transform: rotate(0deg); }
  20%      { transform: rotate(-4deg); }
  45%      { transform: rotate(3deg); }
  70%      { transform: rotate(-2deg); }
}

/* Swirl adds a second animation on the individual 'translate' property,
   composing with snow-fall's 'transform' instead of replacing it */
.globe-stage:hover .globe .snow-layer,
.globe-stage:active .globe .snow-layer {
  animation:
    snow-fall var(--speed) linear infinite,
    swirl-jitter 0.6s linear infinite;
}

@keyframes swirl-jitter {
  0%, 100% { translate: 0 0; }
  25%      { translate: 5px 0; }
  50%      { translate: -5px 0; }
  75%      { translate: 2px 0; }
}

/* Tiny tile layers tuned for the small globe */
.globe .g-far {
  --fall: 80px; --speed: 7s; opacity: 0.55;
  background-image:
    radial-gradient(1.6px 1.6px at 24px 40px, var(--snow-cream) 50%, transparent 51%);
  background-size: 80px 80px;
}

.globe .g-near {
  --fall: 60px; --speed: 4.4s; opacity: 0.9;
  background-image:
    radial-gradient(2.4px 2.4px at 18px 30px, var(--snow-cream) 50%, transparent 51%);
  background-size: 60px 60px;
}

/* Glass highlight + wooden base */
.globe-glare {
  position: absolute;
  top: 10%;
  left: 16%;
  inline-size: 30%;
  block-size: 16%;
  border-radius: 999px;
  transform: rotate(-24deg);
  filter: blur(3px);
  background: linear-gradient(120deg,
    color-mix(in srgb, var(--snow-cream) 40%, transparent),
    transparent 70%);
}

.globe-stand {
  inline-size: 34%;
  block-size: clamp(0.9rem, 6cqw, 1.4rem);
  margin-top: -2%;
  background: linear-gradient(180deg, var(--snow-rust), var(--snow-bark));
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
  border-radius: 4px 4px 8px 8px;
}`,
  "frosted-hero": `/* Frosted hero — backdrop-filter glass over falling snow */
.hero-card {
  position: absolute;
  inset-inline: 10%;
  bottom: 12%;
  padding: 1rem 1.1rem;
  border-radius: 1.1rem;
  text-align: center;
  color: var(--snow-cream);
  background: color-mix(in srgb, var(--snow-ink) 42%, transparent);
  border: 1px solid color-mix(in srgb, var(--snow-cream) 24%, transparent);
  /* The glass blurs whatever falls behind it */
  backdrop-filter: blur(9px) saturate(1.1);
  -webkit-backdrop-filter: blur(9px) saturate(1.1);
}

.hero-eyebrow {
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.75;
}

.hero-title { margin-top: 0.35rem; font-size: 1.35rem; font-weight: 700; }

.hero-copy { margin-top: 0.4rem; font-size: 0.68rem; opacity: 0.8; }

/* Depth: .snow-layer far + mid render BEHIND the card (blurred by the
   glass), and a smaller .hero-front sheet renders after it in the DOM,
   so a few sharp flakes drift in front of the pane */`,
  "light-flurry": `/* Light flurry — sparse by default, richer as the frame widens */
.flurry .flake:nth-child(n + 5) { display: none; }
.flurry-extra { display: none; }

/* Container queries read the DEVICE FRAME's width, not the viewport:
   on the phone frame this stays sparse; embedded wider, it thickens */
@container (min-width: 420px) {
  .flurry .flake:nth-child(n + 5) { display: block; }
  .flurry-extra { display: block; }
}

/* The four base flakes are slow, small and dim:
   <span class="flake" style="--x: 18%; --s: 2.5px; --t: 16s;
                              --d: -7s; --sway: 9px; --st: 4.6s; --o: .55" />

.flurry-extra is a mid .snow-layer sheet that only exists above 420px.
.flake + .snow-layer scaffolding: see the desktop patterns. */`,
};

type Flake = {
  x: number;
  s: number;
  t: number;
  d: number;
  sway: number;
  st: number;
  o: number;
};

const FLAKES: Flake[] = [
  { x: 4, s: 4, t: 10, d: 2, sway: 16, st: 3.4, o: 0.95 },
  { x: 12, s: 2.5, t: 14, d: 6, sway: 10, st: 4.2, o: 0.6 },
  { x: 19, s: 3, t: 12, d: 9, sway: 14, st: 3.8, o: 0.8 },
  { x: 26, s: 5, t: 8, d: 4, sway: 20, st: 3, o: 1 },
  { x: 33, s: 2.5, t: 15, d: 11, sway: 12, st: 4.6, o: 0.55 },
  { x: 40, s: 3.5, t: 11, d: 1, sway: 16, st: 3.6, o: 0.9 },
  { x: 47, s: 2, t: 16, d: 7, sway: 8, st: 5, o: 0.5 },
  { x: 54, s: 4.5, t: 9, d: 12, sway: 18, st: 3.2, o: 0.95 },
  { x: 61, s: 3, t: 13, d: 5, sway: 12, st: 4, o: 0.75 },
  { x: 68, s: 2.5, t: 14.5, d: 3, sway: 10, st: 4.4, o: 0.6 },
  { x: 75, s: 4, t: 10.5, d: 8, sway: 16, st: 3.4, o: 0.9 },
  { x: 82, s: 2, t: 17, d: 10, sway: 8, st: 5.2, o: 0.5 },
  { x: 89, s: 3.5, t: 11.5, d: 6, sway: 14, st: 3.8, o: 0.85 },
  { x: 96, s: 2.5, t: 15.5, d: 13, sway: 10, st: 4.8, o: 0.65 },
];

const FLURRY_FLAKES: Flake[] = [
  { x: 10, s: 2.5, t: 18, d: 4, sway: 9, st: 4.6, o: 0.6 },
  { x: 30, s: 3, t: 15, d: 9, sway: 11, st: 4, o: 0.75 },
  { x: 52, s: 2, t: 20, d: 2, sway: 8, st: 5.2, o: 0.5 },
  { x: 74, s: 3.5, t: 14, d: 11, sway: 12, st: 3.8, o: 0.85 },
  { x: 22, s: 2, t: 19, d: 6, sway: 8, st: 5, o: 0.5 },
  { x: 44, s: 2.5, t: 16.5, d: 13, sway: 10, st: 4.4, o: 0.65 },
  { x: 63, s: 2, t: 21, d: 8, sway: 7, st: 5.4, o: 0.45 },
  { x: 88, s: 3, t: 15.5, d: 15, sway: 11, st: 4.2, o: 0.7 },
];

function flakeStyle(f: Flake): React.CSSProperties {
  return {
    "--x": `${f.x}%`,
    "--s": `${f.s}px`,
    "--t": `${f.t}s`,
    "--d": `-${f.d}s`,
    "--sway": `${f.sway}px`,
    "--st": `${f.st}s`,
    "--o": `${f.o}`,
  } as React.CSSProperties;
}

function SnowDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "layered-drift",
      ipad: "card-overlay",
      mobile: "frosted-hero",
    }),
  );

  const pattern = patterns[device];
  useDemoUrlSync(device, pattern);
  const options = PATTERNS[device];

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-16 md:pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Snowfall, zero JavaScript.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Layered drift on desktop, overlay and aurora patterns on iPad, a frosted hero on mobile
            — every flake is CSS, and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">prefers-reduced-motion</code>{" "}
            pauses the sky instead of removing it.
          </p>
        </header>

        <section
          aria-labelledby="demo-title"
          className="overflow-hidden rounded-3xl border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 id="demo-title" className="text-sm font-semibold">
              Featured demo
            </h2>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {device} · {pattern}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device}>
              <SnowStage pattern={pattern} />
            </DeviceFrame>
          </div>

          <DeviceTabs value={device} onChange={setDevice} />

          <div className="border-t bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {device} design patterns
              </p>
              <CopyLinkButton device={device} pattern={pattern} />
            </div>
            <PatternList
              options={options}
              value={pattern}
              onChange={(p) => setPatterns((prev) => ({ ...prev, [device]: p }))}
            />
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                snow-{pattern}.css
              </span>
              <CopyButton getText={() => CSS_BY_PATTERN[pattern]} />
            </div>
            <pre className="overflow-x-auto bg-card px-4 py-4 text-[11px] leading-relaxed sm:text-xs">
              <code>{CSS_BY_PATTERN[pattern]}</code>
            </pre>
          </div>

          <div className="border-t px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CSS features used
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground">
              <li>• radial-gradient flake sheets</li>
              <li>• Seamless background tiles</li>
              <li>• Per-flake custom properties</li>
              <li>• Negative animation delays</li>
              <li>• Individual transform properties</li>
              <li>• pointer-events: none overlay</li>
              <li>• backdrop-filter glass</li>
              <li>• prefers-reduced-motion pause</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        /* ——— Shared scaffolding ——— */

        .snow-stage {
          position: relative;
          overflow: hidden;
          inline-size: 100%;
          block-size: 100%;
          /* Fixed night palette (the Manila Sunrise hexes). A night sky is
             dark in both themes, and tokens like --primary-foreground invert
             per theme — so the art carries its own colors instead */
          --snow-ink: #171a00;
          --snow-cream: #f4f1e4;
          --snow-glow: #9b5a56;
          --snow-mauve: #9e7c88;
          --snow-rust: #874300;
          --snow-bark: #443100;
          background:
            radial-gradient(110% 65% at 82% -8%,
              color-mix(in srgb, var(--snow-glow) 30%, transparent), transparent 68%),
            linear-gradient(180deg,
              color-mix(in srgb, var(--snow-glow) 14%, var(--snow-ink)) 0%,
              var(--snow-ink) 62%);
          color: var(--snow-cream);
        }

        .snow-layer {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(-1 * var(--fall, 200px));
          bottom: calc(-1 * var(--fall, 200px));
          pointer-events: none;
          background-repeat: repeat;
          animation: snow-fall var(--speed, 10s) linear infinite;
          animation-delay: var(--delay, 0s);
        }

        .snow-layer.far {
          --fall: 260px; --speed: 15s; --delay: -4.2s;
          opacity: 0.5;
          background-image:
            radial-gradient(2px 2px at 44px 66px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(1.6px 1.6px at 190px 210px,
              color-mix(in srgb, var(--snow-cream) 55%, transparent) 50%, transparent 51%);
          background-size: 260px 260px;
        }

        .snow-layer.mid {
          --fall: 200px; --speed: 9.5s; --delay: -7.8s;
          opacity: 0.72;
          background-image:
            radial-gradient(2.6px 2.6px at 96px 38px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(2px 2px at 210px 150px,
              color-mix(in srgb, var(--snow-cream) 75%, transparent) 50%, transparent 51%);
          background-size: 200px 200px;
        }

        .snow-layer.near {
          --fall: 160px; --speed: 6.4s; --delay: -2.5s;
          background-image:
            radial-gradient(3.6px 3.6px at 60px 96px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(3px 3px at 175px 34px,
              color-mix(in srgb, var(--snow-cream) 92%, transparent) 50%, transparent 51%);
          background-size: 160px 160px;
        }

        /* var() inside @keyframes resolves per element: each layer falls
           exactly one tile (--fall) before looping, so the pattern never jumps */
        @keyframes snow-fall {
          to { transform: translateY(var(--fall, 200px)); }
        }

        .flake {
          position: absolute;
          inset-block: 0;
          left: var(--x, 50%);
          animation: flake-fall var(--t, 12s) linear infinite;
          animation-delay: var(--d, 0s);
        }

        .flake::before {
          content: "";
          display: block;
          inline-size: var(--s, 3px);
          block-size: var(--s, 3px);
          border-radius: 999px;
          background: var(--snow-cream);
          opacity: var(--o, 0.9);
          animation: flake-sway var(--st, 3.6s) ease-in-out infinite alternate;
        }

        /* Fall on the wrapper, sway on the pseudo-element — no transform conflict */
        @keyframes flake-fall {
          0%   { transform: translateY(-8%); opacity: 0; }
          8%   { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(108%); opacity: 0; }
        }

        @keyframes flake-sway {
          from { transform: translateX(calc(var(--sway, 12px) * -1)); }
          to   { transform: translateX(var(--sway, 12px)); }
        }

        .flake-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* ——— Blizzard ——— */

        .blizzard-field {
          position: absolute;
          inset: -30%;
          transform: rotate(-9deg);
          pointer-events: none;
          animation: gust 5s ease-in-out infinite;
        }

        @keyframes gust {
          0%, 100% { translate: -3% 0; }
          50%      { translate: 5% 0; }
        }

        .blizzard-field .wall {
          --fall: 90px; --speed: 1.9s; opacity: 0.4;
          background-image:
            radial-gradient(1.5px 1.5px at 20px 30px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 60px 70px,
              color-mix(in srgb, var(--snow-cream) 70%, transparent) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 45px 15px,
              color-mix(in srgb, var(--snow-cream) 50%, transparent) 50%, transparent 51%);
          background-size: 90px 90px;
        }

        .blizzard-field .flying {
          --fall: 160px; --speed: 2.6s; opacity: 0.7;
          background-image:
            radial-gradient(2.5px 2.5px at 40px 80px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(2px 2px at 110px 30px,
              color-mix(in srgb, var(--snow-cream) 80%, transparent) 50%, transparent 51%);
          background-size: 160px 160px;
        }

        .blizzard-field .streaks {
          --fall: 130px; --speed: 1.1s; opacity: 0.8;
          background-image:
            radial-gradient(1.5px 22px at 30px 40px,
              color-mix(in srgb, var(--snow-cream) 75%, transparent) 40%, transparent 55%),
            radial-gradient(1.5px 16px at 90px 90px,
              color-mix(in srgb, var(--snow-cream) 55%, transparent) 40%, transparent 55%);
          background-size: 130px 130px;
        }

        /* ——— Night scene (also: aurora ground, reused) ——— */

        .scene-moon {
          position: absolute;
          top: 10%;
          right: 14%;
          inline-size: 44px;
          block-size: 44px;
          border-radius: 999px;
          background: var(--snow-cream);
          box-shadow: 0 0 34px 10px
            color-mix(in srgb, var(--snow-cream) 28%, transparent);
          opacity: 0.9;
        }

        .pine {
          position: absolute;
          bottom: var(--b, 9%);
          left: var(--x, 20%);
          inline-size: var(--w, 16cqw);
          aspect-ratio: 3 / 4;
          background: linear-gradient(180deg,
            color-mix(in srgb, var(--snow-bark) 70%, var(--snow-ink)),
            var(--snow-ink));
          clip-path: polygon(50% 0%, 68% 30%, 58% 30%, 78% 58%, 64% 58%,
            88% 88%, 12% 88%, 36% 58%, 22% 58%, 42% 30%, 32% 30%);
        }

        .scene-ground {
          position: absolute;
          inset-inline: -10%;
          bottom: -14%;
          block-size: 26%;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          background: color-mix(in srgb, var(--snow-cream) 14%, var(--snow-ink));
        }

        /* ——— Card overlay ——— */

        .overlay-stage {
          display: grid;
          place-items: center;
          padding: 1.5rem;
        }

        .promo-card {
          position: relative;
          overflow: hidden;
          inline-size: min(100%, 24rem);
          padding: 1.5rem;
          border-radius: 1.25rem;
          color: var(--snow-cream);
          border: 1px solid color-mix(in srgb, var(--snow-cream) 20%, transparent);
          background:
            radial-gradient(120% 100% at 85% 0%,
              color-mix(in srgb, var(--snow-glow) 38%, transparent), transparent 60%),
            linear-gradient(165deg,
              color-mix(in srgb, var(--snow-glow) 16%, var(--snow-ink)),
              var(--snow-ink));
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
        }

        .promo-content { position: relative; }

        .promo-eyebrow {
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.75;
        }

        .promo-title { margin-top: 0.4rem; font-size: 1.35rem; font-weight: 700; }

        .promo-copy { margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.8; }

        .promo-cta {
          margin-top: 1rem;
          padding: 0.55rem 1.1rem;
          border-radius: 999px;
          border: 0;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--snow-cream);
          color: var(--snow-ink);
        }

        /* ——— Aurora ——— */

        .aurora {
          position: absolute;
          inset: 0;
          pointer-events: none;
          filter: blur(26px) saturate(1.15);
          opacity: 0.85;
        }

        .aurora::before,
        .aurora::after {
          content: "";
          position: absolute;
          inset: -20% -10%;
        }

        .aurora::before {
          background: linear-gradient(100deg,
            transparent 15%,
            color-mix(in srgb, var(--snow-mauve) 55%, transparent) 40%,
            color-mix(in srgb, var(--snow-glow) 45%, transparent) 60%,
            transparent 85%);
          animation: aurora-drift 9s ease-in-out infinite alternate;
        }

        .aurora::after {
          background: linear-gradient(80deg,
            transparent 20%,
            color-mix(in srgb, var(--snow-glow) 40%, transparent) 55%,
            transparent 80%);
          animation: aurora-drift 13s ease-in-out infinite alternate-reverse;
        }

        @keyframes aurora-drift {
          from { transform: rotate(-8deg) translateX(-6%); }
          to   { transform: rotate(-6deg) translateX(8%); }
        }

        /* ——— Snow globe ——— */

        .globe-stage {
          display: grid;
          place-items: center;
        }

        .globe-figure {
          display: grid;
          justify-items: center;
          align-content: center;
          inline-size: 100%;
          block-size: 100%;
          padding: 8%;
        }

        .globe {
          position: relative;
          overflow: hidden;
          inline-size: min(72%, 26rem);
          aspect-ratio: 1;
          border-radius: 999px;
          border: 3px solid
            color-mix(in srgb, var(--snow-cream) 35%, transparent);
          background: radial-gradient(circle at 32% 28%,
            color-mix(in srgb, var(--snow-glow) 30%, var(--snow-ink)),
            var(--snow-ink) 70%);
          box-shadow:
            inset 0 -14px 30px color-mix(in srgb, var(--snow-cream) 12%, transparent),
            0 18px 40px rgba(0, 0, 0, 0.35);
        }

        .globe-stage:hover .globe,
        .globe-stage:active .globe {
          animation: globe-wobble 1.1s ease-in-out;
        }

        @keyframes globe-wobble {
          0%, 100% { transform: rotate(0deg); }
          20%      { transform: rotate(-4deg); }
          45%      { transform: rotate(3deg); }
          70%      { transform: rotate(-2deg); }
        }

        .globe-stage:hover .globe .snow-layer,
        .globe-stage:active .globe .snow-layer {
          animation:
            snow-fall var(--speed) linear infinite,
            swirl-jitter 0.6s linear infinite;
        }

        @keyframes swirl-jitter {
          0%, 100% { translate: 0 0; }
          25%      { translate: 5px 0; }
          50%      { translate: -5px 0; }
          75%      { translate: 2px 0; }
        }

        .globe .g-far {
          --fall: 80px; --speed: 7s; --delay: -3s;
          opacity: 0.55;
          background-image:
            radial-gradient(1.6px 1.6px at 24px 40px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(1.4px 1.4px at 62px 64px,
              color-mix(in srgb, var(--snow-cream) 60%, transparent) 50%, transparent 51%);
          background-size: 80px 80px;
        }

        .globe .g-near {
          --fall: 60px; --speed: 4.4s; --delay: -1.5s;
          opacity: 0.9;
          background-image:
            radial-gradient(2.4px 2.4px at 18px 30px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(2px 2px at 48px 52px,
              color-mix(in srgb, var(--snow-cream) 85%, transparent) 50%, transparent 51%);
          background-size: 60px 60px;
        }

        .globe .scene-ground {
          inset-inline: -20%;
          bottom: -6%;
          block-size: 22%;
        }

        .globe-glare {
          position: absolute;
          top: 10%;
          left: 16%;
          inline-size: 30%;
          block-size: 16%;
          border-radius: 999px;
          transform: rotate(-24deg);
          filter: blur(3px);
          pointer-events: none;
          background: linear-gradient(120deg,
            color-mix(in srgb, var(--snow-cream) 40%, transparent),
            transparent 70%);
        }

        .globe-stand {
          inline-size: 34%;
          block-size: clamp(0.9rem, 6cqw, 1.4rem);
          margin-top: -2%;
          background: linear-gradient(180deg, var(--snow-rust), var(--snow-bark));
          clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
          border-radius: 4px 4px 8px 8px;
        }

        .globe-hint {
          margin-top: 1rem;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--snow-cream) 70%, transparent);
        }

        /* ——— Frosted hero ——— */

        .hero-card {
          position: absolute;
          inset-inline: 10%;
          bottom: 12%;
          padding: 1rem 1.1rem;
          border-radius: 1.1rem;
          text-align: center;
          color: var(--snow-cream);
          background: color-mix(in srgb, var(--snow-ink) 42%, transparent);
          border: 1px solid color-mix(in srgb, var(--snow-cream) 24%, transparent);
          backdrop-filter: blur(9px) saturate(1.1);
          -webkit-backdrop-filter: blur(9px) saturate(1.1);
        }

        .hero-eyebrow {
          font-size: 0.5625rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.75;
        }

        .hero-title { margin-top: 0.35rem; font-size: 1.35rem; font-weight: 700; }

        .hero-copy { margin-top: 0.4rem; font-size: 0.68rem; opacity: 0.8; }

        .hero-stage .hero-front {
          --fall: 140px; --speed: 5.6s; --delay: -1.2s;
          opacity: 0.9;
          background-image:
            radial-gradient(2.6px 2.6px at 40px 60px, var(--snow-cream) 50%, transparent 51%),
            radial-gradient(2.2px 2.2px at 120px 110px,
              color-mix(in srgb, var(--snow-cream) 85%, transparent) 50%, transparent 51%);
          background-size: 140px 140px;
        }

        /* ——— Light flurry ——— */

        .flurry .flake:nth-child(n + 5) { display: none; }
        .flurry-extra { display: none; }

        @container (min-width: 420px) {
          .flurry .flake:nth-child(n + 5) { display: block; }
          .flurry-extra { display: block; }
        }

        /* ——— Reduced motion: pause the sky, don't delete it ——— */

        @media (prefers-reduced-motion: reduce) {
          .snow-stage *,
          .snow-stage *::before,
          .snow-stage *::after {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </main>
  );
}

function DeviceFrame({ device, children }: { device: Device; children: React.ReactNode }) {
  const style: Record<Device, React.CSSProperties> = {
    desktop: { aspectRatio: "16 / 10", maxWidth: "100%", borderRadius: "0.75rem" },
    ipad: { aspectRatio: "4 / 3", maxWidth: "88%", borderRadius: "1.5rem" },
    mobile: { aspectRatio: "9 / 19.5", maxWidth: "260px", borderRadius: "2rem" },
  };

  return (
    <div
      data-device={device}
      style={{
        ...style[device],
        containerType: "inline-size",
        transition:
          "aspect-ratio .5s ease, max-width .5s ease, border-radius .5s ease, padding .5s ease",
      }}
      className="relative mx-auto w-full overflow-hidden border-4 border-foreground/80 bg-background p-2 shadow-2xl"
    >
      {device === "mobile" && (
        <div className="absolute left-1/2 top-1 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-foreground/70" />
      )}
      <div className="h-full w-full overflow-hidden rounded-lg bg-card">{children}</div>
    </div>
  );
}

function SnowStage({ pattern }: { pattern: Pattern }) {
  if (pattern === "layered-drift") {
    return (
      <div className="snow-stage h-full w-full">
        <div className="snow-layer far" aria-hidden="true" />
        <div className="snow-layer mid" aria-hidden="true" />
        <div className="snow-layer near" aria-hidden="true" />
      </div>
    );
  }

  if (pattern === "flake-sway") {
    return (
      <div className="snow-stage h-full w-full">
        <div className="flake-field" aria-hidden="true">
          {FLAKES.map((f, i) => (
            <span key={i} className="flake" style={flakeStyle(f)} />
          ))}
        </div>
      </div>
    );
  }

  if (pattern === "blizzard") {
    return (
      <div className="snow-stage h-full w-full">
        <div className="blizzard-field" aria-hidden="true">
          <div className="snow-layer wall" />
          <div className="snow-layer flying" />
          <div className="snow-layer streaks" />
        </div>
      </div>
    );
  }

  if (pattern === "night-scene") {
    return (
      <div className="snow-stage h-full w-full">
        <div className="scene-moon" aria-hidden="true" />
        <div
          className="pine"
          style={{ "--x": "16%", "--w": "15cqw" } as React.CSSProperties}
          aria-hidden="true"
        />
        <div
          className="pine"
          style={{ "--x": "38%", "--w": "10cqw", "--b": "8%" } as React.CSSProperties}
          aria-hidden="true"
        />
        <div
          className="pine"
          style={{ "--x": "63%", "--w": "18cqw" } as React.CSSProperties}
          aria-hidden="true"
        />
        <div className="scene-ground" aria-hidden="true" />
        <div className="snow-layer far" aria-hidden="true" />
        <div className="snow-layer mid" aria-hidden="true" />
      </div>
    );
  }

  if (pattern === "card-overlay") {
    return (
      <div className="snow-stage overlay-stage h-full w-full">
        <div className="promo-card">
          <div className="snow-layer far" aria-hidden="true" />
          <div className="snow-layer near" aria-hidden="true" />
          <div className="promo-content">
            <p className="promo-eyebrow">Winter drop</p>
            <h3 className="promo-title">First snow of the season.</h3>
            <p className="promo-copy">
              A pointer-events: none layer means the button below stays fully clickable through the
              snow.
            </p>
            <button type="button" className="promo-cta">
              Shop the drop
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pattern === "aurora-sky") {
    return (
      <div className="snow-stage h-full w-full">
        <div className="aurora" aria-hidden="true" />
        <div className="scene-ground" aria-hidden="true" />
        <div className="snow-layer far" aria-hidden="true" />
        <div className="snow-layer near" aria-hidden="true" />
      </div>
    );
  }

  if (pattern === "snow-globe") {
    return (
      <div className="snow-stage globe-stage h-full w-full">
        <div className="globe-figure">
          <div className="globe">
            <div
              className="pine"
              style={{ "--x": "30%", "--w": "34%", "--b": "12%" } as React.CSSProperties}
              aria-hidden="true"
            />
            <div className="scene-ground" aria-hidden="true" />
            <div className="snow-layer g-far" aria-hidden="true" />
            <div className="snow-layer g-near" aria-hidden="true" />
            <div className="globe-glare" aria-hidden="true" />
          </div>
          <div className="globe-stand" aria-hidden="true" />
          <p className="globe-hint">Hover or press to swirl</p>
        </div>
      </div>
    );
  }

  if (pattern === "light-flurry") {
    return (
      <div className="snow-stage flurry h-full w-full">
        <div className="snow-layer far" aria-hidden="true" />
        <div className="snow-layer mid flurry-extra" aria-hidden="true" />
        <div className="flake-field" aria-hidden="true">
          {FLURRY_FLAKES.map((f, i) => (
            <span key={i} className="flake" style={flakeStyle(f)} />
          ))}
        </div>
      </div>
    );
  }

  // frosted-hero
  return (
    <div className="snow-stage hero-stage h-full w-full">
      <div className="scene-moon" aria-hidden="true" />
      <div className="snow-layer far" aria-hidden="true" />
      <div className="snow-layer mid" aria-hidden="true" />
      <div className="hero-card">
        <p className="hero-eyebrow">Winter '26 · CSS only</p>
        <h3 className="hero-title">First tracks.</h3>
        <p className="hero-copy">
          No canvas. No requestAnimationFrame. Just background tiles, keyframes and a frosted pane.
        </p>
      </div>
      <div className="snow-layer hero-front" aria-hidden="true" />
    </div>
  );
}
