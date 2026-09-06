import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Inbox, Plus, RefreshCw, Search, WifiOff } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/empty-states")({
  head: () => ({
    meta: [
      { title: "Empty States — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Empty state patterns — centered hero, illustrated card, no-results, offline notice, and inline compact rows — across mobile, iPad, and desktop viewports.",
      },
      { property: "og:title", content: "Empty States — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Centered heroes, illustrated cards, no-results feedback, offline notices, and compact inline empties.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmptyStatesDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "centered-hero"
  | "illustrated-card"
  | "no-results"
  | "offline"
  | "inline-compact";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "centered-hero", label: "Centered hero", desc: "Grid place-items centered CTA" },
    { id: "illustrated-card", label: "Illustrated card", desc: "Card with gradient art panel" },
    { id: "no-results", label: "No results", desc: "Search feedback with suggestions" },
  ],
  ipad: [
    { id: "illustrated-card", label: "Illustrated card", desc: "Card with gradient art panel" },
    { id: "offline", label: "Offline notice", desc: "Retry-focused connection state" },
  ],
  mobile: [
    { id: "centered-hero", label: "Centered hero", desc: "Full-height centered CTA" },
    { id: "inline-compact", label: "Inline compact", desc: "Dashed row inside a list" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "centered-hero": `/* Perfectly centered empty state, no wrapper math */
.empty-hero {
  display: grid;
  place-items: center;
  min-height: 100%;
  text-align: center;
  gap: 0.5rem;
  padding: 1rem;
}

.empty-hero .art {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  width: 3.5rem;
  border-radius: 9999px;
  background: color-mix(in oklch, var(--primary) 12%, transparent);
}`,
  "illustrated-card": `/* Card with a gradient illustration panel */
.empty-card {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  overflow: hidden;
}

.empty-card .art {
  aspect-ratio: 16 / 7;
  background:
    radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 60%),
    linear-gradient(140deg, var(--muted), var(--background));
}`,
  "no-results": `/* No-results feedback with suggestion chips */
.empty-results {
  display: grid;
  gap: 0.5rem;
  justify-items: center;
  text-align: center;
}

.empty-results .chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem;
}

.empty-results .chip {
  border: 1px solid var(--border);
  border-radius: 9999px;
  padding: 0.15rem 0.5rem;
}`,
  offline: `/* Offline notice — tone via color-mix, retry affordance */
.empty-offline {
  display: grid;
  place-items: center;
  gap: 0.5rem;
  min-height: 100%;
  text-align: center;
  background: color-mix(in oklch, oklch(0.8 0.15 85) 8%, transparent);
}

.empty-offline .retry {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 9999px;
  background: var(--primary);
  color: var(--primary-foreground);
  padding: 0.25rem 0.7rem;
}`,
  "inline-compact": `/* Dashed inline empty row inside a list */
.empty-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: 1px dashed var(--border);
  border-radius: 0.6rem;
  padding: 0.6rem;
}`,
};

function EmptyStatesDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "centered-hero",
      ipad: "illustrated-card",
      mobile: "centered-hero",
    }),
  );

  const pattern = patterns[device];
  const options = PATTERNS[device];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Nothing here — on purpose.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Empty states that guide instead of dead-end: centered heroes, illustrated cards,
            no-results feedback, offline notices, and compact inline rows.
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
                className="empty-demo h-full w-full overflow-auto text-[9px] text-muted-foreground"
              >
                {pattern === "centered-hero" && (
                  <div className="empty-hero">
                    <span className="art">
                      <Inbox className="h-5 w-5 text-primary" />
                    </span>
                    <p className="text-[11px] font-semibold text-foreground">No messages yet</p>
                    <p className="max-w-[80%]">
                      When someone writes to you, the conversation shows up right here.
                    </p>
                    <button className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">
                      <Plus className="h-3 w-3" /> New message
                    </button>
                  </div>
                )}

                {pattern === "illustrated-card" && (
                  <div className="p-3">
                    <div className="empty-card">
                      <div className="art" />
                      <div className="grid gap-1 p-3">
                        <p className="text-[11px] font-semibold text-foreground">
                          Your library is empty
                        </p>
                        <p>Add your first project and it will appear in this space.</p>
                        <div className="mt-1 flex gap-1.5">
                          <button className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-semibold text-primary-foreground">
                            <Plus className="h-3 w-3" /> Create
                          </button>
                          <button className="rounded-md border px-2 py-1 font-semibold text-foreground">
                            Import
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {pattern === "no-results" && (
                  <div className="grid h-full place-items-center p-3">
                    <div className="empty-results">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                        <Search className="h-4 w-4 text-foreground" />
                      </span>
                      <p className="text-[11px] font-semibold text-foreground">
                        No results for “quarterly rev”
                      </p>
                      <p>Check the spelling or try a broader term.</p>
                      <div className="chips">
                        {["revenue", "reports", "Q3", "forecast"].map((c) => (
                          <span key={c} className="chip text-foreground">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {pattern === "offline" && (
                  <div className="empty-offline p-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-background">
                      <WifiOff className="h-4 w-4 text-foreground" />
                    </span>
                    <p className="text-[11px] font-semibold text-foreground">You’re offline</p>
                    <p className="max-w-[75%]">
                      We’ll load your data as soon as the connection is back.
                    </p>
                    <button className="retry font-semibold">
                      <RefreshCw className="h-3 w-3" /> Retry
                    </button>
                  </div>
                )}

                {pattern === "inline-compact" && (
                  <div className="grid gap-1.5 p-3">
                    {["Today", "Yesterday"].map((label) => (
                      <div key={label} className="grid gap-1">
                        <p className="text-[10px] font-semibold text-foreground">{label}</p>
                        <div className="rounded-lg border p-2 text-foreground">Standup notes</div>
                      </div>
                    ))}
                    <p className="text-[10px] font-semibold text-foreground">This week</p>
                    <div className="empty-inline">
                      <Plus className="h-3 w-3" /> No entries — add one
                    </div>
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
                empty-{pattern}.css
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
              <li>• display: grid + place-items</li>
              <li>• aspect-ratio art panels</li>
              <li>• color-mix() tonal surfaces</li>
              <li>• radial + linear gradients</li>
              <li>• flex-wrap suggestion chips</li>
              <li>• Dashed inline placeholders</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .empty-hero {
          display: grid;
          place-items: center;
          align-content: center;
          min-height: 100%;
          text-align: center;
          gap: 0.35rem;
          padding: 1rem;
        }

        .empty-hero .art {
          display: grid;
          place-items: center;
          aspect-ratio: 1;
          width: 2.6rem;
          border-radius: 9999px;
          background: color-mix(in oklch, var(--primary) 14%, transparent);
        }

        .empty-card {
          display: grid;
          grid-template-rows: auto 1fr;
          border: 1px solid var(--border);
          border-radius: 0.9rem;
          overflow: hidden;
        }

        .empty-card .art {
          aspect-ratio: 16 / 7;
          background:
            radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 60%),
            linear-gradient(140deg, var(--muted), var(--background));
        }

        .empty-results {
          display: grid;
          gap: 0.4rem;
          justify-items: center;
          text-align: center;
        }

        .empty-results .chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.3rem;
        }

        .empty-results .chip {
          border: 1px solid var(--border);
          border-radius: 9999px;
          padding: 0.15rem 0.5rem;
        }

        .empty-offline {
          display: grid;
          place-items: center;
          align-content: center;
          gap: 0.4rem;
          min-height: 100%;
          text-align: center;
          background: color-mix(in oklch, oklch(0.8 0.15 85) 8%, transparent);
        }

        .empty-offline .retry {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          border-radius: 9999px;
          background: var(--primary);
          color: var(--primary-foreground);
          padding: 0.25rem 0.7rem;
        }

        .empty-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          border: 1px dashed var(--border);
          border-radius: 0.6rem;
          padding: 0.6rem;
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
