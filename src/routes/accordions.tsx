import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ListCollapse } from "lucide-react";

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

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.accordion {
  container-type: inline-size;
  display: grid;
  gap: 0.5rem;
}

/* Mobile: stacked single-panel */
.accordion-item {
  border-radius: 0.75rem;
  overflow: clip;
  transition: flex-grow 0.35s ease;
}

.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}

.accordion-item[data-open="true"] .accordion-panel {
  grid-template-rows: 1fr;
}

/* iPad+: horizontal tabs */
@container (min-width: 520px) {
  .accordion {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 0.75rem;
  }

  .accordion-item {
    display: flex;
    flex-direction: column;
  }

  .accordion-panel {
    grid-template-rows: 1fr;
    flex: 1;
  }
}`;

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
  const [device, setDevice] = useState<Device>("mobile");
  const [open, setOpen] = useState<Record<string, boolean>>({
    overview: true,
    details: false,
    settings: false,
  });

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
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
              {device}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device}>
              <div className="accordion h-full w-full p-2">
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
                        <span className="flex items-center gap-1.5">
                          <ListCollapse className="h-3 w-3 shrink-0 text-muted-foreground" />
                          {section.title}
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

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                accordion.css
              </span>
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

        @container (min-width: 520px) {
          .accordion {
            grid-auto-flow: column;
            grid-auto-columns: 1fr;
            gap: 0.75rem;
            align-content: stretch;
          }

          .accordion-item {
            display: flex;
            flex-direction: column;
          }

          .accordion-panel {
            grid-template-rows: 1fr;
            flex: 1;
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
