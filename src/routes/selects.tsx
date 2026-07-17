import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

export const Route = createFileRoute("/selects")({
  head: () => ({
    meta: [
      { title: "Select Dropdowns & Multi-Select — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Single select, multi-select with chips, and searchable option lists morphed for mobile, iPad, and desktop using container queries.",
      },
      { property: "og:title", content: "Select Dropdowns & Multi-Select — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One select component reshaped for mobile, iPad, and desktop with CSS container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SelectsDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.select-app {
  container-type: inline-size;
}

/* Mobile: stacked, full-width panels */
.select-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

/* iPad: two-column layout */
@container (min-width: 420px) {
  .select-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: compact inline selects */
@container (min-width: 680px) {
  .select-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`;

const ROLES = [
  { id: "designer", label: "Designer" },
  { id: "developer", label: "Developer" },
  { id: "manager", label: "Product Manager" },
  { id: "writer", label: "Technical Writer" },
];

const TAGS = [
  { id: "css", label: "CSS" },
  { id: "react", label: "React" },
  { id: "accessibility", label: "A11y" },
  { id: "performance", label: "Performance" },
  { id: "typescript", label: "TypeScript" },
  { id: "animation", label: "Animation" },
];

function SelectsDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [role, setRole] = useState<string>("developer");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(["react", "css"]));
  const [openPanel, setOpenPanel] = useState<"role" | "tags" | null>("role");

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Select dropdowns & multi-select.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Single select, tag multi-select, and searchable option lists — all in one
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
              <div className="select-app h-full w-full overflow-auto p-3">
                <div className="select-grid">
                  {/* Single select */}
                  <div className="select-card">
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Role
                    </label>
                    <div className="select-control relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenPanel((p) => (p === "role" ? null : "role"))
                        }
                        className="select-trigger flex w-full items-center justify-between rounded-lg border bg-background px-2 py-1.5 text-left text-xs font-medium"
                      >
                        <span>{ROLES.find((r) => r.id === role)?.label}</span>
                        <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                      </button>

                      {openPanel === "role" && (
                        <div className="select-panel border bg-card shadow-lg">
                          <div className="select-handle mx-auto mb-1 h-1 w-8 rounded-full bg-muted-foreground/40" />
                          <ul className="space-y-0.5 p-1">
                            {ROLES.map((r) => {
                              const active = r.id === role;
                              return (
                                <li key={r.id}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRole(r.id);
                                      setOpenPanel(null);
                                    }}
                                    className={`flex w-full items-center justify-between rounded px-1.5 py-1 text-[10px] font-medium transition ${
                                      active
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <span>{r.label}</span>
                                    {active && <Check className="h-3 w-3" />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multi-select with chips */}
                  <div className="select-card col-span-full sm:col-span-2">
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Interests
                    </label>
                    <div className="select-control relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenPanel((p) => (p === "tags" ? null : "tags"))
                        }
                        className="select-trigger flex min-h-[2.25rem] w-full flex-wrap items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-left text-xs"
                      >
                        {selectedTags.size === 0 && (
                          <span className="text-muted-foreground">Choose tags…</span>
                        )}
                        {Array.from(selectedTags).map((id) => {
                          const tag = TAGS.find((t) => t.id === id)!;
                          return (
                            <span
                              key={id}
                              className="chip inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                            >
                              {tag.label}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTag(id);
                                }}
                                className="chip-remove rounded-full hover:bg-primary/20"
                                aria-label={`Remove ${tag.label}`}
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          );
                        })}
                        <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
                      </button>

                      {openPanel === "tags" && (
                        <div className="select-panel border bg-card shadow-lg">
                          <div className="select-handle mx-auto mb-1 h-1 w-8 rounded-full bg-muted-foreground/40" />
                          <div className="mb-1 px-1.5 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Select multiple
                          </div>
                          <ul className="space-y-0.5 p-1">
                            {TAGS.map((t) => {
                              const active = selectedTags.has(t.id);
                              return (
                                <li key={t.id}>
                                  <button
                                    type="button"
                                    onClick={() => toggleTag(t.id)}
                                    className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[10px] font-medium transition ${
                                      active
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <span
                                      className={`flex h-3 w-3 items-center justify-center rounded border transition-colors ${
                                        active
                                          ? "border-primary bg-primary text-primary-foreground"
                                          : "border-border bg-background"
                                      }`}
                                    >
                                      {active && <Check className="h-2 w-2" />}
                                    </span>
                                    <span className="flex-1 text-left">{t.label}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Backdrop for mobile sheets */}
                {openPanel && (
                  <button
                    type="button"
                    aria-label="Close select"
                    onClick={() => setOpenPanel(null)}
                    className="select-backdrop absolute inset-0 z-20 bg-foreground/20"
                  />
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

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">selects.css</span>
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
              <li>• Custom select panels</li>
              <li>• Chip / tag styling</li>
              <li>• Mobile bottom sheet</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .select-app {
          container-type: inline-size;
          position: relative;
        }

        .select-grid {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: 1fr;
        }

        .select-card {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
        }

        .select-control {
          position: relative;
        }

        .select-trigger {
          border-color: hsl(var(--border));
        }

        /* Mobile-first: bottom sheet panels */
        .select-panel {
          position: fixed;
          left: 0; right: 0; bottom: 0; top: auto;
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 0.75rem;
          z-index: 30;
          animation: sheet-up .25s ease both;
        }

        .select-handle {
          display: block;
        }

        /* iPad+: anchored popovers */
        @container (min-width: 420px) {
          .select-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .select-panel {
            position: absolute;
            top: 100%; left: 0; right: auto; bottom: auto;
            margin-top: 0.25rem;
            min-width: 8rem;
            border-radius: 0.5rem;
            animation: pop-in .18s ease both;
          }

          .select-handle {
            display: none;
          }

          .select-backdrop {
            display: none;
          }
        }

        /* Desktop: compact inline */
        @container (min-width: 680px) {
          .select-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }

        @keyframes pop-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
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
