import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Circle, CircleDot, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/radios")({
  head: () => ({
    meta: [
      { title: "Radio Buttons — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Radio groups, card selectors, and segmented controls morphed for mobile, iPad, and desktop using container queries.",
      },
      { property: "og:title", content: "Radio Buttons — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One radio component reshaped for mobile, iPad, and desktop with CSS grid, transitions, and container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RadiosDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.radio-app {
  container-type: inline-size;
}

.radio-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

/* iPad: two-column cards */
@container (min-width: 420px) {
  .radio-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: horizontal toolbars */
@container (min-width: 680px) {
  .radio-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .segmented-control {
    flex-direction: row;
  }
}`;

const PLANS = [
  { id: "starter", label: "Starter", price: "$0/mo", description: "For side projects" },
  { id: "pro", label: "Pro", price: "$19/mo", description: "For growing teams" },
  { id: "team", label: "Team", price: "$49/mo", description: "For organizations" },
];

const FREQUENCIES = [
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "monthly", label: "Monthly" },
];

function RadiosDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [plan, setPlan] = useState<string>("pro");
  const [frequency, setFrequency] = useState<string>("monthly");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Radio buttons & single choice.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Classic radio groups, selectable cards, and segmented controls — all in one
            component that reshapes for mobile, iPad, and desktop with container queries.
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
              {device}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device}>
              <div className="radio-app h-full w-full overflow-auto p-3">
                <div className="radio-grid">
                  {/* Segmented control */}
                  <div className="radio-card col-span-full">
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Billing frequency
                    </label>
                    <div className="segmented-control" role="radiogroup" aria-label="Billing frequency">
                      {FREQUENCIES.map((f) => {
                        const active = f.id === frequency;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setFrequency(f.id)}
                            className={`segmented-item flex-1 rounded-md px-3 py-1.5 text-[10px] font-semibold transition ${
                              active
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {f.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Classic radio list */}
                  <div className="radio-card">
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Plan
                    </label>
                    <div className="space-y-1.5" role="radiogroup" aria-label="Plan">
                      {PLANS.map((p) => {
                        const active = p.id === plan;
                        return (
                          <label
                            key={p.id}
                            className={`radio-row flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 transition ${
                              active
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-accent/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="plan"
                              value={p.id}
                              checked={active}
                              onChange={() => setPlan(p.id)}
                              className="sr-only"
                            />
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                active
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background"
                              }`}
                            >
                              {active && <CircleDot className="h-2.5 w-2.5" />}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="text-[10px] font-semibold">{p.label}</span>
                              <span className="text-[9px] text-muted-foreground">
                                {p.price}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card selector */}
                  <div className="radio-card col-span-full sm:col-span-2">
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Select a plan
                    </label>
                    <div className="space-y-1.5" role="radiogroup" aria-label="Select a plan">
                      {PLANS.map((p) => {
                        const active = p.id === plan;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setPlan(p.id)}
                            className={`radio-plan w-full rounded-xl border p-2 text-left transition ${
                              active
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border bg-card hover:bg-accent/50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-[10px] font-semibold">{p.label}</div>
                                <div className="text-[9px] text-muted-foreground">
                                  {p.description}
                                </div>
                              </div>
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background"
                                }`}
                              >
                                {active && <Circle className="h-2 w-2 fill-current" />}
                              </span>
                            </div>
                            <div className="mt-1 text-[10px] font-bold">{p.price}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
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

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">radios.css</span>
              <button
                onClick={() => navigator.clipboard?.writeText(CSS_CODE)}
                className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto bg-card px-4 py-4 text-[11px] leading-relaxed sm:text-xs">
              <code>{CSS_CODE}</code>
            </pre>
          </div>

          <div className="border-t px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CSS features used
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground">
              <li>• Container queries</li>
              <li>• CSS Grid responsive columns</li>
              <li>• Custom radio styling</li>
              <li>• Segmented controls</li>
              <li>• Selectable cards</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .radio-app {
          container-type: inline-size;
          position: relative;
        }

        .radio-grid {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: 1fr;
          align-content: start;
        }

        .radio-card {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
        }

        .segmented-control {
          display: flex;
          gap: 0.25rem;
          padding: 0.25rem;
          border-radius: 0.625rem;
          background: hsl(var(--muted));
        }

        .radio-row {
          border-color: hsl(var(--border));
        }

        .radio-plan {
          border-color: hsl(var(--border));
        }

        @container (min-width: 420px) {
          .radio-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .radio-card.col-span-full {
            grid-column: 1 / -1;
          }
        }

        @container (min-width: 680px) {
          .radio-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .segmented-control {
            display: inline-flex;
            width: auto;
          }
        }
      `}</style>
    </main>
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
