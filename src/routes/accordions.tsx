import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ListCollapse } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/accordions")({
  head: () => ({
    meta: [
      { title: "Accordions — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Animated accordions that morph between a compact stacked list on mobile and an expanded multi-panel layout on desktop using container queries.",
      },
      { property: "og:title", content: "Accordions — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One accordion component reshaped for mobile, iPad, and desktop with CSS grid, transitions, and container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccordionsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "panels" | "stacked" | "grid" | "boxed";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "panels", label: "Side-by-side panels", desc: "Each item is a column" },
    { id: "stacked", label: "Single-open list", desc: "Classic accordion behaviour" },
    { id: "grid", label: "Two-column FAQ grid", desc: "Independent grid cells" },
  ],
  ipad: [
    { id: "stacked", label: "Stacked list", desc: "One panel open at a time" },
    { id: "panels", label: "Side-by-side panels", desc: "Columns per item" },
  ],
  mobile: [
    { id: "stacked", label: "Stacked list", desc: "One panel open at a time" },
    { id: "boxed", label: "Boxed cards", desc: "Cards separated by dividers" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  stacked: `/* Stacked list (single-open) */
.accordion[data-pattern="stacked"] {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}

.accordion-item[data-open="true"] .accordion-panel {
  grid-template-rows: 1fr;
}`,
  panels: `/* Side-by-side panels */
.accordion[data-pattern="panels"] {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 0.75rem;
}

.accordion[data-pattern="panels"] .accordion-item {
  display: flex;
  flex-direction: column;
}

.accordion[data-pattern="panels"] .accordion-panel {
  grid-template-rows: 1fr;
  flex: 1;
}`,
  grid: `/* Two-column FAQ grid */
.accordion[data-pattern="grid"] {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  align-items: start;
}`,
  boxed: `/* Boxed cards with dividers */
.accordion[data-pattern="boxed"] {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  overflow: clip;
}

.accordion[data-pattern="boxed"] .accordion-item {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid hsl(var(--border));
  box-shadow: none;
}

.accordion[data-pattern="boxed"] .accordion-item:last-child {
  border-bottom: 0;
}`,
};

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: "Accordions hide secondary content until the user asks for it. On mobile that keeps the screen short; on larger screens the same panels can sit side-by-side.",
  },
  {
    id: "details",
    title: "Details",
    body: "Use grid-template-rows with transition to animate from 0fr to 1fr. The inner wrapper needs overflow: hidden so the content clips cleanly as it grows.",
  },
  {
    id: "settings",
    title: "Settings",
    body: "A single container query reads the available width and switches the layout axis. No JavaScript breakpoint logic is required.",
  },
];

function AccordionsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS
      ? (initial.device as Device)
      : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
    desktop: "panels",
    ipad: "stacked",
    mobile: "stacked",
    }),
  );
  const [open, setOpen] = useState<Record<string, boolean>>({
    overview: true,
    details: false,
    settings: false,
  });

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const singleOpen = pattern === "stacked" || pattern === "boxed";

  const toggle = (id: string) => {
    setOpen((prev) => {
      if (singleOpen) {
        const isOpen = !!prev[id];
        const next: Record<string, boolean> = {};
        SECTIONS.forEach((s) => {
          next[s.id] = false;
        });
        next[id] = !isOpen;
        return next;
      }
      return { ...prev, [id]: !prev[id] };
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Accordions that stretch.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A single accordion component that collapses into a stacked list on
            mobile and expands into side-by-side panels on desktop — powered by{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              grid-template-rows
            </code>{" "}
            transitions and container queries.
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
                className="accordion h-full w-full overflow-auto p-2"
              >
                {SECTIONS.map((section) => {
                  const isOpen = open[section.id];
                  return (
                    <div
                      key={section.id}
                      data-open={isOpen}
                      className="accordion-item rounded-xl border bg-card shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggle(section.id)}
                        className="accordion-trigger flex w-full items-center justify-between px-3 py-2 text-left text-[10px] font-semibold sm:text-xs"
                      >
                        <span className="flex min-w-0 items-center gap-1.5">
                          <ListCollapse className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <span className="truncate">{section.title}</span>
                        </span>
                        <ChevronDown
                          className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div className="accordion-panel">
                        <div className="overflow-hidden">
                          <div className="px-3 pb-2 pt-0 text-[9px] leading-relaxed text-muted-foreground sm:text-[10px]">
                            {section.body}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    onClick={() =>
                      setPatterns((prev) => ({ ...prev, [device]: o.id }))
                    }
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
                accordion-{pattern}.css
              </span>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(CSS_BY_PATTERN[pattern])
                }
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
              <li>• grid-template-rows transition</li>
              <li>• 0fr / 1fr animation</li>
              <li>• CSS custom properties</li>
              <li>• Smooth transitions</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .accordion {
          container-type: inline-size;
          display: grid;
          gap: 0.5rem;
          align-content: start;
        }

        .accordion-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s ease;
        }

        .accordion-item[data-open="true"] .accordion-panel {
          grid-template-rows: 1fr;
        }

        .accordion-trigger {
          transition: background-color 0.2s ease;
        }

        .accordion-trigger:hover {
          background-color: hsl(var(--accent));
        }

        .accordion[data-pattern="panels"] {
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          gap: 0.75rem;
        }

        .accordion[data-pattern="panels"] .accordion-item {
          display: flex;
          flex-direction: column;
        }

        .accordion[data-pattern="panels"] .accordion-panel {
          grid-template-rows: 1fr;
          flex: 1;
        }

        .accordion[data-pattern="grid"] {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          align-items: start;
        }

        .accordion[data-pattern="boxed"] {
          grid-template-columns: 1fr;
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          overflow: clip;
          gap: 0;
        }

        .accordion[data-pattern="boxed"] .accordion-item {
          border: 0;
          border-radius: 0;
          border-bottom: 1px solid hsl(var(--border));
          box-shadow: none;
        }

        .accordion[data-pattern="boxed"] .accordion-item:last-child {
          border-bottom: 0;
        }

        @container (min-width: 520px) {
          .accordion[data-pattern="panels"] {
            grid-auto-flow: column;
            grid-auto-columns: 1fr;
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
