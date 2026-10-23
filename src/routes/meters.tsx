import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BatteryFull, HardDrive } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/meters")({
  head: () => ({
    meta: [
      { title: "Meters & Gauges — CSS Showcase" },
      {
        name: "description",
        content:
          "The meter element colors itself by optimum, suboptimal, and critical ranges — plus a segmented gauge driven by data attributes.",
      },
      { property: "og:title", content: "Meters & Gauges — CSS Showcase" },
      {
        property: "og:description",
        content: "Scalar gauges with range-aware coloring — progress can't do that.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MetersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "scalar" | "score" | "segments" | "rows";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "scalar", label: "Native meters", desc: "low / high / optimum range coloring" },
    { id: "score", label: "Score gauge", desc: "Webkit pseudo-elements on a meter" },
    { id: "segments", label: "Segmented gauge", desc: "Custom bar driven by data attributes" },
  ],
  ipad: [
    { id: "scalar", label: "Native meters", desc: "low / high / optimum range coloring" },
    { id: "score", label: "Score gauge", desc: "Webkit pseudo-elements on a meter" },
  ],
  mobile: [{ id: "rows", label: "Storage rows", desc: "Compact meters with labels" }],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  scalar: `/* Native meters — the UA picks color by range */
.scalar-list {
  display: grid;
  gap: 1.1rem;
  max-inline-size: 22rem;
  inline-size: 100%;
}

.scalar-list .scalar {
  display: grid;
  gap: 0.35rem;
}

.scalar-list .scalar-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
}

.scalar-list .scalar-head span:last-child {
  font-variant-numeric: tabular-nums;
  color: var(--muted-foreground);
}

/* One line of CSS styles every meter in every browser */
.scalar-list meter {
  inline-size: 100%;
  block-size: 0.75rem;
  accent-color: var(--primary);
}

/* Values 65-85 read "fine"; 90+ crosses high and shifts to warning —
   the color change comes from the element, not a class */`,
  score: `/* Score gauge with webkit pseudo-elements */
.score {
  display: grid;
  gap: 0.5rem;
  max-inline-size: 22rem;
  inline-size: 100%;
}

.score meter {
  inline-size: 100%;
  block-size: 1.1rem;
  appearance: none;
  -webkit-appearance: none;
}

/* Webkit splits the meter into paintable regions */
.score meter::-webkit-meter-bar {
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 999px;
}

.score meter::-webkit-meter-optimum-value {
  background: var(--primary);
  border-radius: 999px;
  transition: background-color 0.3s ease;
}

.score meter::-webkit-meter-suboptimum-value {
  background: #eab308;
  border-radius: 999px;
}

.score meter::-webkit-meter-even-less-good-value {
  background: var(--destructive);
  border-radius: 999px;
}

.score meter::-moz-meter-bar { background: var(--primary); }

.score .score-num {
  font-size: 1.6rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}`,
  segments: `/* Segmented gauge */
.seg-gauge { display: grid; gap: 0.7rem; max-inline-size: 22rem; inline-size: 100%; }

.seg-gauge .seg-bar {
  display: flex;
  gap: 4px;
  block-size: 1.4rem;
}

.seg-gauge .seg-bar i {
  flex: 1;
  border-radius: 3px;
  background: var(--muted);
  transition: background-color 0.25s ease;
}

/* data-filled up to the current value — no per-segment classes */
.seg-gauge .seg-bar[data-level="ok"] i[data-filled="true"] { background: var(--primary); }
.seg-gauge .seg-bar[data-level="warn"] i[data-filled="true"] { background: #eab308; }
.seg-gauge .seg-bar[data-level="crit"] i[data-filled="true"] { background: var(--destructive); }

.seg-gauge input[type="range"] {
  inline-size: 100%;
  accent-color: var(--primary);
}

.seg-gauge .seg-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
}`,
  rows: `/* Storage rows */
.storage-list {
  display: grid;
  gap: 0.9rem;
  inline-size: 100%;
}

.storage-list .row {
  display: grid;
  gap: 0.4rem;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  background: var(--card);
  padding: 0.7rem 0.9rem;
}

.storage-list .row-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
}

.storage-list .row-head span:last-child {
  margin-inline-start: auto;
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
}

.storage-list meter {
  inline-size: 100%;
  block-size: 0.6rem;
  accent-color: var(--primary);
}

.storage-list meter[data-warn] { accent-color: #eab308; }`,
};

function MetersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "scalar",
      ipad: "scalar",
      mobile: "rows",
    }),
  );
  const [level, setLevel] = useState(72);
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const levelState = level >= 90 ? "crit" : level >= 70 ? "warn" : "ok";

  const renderDemo = () => {
    if (pattern === "scalar") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="scalar-list">
            <div className="scalar">
              <div className="scalar-head">
                <span>Bandwidth used</span>
                <span>68 / 100 GB</span>
              </div>
              {/* low=80 high=95 optimum=50: 68 is in the normal band */}
              <meter
                value={68}
                min={0}
                max={100}
                low={80}
                high={95}
                optimum={50}
                aria-label="Bandwidth used: 68 of 100 gigabytes"
              />
            </div>
            <div className="scalar">
              <div className="scalar-head">
                <span>Bandwidth used</span>
                <span>92 / 100 GB</span>
              </div>
              {/* Same attributes — 92 crosses high, UA shifts the color */}
              <meter
                value={92}
                min={0}
                max={100}
                low={80}
                high={95}
                optimum={50}
                aria-label="Bandwidth used: 92 of 100 gigabytes"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Same element, same attributes — only the value changed. The range coloring is the
              UA's, via low / high / optimum.
            </p>
          </div>
        </div>
      );
    }
    if (pattern === "score") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="score">
            <div className="flex items-end justify-between">
              <span className="text-xs font-semibold">Lighthouse-style score</span>
              <output className="score-num" aria-live="polite">
                {level}
              </output>
            </div>
            {/* optimum=100 high=90: below 90 leaves the optimum band */}
            <meter
              value={level}
              min={0}
              max={100}
              low={50}
              high={90}
              optimum={100}
              aria-label={`Score ${level} of 100`}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              aria-label="Adjust score"
            />
            <p className="text-[11px] text-muted-foreground">
              Drag below 50 — ::-webkit-meter-even-less-good-value takes over.
            </p>
          </div>
        </div>
      );
    }
    if (pattern === "segments") {
      const filled = Math.round((level / 100) * 12);
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="seg-gauge">
            <div
              className="seg-bar"
              data-level={levelState}
              role="meter"
              aria-valuenow={level}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Capacity"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <i key={i} data-filled={i < filled ? "true" : "false"} />
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              aria-label="Capacity percent"
            />
            <div className="seg-label">
              <span>0%</span>
              <span>
                {level}% —{" "}
                {levelState === "ok" ? "healthy" : levelState === "warn" ? "elevated" : "critical"}
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full flex-col justify-center gap-2 overflow-auto p-4">
        <div className="storage-list">
          <div className="row">
            <div className="row-head">
              <HardDrive className="h-3.5 w-3.5" />
              <span>Photos</span>
              <span>24.1 GB</span>
            </div>
            <meter
              value={48}
              min={0}
              max={64}
              low={48}
              high={58}
              optimum={20}
              aria-label="Photos: 24.1 of 64 gigabytes"
            />
          </div>
          <div className="row">
            <div className="row-head">
              <HardDrive className="h-3.5 w-3.5" />
              <span>Video</span>
              <span>41 GB</span>
            </div>
            <meter
              value={41}
              min={0}
              max={64}
              low={48}
              high={58}
              optimum={20}
              data-warn=""
              aria-label="Video: 41 of 64 gigabytes"
            />
          </div>
          <div className="row">
            <div className="row-head">
              <BatteryFull className="h-3.5 w-3.5" />
              <span>Cache</span>
              <span>3.2 GB</span>
            </div>
            <meter
              value={3.2}
              min={0}
              max={64}
              low={48}
              high={58}
              optimum={20}
              aria-label="Cache: 3.2 of 64 gigabytes"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How full is the tank?
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            The meter element colors itself by optimum, suboptimal, and critical ranges — a semantic
            gauge <em>progress</em> can't be. Plus a segmented bar driven by data attributes.
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
            <DeviceFrame device={device}>{renderDemo()}</DeviceFrame>
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
                meter-{pattern}.css
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
              <li>• meter low / high / optimum</li>
              <li>• meter::-webkit-meter-*</li>
              <li>• ::-moz-meter-bar</li>
              <li>• accent-color</li>
              <li>• data-attribute state</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .scalar-list {
          display: grid;
          gap: 1.1rem;
          max-inline-size: 22rem;
          inline-size: 100%;
        }
        .scalar-list .scalar { display: grid; gap: 0.35rem; }
        .scalar-list .scalar-head {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .scalar-list .scalar-head span:last-child {
          font-variant-numeric: tabular-nums;
          color: var(--muted-foreground);
        }
        .scalar-list meter,
        .storage-list meter {
          inline-size: 100%;
          accent-color: var(--primary);
        }
        .scalar-list meter { block-size: 0.75rem; }
        .storage-list meter { block-size: 0.6rem; }
        .storage-list meter[data-warn] { accent-color: #eab308; }

        .score {
          display: grid;
          gap: 0.5rem;
          max-inline-size: 22rem;
          inline-size: 100%;
        }
        .score meter {
          inline-size: 100%;
          block-size: 1.1rem;
          appearance: none;
          -webkit-appearance: none;
        }
        .score meter::-webkit-meter-bar {
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 999px;
        }
        .score meter::-webkit-meter-optimum-value {
          background: var(--primary);
          border-radius: 999px;
          transition: background-color 0.3s ease;
        }
        .score meter::-webkit-meter-suboptimum-value {
          background: #eab308;
          border-radius: 999px;
        }
        .score meter::-webkit-meter-even-less-good-value {
          background: var(--destructive);
          border-radius: 999px;
        }
        .score meter::-moz-meter-bar { background: var(--primary); }
        .score .score-num {
          font-size: 1.6rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }

        .seg-gauge {
          display: grid;
          gap: 0.7rem;
          max-inline-size: 22rem;
          inline-size: 100%;
        }
        .seg-gauge .seg-bar {
          display: flex;
          gap: 4px;
          block-size: 1.4rem;
        }
        .seg-gauge .seg-bar i {
          flex: 1;
          border-radius: 3px;
          background: var(--muted);
          transition: background-color 0.25s ease;
        }
        .seg-gauge .seg-bar[data-level="ok"] i[data-filled="true"] { background: var(--primary); }
        .seg-gauge .seg-bar[data-level="warn"] i[data-filled="true"] { background: #eab308; }
        .seg-gauge .seg-bar[data-level="crit"] i[data-filled="true"] { background: var(--destructive); }
        .seg-gauge input[type="range"] { inline-size: 100%; accent-color: var(--primary); }
        .seg-gauge .seg-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--muted-foreground);
          font-variant-numeric: tabular-nums;
        }

        .storage-list { display: grid; gap: 0.9rem; inline-size: 100%; }
        .storage-list .row {
          display: grid;
          gap: 0.4rem;
          border: 1px solid var(--border);
          border-radius: 0.9rem;
          background: var(--card);
          padding: 0.7rem 0.9rem;
        }
        .storage-list .row-head {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .storage-list .row-head span:last-child {
          margin-inline-start: auto;
          color: var(--muted-foreground);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </main>
  );
}

function DeviceFrame({ device, children }: { device: Device; children: React.ReactNode }) {
  const style: Record<Device, React.CSSProperties> = {
    desktop: { aspectRatio: "16 / 10", maxWidth: "100%", borderRadius: "0.75rem" },
    ipad: { aspectRatio: "4 / 3", maxWidth: "88%", borderRadius: "1.5rem" },
    mobile: { aspectRatio: "9 / 19.5", maxWidth: "220px", borderRadius: "2rem" },
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
