import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/loaders")({
  head: () => ({
    meta: [
      { title: "Loaders — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Skeleton screens, spinners, progress bars, and shimmer placeholders — one loading system reshaped per device with CSS animations and container queries.",
      },
      { property: "og:title", content: "Loaders — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Per-device loading patterns: desktop skeleton grids and spinner rows, iPad list skeletons, mobile shimmer feeds and dot pulses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoadersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "skeleton-grid" | "spinner-row" | "progress-stack" | "skeleton-list" | "orbital-spinners" | "shimmer-feed" | "dot-pulse" | "inline-skeleton";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "skeleton-grid", label: "Skeleton card grid", desc: "Responsive auto-fill placeholders" },
    { id: "spinner-row", label: "Spinner row", desc: "Circular, dots, and bar loaders" },
    { id: "progress-stack", label: "Progress stack", desc: "Multiple tracked sections" },
  ],
  ipad: [
    { id: "skeleton-list", label: "Skeleton list", desc: "Two-line rows with avatar blocks" },
    { id: "orbital-spinners", label: "Orbital spinners", desc: "Concentric ring loaders" },
  ],
  mobile: [
    { id: "shimmer-feed", label: "Shimmer feed", desc: "Full-bleed story + post blocks" },
    { id: "dot-pulse", label: "Dot pulse", desc: "Three bouncing dots" },
    { id: "inline-skeleton", label: "Inline skeleton", desc: "Form field placeholders" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "skeleton-grid": `/* Skeleton card grid */
.loader-shell { container-type: inline-size; }

.skeleton-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
}

.skeleton-card {
  display: grid;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: var(--card);
  border: 1px solid var(--border);
}

.skeleton {
  border-radius: 0.375rem;
  background: linear-gradient(90deg,
    var(--muted) 25%,
    color-mix(in oklab, var(--muted-foreground) 15%, transparent) 50%,
    var(--muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}`,
  "spinner-row": `/* Spinner row */
.spinner-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.spinner {
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border: 2px solid var(--muted);
  border-top-color: var(--primary);
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`,
  "progress-stack": `/* Progress stack */
.progress-stack {
  display: grid;
  gap: 0.75rem;
}

.progress-track {
  block-size: 0.5rem;
  border-radius: 999px;
  background: var(--muted);
  overflow: hidden;
}

.progress-bar {
  block-size: 100%;
  border-radius: inherit;
  background: var(--primary);
  animation: load 2s ease-in-out infinite alternate;
}

@keyframes load {
  from { inline-size: 20%; }
  to   { inline-size: 90%; }
}`,
  "skeleton-list": `/* Skeleton list */
.skeleton-list {
  display: grid;
  gap: 0.5rem;
}

.skeleton-row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem;
  border-radius: 0.625rem;
  background: var(--card);
  border: 1px solid var(--border);
}

.skeleton-avatar {
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 999px;
}`,
  "orbital-spinners": `/* Orbital spinners */
.orbital {
  position: relative;
  inline-size: 3rem;
  block-size: 3rem;
}

.orbital::before,
.orbital::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid transparent;
  border-top-color: var(--primary);
  animation: spin 1.2s linear infinite;
}

.orbital::after {
  inset: 0.5rem;
  animation-duration: 0.8s;
  animation-direction: reverse;
}`,
  "shimmer-feed": `/* Shimmer feed */
.shimmer-feed {
  display: grid;
  gap: 0.75rem;
}

.story-strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.story-ring {
  flex: 0 0 auto;
  inline-size: 3.25rem;
  block-size: 3.25rem;
  border-radius: 999px;
  background: var(--muted);
}

.post-card {
  padding: 0.75rem;
  border-radius: 0.875rem;
  background: var(--card);
  border: 1px solid var(--border);
}

.skeleton {
  border-radius: 0.25rem;
  background: var(--muted);
}`,
  "dot-pulse": `/* Dot pulse */
.dot-pulse {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.dot-pulse span {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 999px;
  background: var(--primary);
  animation: bounce 1.1s ease-in-out infinite;
}

.dot-pulse span:nth-child(2) { animation-delay: 0.15s; }
.dot-pulse span:nth-child(3) { animation-delay: 0.3s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-0.35rem); }
}`,
  "inline-skeleton": `/* Inline skeleton */
.inline-skeleton {
  display: grid;
  gap: 0.75rem;
}

.inline-skeleton .field {
  display: grid;
  gap: 0.375rem;
}

.inline-skeleton .label {
  inline-size: 35%;
  block-size: 0.625rem;
  border-radius: 0.25rem;
}

.inline-skeleton .input {
  block-size: 2.25rem;
  border-radius: 0.5rem;
}`,
};

function LoadersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "skeleton-grid",
      ipad: "skeleton-list",
      mobile: "shimmer-feed",
    }),
  );

  const pattern = patterns[device];
  const options = PATTERNS[device];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Loading states, per device.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Skeleton grids on desktop, list placeholders on iPad, and shimmer feeds on
            mobile — all built with CSS animations, container queries, and semantic tokens.
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
              <LoaderStage pattern={pattern} />
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
                      <span className="block truncate text-xs font-semibold">
                        {o.label}
                      </span>
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
                loaders-{pattern}.css
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
              <li>• Container queries</li>
              <li>• CSS keyframe animations</li>
              <li>• Linear-gradient shimmer</li>
              <li>• aspect-ratio rings</li>
              <li>• auto-fill grids</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .skeleton,
        .skeleton-avatar,
        .story-ring,
        .post-card .line,
        .inline-skeleton .label,
        .inline-skeleton .input {
          background: linear-gradient(90deg,
            color-mix(in oklab, var(--muted-foreground) 16%, var(--muted)) 25%,
            color-mix(in oklab, var(--muted-foreground) 36%, var(--muted)) 50%,
            color-mix(in oklab, var(--muted-foreground) 16%, var(--muted)) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }

        .story-ring {
          background: color-mix(in oklab, var(--muted-foreground) 22%, var(--muted));
        }

        .post-card {
          background: var(--card);
          border: 1px solid var(--border);
        }

        .skeleton-card {
          background: var(--card);
          border: 1px solid var(--border);
        }

        .skeleton-row {
          background: var(--card);
          border: 1px solid var(--border);
        }

        .progress-track {
          background: var(--muted);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar {
          background: var(--primary);
          border-radius: inherit;
          animation: load 2s ease-in-out infinite alternate;
        }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        @keyframes load {
          from { inline-size: 20%; }
          to   { inline-size: 90%; }
        }
      `}</style>
    </main>
  );
}

function LoaderStage({ pattern }: { pattern: Pattern }) {
  if (pattern === "skeleton-grid") {
    return (
      <div className="loader-shell h-full w-full overflow-auto p-3">
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton aspect-[4/3] w-full rounded-lg" />
              <div className="skeleton h-3 w-3/4" />
              <div className="skeleton h-2 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pattern === "spinner-row") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
        <div className="spinner-row">
          <div className="spinner" />
          <div className="dot-pulse">
            <span />
            <span />
            <span />
          </div>
          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
            <div className="progress-bar h-full rounded-full bg-primary" />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">Loading content…</p>
      </div>
    );
  }

  if (pattern === "progress-stack") {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 p-4">
        {[
          { label: "Uploading assets", w: "75%" },
          { label: "Parsing data", w: "45%" },
          { label: "Building preview", w: "90%" },
        ].map((item, i) => (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between text-[9px]">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-foreground">{item.w}</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{ inlineSize: item.w, animationDelay: `${i * 0.25}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pattern === "skeleton-list") {
    return (
      <div className="loader-shell h-full w-full overflow-auto p-3">
        <div className="skeleton-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton skeleton-avatar" />
              <div className="grid min-w-0 gap-1.5">
                <div className="skeleton h-2.5 w-3/5" />
                <div className="skeleton h-2 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pattern === "orbital-spinners") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
        <div className="orbital" />
        <p className="text-[10px] text-muted-foreground">Syncing…</p>
      </div>
    );
  }

  if (pattern === "shimmer-feed") {
    return (
      <div className="loader-shell h-full w-full overflow-auto p-2.5">
        <div className="shimmer-feed">
          <div className="story-strip">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="story-ring" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="post-card">
              <div className="flex items-center gap-2">
                <div className="skeleton-avatar" />
                <div className="grid min-w-0 flex-1 gap-1">
                  <div className="skeleton h-2 w-1/3" />
                  <div className="skeleton h-1.5 w-1/4" />
                </div>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="skeleton h-2 w-full" />
                <div className="skeleton h-2 w-5/6" />
              </div>
              <div className="mt-2 aspect-video w-full rounded-lg skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pattern === "dot-pulse") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
        <div className="dot-pulse">
          <span />
          <span />
          <span />
        </div>
        <p className="text-[10px] text-muted-foreground">Thinking…</p>
      </div>
    );
  }

  // inline-skeleton
  return (
    <div className="loader-shell flex h-full w-full flex-col justify-center p-4">
      <div className="inline-skeleton">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="field">
            <div className="skeleton label" />
            <div className="skeleton input" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceFrame({
  device,
  children,
}: {
  device: Device;
  children: React.ReactNode;
}) {
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
      <div className="h-full w-full overflow-hidden rounded-lg bg-card">
        {children}
      </div>
    </div>
  );
}
