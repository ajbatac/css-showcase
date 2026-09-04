import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Upload } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Indicators — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Animated progress indicator patterns — labelled linear bars, indeterminate stripes, conic-gradient rings, step wizards, top-of-page bars, and ring badges — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Progress Indicators — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Determinate and indeterminate progress UI built with linear-gradient bars and conic-gradient rings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "linear-bars" | "circular" | "steps" | "thin-top" | "ring-badges";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "linear-bars", label: "Linear bars", desc: "Labelled determinate bars + indeterminate stripe" },
    { id: "circular", label: "Circular", desc: "Conic-gradient rings with percentage" },
    { id: "steps", label: "Step wizard", desc: "Multi-step progress with completed/current/upcoming" },
  ],
  ipad: [
    { id: "linear-bars", label: "Linear bars", desc: "Labelled determinate bars + indeterminate stripe" },
    { id: "circular", label: "Circular", desc: "Conic-gradient rings with percentage" },
  ],
  mobile: [
    { id: "thin-top", label: "Thin top bar", desc: "Page-top progress bar + upload rows" },
    { id: "ring-badges", label: "Ring badges", desc: "Small conic rings in a list" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "linear-bars": `/* Determinate + indeterminate bars */
.progress-track {
  height: 0.5rem;
  border-radius: 999px;
  background: color-mix(in oklch, var(--foreground) 10%, transparent);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--primary);
  transition: width 0.4s ease;
}

.progress-track[data-indeterminate="true"] .progress-fill {
  width: 40%;
  animation: progress-slide 1.2s ease-in-out infinite;
}

@keyframes progress-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}`,
  circular: `/* Conic-gradient circular progress */
.progress-ring {
  --pct: 0%;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: conic-gradient(
    var(--primary) var(--pct),
    color-mix(in oklch, var(--foreground) 10%, transparent) var(--pct)
  );
  display: grid;
  place-items: center;
  transition: background 0.4s ease;
}

.progress-ring::after {
  content: "";
  width: 72%;
  height: 72%;
  border-radius: 50%;
  background: var(--card);
}`,
  steps: `/* Step wizard progress */
.progress-steps {
  display: flex;
  align-items: center;
}

.progress-steps .step-dot {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid var(--border);
}

.progress-steps .step-dot[data-state="done"] {
  background: var(--primary);
  border-color: var(--primary);
}

.progress-steps .step-dot[data-state="current"] {
  border-color: var(--primary);
}

.progress-steps .step-line {
  flex: 1;
  height: 2px;
  background: var(--border);
}

.progress-steps .step-line[data-state="done"] {
  background: var(--primary);
}`,
  "thin-top": `/* Page-top thin progress bar */
.thin-top-bar {
  position: sticky;
  top: 0;
  height: 3px;
  width: 100%;
  background: color-mix(in oklch, var(--foreground) 10%, transparent);
  z-index: 20;
}

.thin-top-bar > span {
  display: block;
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}`,
  "ring-badges": `/* Small conic ring badges in a list */
.ring-badge {
  --pct: 0%;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: conic-gradient(
    var(--primary) var(--pct),
    color-mix(in oklch, var(--foreground) 10%, transparent) var(--pct)
  );
  display: grid;
  place-items: center;
}

.ring-badge::after {
  content: "";
  width: 68%;
  height: 68%;
  border-radius: 50%;
  background: var(--card);
}`,
};

const FEATURES_BY_PATTERN: Record<Pattern, string[]> = {
  "linear-bars": ["CSS transitions on width", "keyframes indeterminate slide", "color-mix track tint", "Semantic tokens"],
  circular: ["conic-gradient rings", "CSS custom property --pct", "::after mask circle", "Transition on background"],
  steps: ["Flexbox step layout", "data-state attribute styling", "Border + background swap", "Semantic tokens"],
  "thin-top": ["position: sticky bar", "Nested span width transition", "color-mix background tint", "z-index layering"],
  "ring-badges": ["conic-gradient badges", "CSS custom property --pct", "Compact list layout", "::after mask circle"],
};

function useTicker(active: boolean, max = 100, step = 3, intervalMs = 350) {
  const [value, setValue] = useState(12);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setValue((v) => (v + step >= max ? 8 : v + step));
    }, intervalMs);
    return () => clearInterval(id);
  }, [active, max, step, intervalMs]);
  return value;
}

function ProgressDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "linear-bars",
      ipad: "linear-bars",
      mobile: "thin-top",
    }),
  );

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const active1 = useTicker(pattern === "linear-bars" || pattern === "circular", 96, 4, 400);
  const active2 = useTicker(pattern === "linear-bars" || pattern === "circular", 92, 3, 550);
  const active3 = useTicker(pattern === "thin-top", 100, 5, 300);
  const active4 = useTicker(pattern === "ring-badges", 100, 6, 450);
  const active5 = useTicker(pattern === "ring-badges", 100, 4, 600);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Progress that keeps moving.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Animated linear bars, conic-gradient rings, and step wizards — driven by React state
            and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">setInterval</code>, styled
            with semantic tokens.
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
              <div
                data-pattern={pattern}
                className="progress-demo h-full w-full overflow-auto text-[9px] text-muted-foreground"
              >
                {pattern === "linear-bars" && (
                  <div className="flex flex-col gap-3 p-3">
                    <div>
                      <div className="mb-1 flex justify-between text-foreground">
                        <span>Uploading video.mp4</span>
                        <span>{active1}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${active1}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-foreground">
                        <span>Processing thumbnails</span>
                        <span>{active2}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${active2}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-foreground">Syncing to cloud</div>
                      <div className="progress-track" data-indeterminate="true">
                        <div className="progress-fill" />
                      </div>
                    </div>
                  </div>
                )}

                {pattern === "circular" && (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-3">
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="progress-ring"
                          style={{ ["--pct" as string]: `${active1}%` }}
                        >
                          <span className="relative z-10 font-bold text-foreground">
                            {active1}%
                          </span>
                        </div>
                        <span>Downloads</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="progress-ring"
                          style={{ ["--pct" as string]: `${active2}%` }}
                        >
                          <span className="relative z-10 font-bold text-foreground">
                            {active2}%
                          </span>
                        </div>
                        <span>Storage</span>
                      </div>
                    </div>
                  </div>
                )}

                {pattern === "steps" && (
                  <div className="flex h-full flex-col justify-center gap-6 p-4">
                    <div className="progress-steps">
                      <div className="step-dot" data-state="done">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                      <div className="step-line" data-state="done" />
                      <div className="step-dot" data-state="done">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                      <div className="step-line" data-state="done" />
                      <div className="step-dot" data-state="current" />
                      <div className="step-line" data-state="upcoming" />
                      <div className="step-dot" data-state="upcoming" />
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Cart</span>
                      <span>Shipping</span>
                      <span className="font-semibold">Payment</span>
                      <span>Confirm</span>
                    </div>
                  </div>
                )}

                {pattern === "thin-top" && (
                  <div className="flex h-full flex-col">
                    <div className="thin-top-bar">
                      <span style={{ width: `${active3}%` }} />
                    </div>
                    <div className="flex flex-col gap-2 p-3">
                      <p className="font-semibold text-foreground">Uploads</p>
                      {[
                        { name: "resume.pdf", pct: active3 },
                        { name: "photo.jpg", pct: Math.min(100, active3 + 20) },
                      ].map((f) => (
                        <div key={f.name} className="flex items-center gap-2">
                          <Upload className="h-3 w-3 shrink-0 text-foreground" />
                          <span className="flex-1 truncate text-foreground">{f.name}</span>
                          <span>{f.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pattern === "ring-badges" && (
                  <div className="flex flex-col gap-2 p-3">
                    {[
                      { label: "Design system", pct: active4 },
                      { label: "API migration", pct: active5 },
                      { label: "Onboarding flow", pct: Math.max(10, 100 - active4) },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div
                          className="ring-badge"
                          style={{ ["--pct" as string]: `${item.pct}%` }}
                        />
                        <span className="flex-1 truncate text-foreground">{item.label}</span>
                        <span>{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DeviceFrame>
          </div>

          <div
            role="tablist"
            aria-label="Device viewport"
            className="grid grid-cols-3 gap-2 border-t bg-background/50 p-3"
          >
            {DEVICES.map((d) => {
              const active = device === d.id;
              return (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDevice(d.id)}
                  className={`flex min-h-11 flex-col items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  <span>{d.label}</span>
                  <span
                    className={`mt-0.5 text-[10px] font-normal ${
                      active ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {d.hint}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {device} design patterns
              </p>
              <CopyLinkButton device={device} pattern={pattern} />
            </div>
            <div role="tablist" aria-label="Design pattern" className="grid gap-2">
              {options.map((o) => {
                const active = pattern === o.id;
                return (
                  <button
                    key={o.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPatterns((prev) => ({ ...prev, [device]: o.id }))}
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">{o.label}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {o.desc}
                      </span>
                    </span>
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        active ? "bg-primary" : "bg-border"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                progress-{pattern}.css
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(CSS_BY_PATTERN[pattern])}
                className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                Copy
              </button>
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
              {FEATURES_BY_PATTERN[pattern].map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .progress-track {
          height: 0.5rem;
          border-radius: 999px;
          background: color-mix(in oklch, var(--foreground) 10%, transparent);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: var(--primary);
          transition: width 0.4s ease;
        }

        .progress-track[data-indeterminate="true"] .progress-fill {
          width: 40%;
          animation: progress-slide 1.2s ease-in-out infinite;
        }

        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }

        .progress-ring {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          background: conic-gradient(
            var(--primary) var(--pct, 0%),
            color-mix(in oklch, var(--foreground) 10%, transparent) var(--pct, 0%)
          );
          display: grid;
          place-items: center;
          position: relative;
          transition: background 0.4s ease;
        }

        .progress-ring::after {
          content: "";
          position: absolute;
          width: 72%;
          height: 72%;
          border-radius: 50%;
          background: var(--card);
        }

        .progress-steps {
          display: flex;
          align-items: center;
        }

        .progress-steps .step-dot {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 2px solid var(--border);
          flex-shrink: 0;
        }

        .progress-steps .step-dot[data-state="done"] {
          background: var(--primary);
          border-color: var(--primary);
        }

        .progress-steps .step-dot[data-state="current"] {
          border-color: var(--primary);
        }

        .progress-steps .step-line {
          flex: 1;
          height: 2px;
          background: var(--border);
        }

        .progress-steps .step-line[data-state="done"] {
          background: var(--primary);
        }

        .thin-top-bar {
          position: sticky;
          top: 0;
          height: 3px;
          width: 100%;
          background: color-mix(in oklch, var(--foreground) 10%, transparent);
          z-index: 20;
        }

        .thin-top-bar > span {
          display: block;
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        .ring-badge {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          background: conic-gradient(
            var(--primary) var(--pct, 0%),
            color-mix(in oklch, var(--foreground) 10%, transparent) var(--pct, 0%)
          );
          display: grid;
          place-items: center;
          position: relative;
          flex-shrink: 0;
        }

        .ring-badge::after {
          content: "";
          position: absolute;
          width: 68%;
          height: 68%;
          border-radius: 50%;
          background: var(--card);
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
