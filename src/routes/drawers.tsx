import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, Menu, GripHorizontal } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch } from "@/lib/demo-state";

export const Route = createFileRoute("/drawers")({
  head: () => ({
    meta: [
      { title: "Drawers & Sheets — CSS Showcase" },
      {
        name: "description",
        content:
          "Drawer and sheet patterns — sliding right panels, push-in left navigation, docked inspectors, bottom sheets with drag handles, and full-screen modal pages — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Drawers & Sheets — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Animated open/close drawer patterns with backdrops, built with CSS transforms and transitions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DrawersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "right-panel" | "left-nav" | "inspector" | "bottom-sheet" | "full-screen";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "right-panel", label: "Right detail panel", desc: "Slide-in panel from the right edge" },
    { id: "left-nav", label: "Left nav drawer", desc: "Overlay navigation pushed from the left" },
    { id: "inspector", label: "Docked inspector", desc: "Persistent inspector column" },
  ],
  ipad: [
    { id: "right-panel", label: "Right detail panel", desc: "Slide-in panel from the right edge" },
    { id: "left-nav", label: "Left nav drawer", desc: "Overlay navigation pushed from the left" },
  ],
  mobile: [
    { id: "bottom-sheet", label: "Bottom sheet", desc: "Drag handle, snap-height sheet" },
    {
      id: "full-screen",
      label: "Full-screen sheet",
      desc: "Slide-up modal page with close header",
    },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "right-panel": `/* Right-edge sliding detail panel */
.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: color-mix(in oklch, var(--foreground) 35%, transparent);
  opacity: 0;
  transition: opacity .25s ease;
}

.drawer-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 70%;
  background: var(--popover);
  border-left: 1px solid var(--border);
  transform: translateX(100%);
  transition: transform .25s ease;
}

[data-open="true"] .drawer-backdrop { opacity: 1; }
[data-open="true"] .drawer-right { transform: translateX(0); }`,
  "left-nav": `/* Left navigation drawer */
.drawer-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 65%;
  background: var(--popover);
  border-right: 1px solid var(--border);
  transform: translateX(-100%);
  transition: transform .25s ease;
}

[data-open="true"] .drawer-left { transform: translateX(0); }`,
  inspector: `/* Persistent docked inspector column */
.inspector-layout {
  display: grid;
  grid-template-columns: 1fr 40%;
  height: 100%;
}

.inspector-col {
  border-left: 1px solid var(--border);
  background: var(--popover);
  overflow: auto;
}`,
  "bottom-sheet": `/* Drag-handle bottom sheet */
.sheet-backdrop {
  position: absolute;
  inset: 0;
  background: color-mix(in oklch, var(--foreground) 35%, transparent);
}

.bottom-sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 70%;
  background: var(--popover);
  border-top: 1px solid var(--border);
  border-radius: 1.25rem 1.25rem 0 0;
  transform: translateY(0);
  transition: transform .25s ease;
}

.sheet-handle {
  width: 2.5rem;
  height: 0.3rem;
  margin: 0.5rem auto;
  border-radius: 999px;
  background: var(--muted);
}`,
  "full-screen": `/* Full-screen slide-up modal page */
.full-sheet {
  position: absolute;
  inset: 0;
  background: var(--popover);
  transform: translateY(100%);
  transition: transform .25s ease;
}

[data-open="true"] .full-sheet { transform: translateY(0); }

.full-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  padding: 0.6rem 0.75rem;
}`,
};

function DrawersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "right-panel",
      ipad: "right-panel",
      mobile: "bottom-sheet",
    }),
  );
  const [open, setOpen] = useState(true);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Drawers that slide in with intent.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Animated panels, navigation drawers, docked inspectors, and touch-friendly bottom sheets
            — built with <code className="rounded bg-muted px-1.5 py-0.5 text-xs">transform</code>{" "}
            transitions and a dismissible backdrop.
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
                data-open={open}
                className="drawers-demo relative h-full w-full overflow-hidden text-[9px] text-muted-foreground"
              >
                {/* base app screen */}
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <button
                      onClick={() => setOpen((v) => !v)}
                      className="flex items-center gap-1 text-foreground"
                      aria-expanded={open}
                    >
                      {pattern === "left-nav" ? <Menu className="h-3.5 w-3.5" /> : null}
                      <span className="font-semibold">Inbox</span>
                    </button>
                    {pattern !== "left-nav" && pattern !== "inspector" && (
                      <button
                        onClick={() => setOpen((v) => !v)}
                        className="rounded-md border border-border px-2 py-1 text-[9px] font-semibold text-foreground"
                      >
                        {open ? "Close" : "Open"}
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto p-3">
                    {["Design review", "Sprint planning", "Invoice #4821", "Welcome aboard"].map(
                      (t) => (
                        <div
                          key={t}
                          className="mb-2 rounded-md border border-border bg-background px-2 py-1.5 text-foreground"
                        >
                          {t}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {pattern === "right-panel" && (
                  <>
                    <div className="drawer-backdrop" onClick={() => setOpen(false)} />
                    <div role="dialog" aria-label="Message detail" className="drawer-right p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">Design review</span>
                        <button onClick={() => setOpen(false)} aria-label="Close panel">
                          <X className="h-3.5 w-3.5 text-foreground" />
                        </button>
                      </div>
                      <p className="text-muted-foreground">
                        Let's sync on the new dashboard layout before Friday's demo.
                      </p>
                    </div>
                  </>
                )}

                {pattern === "left-nav" && (
                  <>
                    <div className="drawer-backdrop" onClick={() => setOpen(false)} />
                    <div role="dialog" aria-label="Navigation" className="drawer-left p-3">
                      <p className="mb-2 text-xs font-semibold text-foreground">Menu</p>
                      {["Inbox", "Drafts", "Sent", "Trash"].map((t) => (
                        <div
                          key={t}
                          className="mb-1 rounded-md px-2 py-1.5 text-foreground hover:bg-accent"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {pattern === "inspector" && (
                  <div className="absolute inset-0">
                    <div className="inspector-layout">
                      <div className="overflow-auto p-3">
                        {["Design review", "Sprint planning", "Invoice #4821"].map((t) => (
                          <div
                            key={t}
                            className="mb-2 rounded-md border border-border bg-background px-2 py-1.5 text-foreground"
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                      <div className="inspector-col p-3">
                        <p className="mb-1 text-xs font-semibold text-foreground">Details</p>
                        <p className="text-muted-foreground">
                          Docked inspector always visible alongside the list.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {pattern === "bottom-sheet" && open && (
                  <>
                    <div className="sheet-backdrop" onClick={() => setOpen(false)} />
                    <div role="dialog" aria-label="Options" className="bottom-sheet p-3">
                      <div className="sheet-handle">
                        <GripHorizontal className="sr-only" />
                      </div>
                      <p className="mb-2 text-xs font-semibold text-foreground">Message options</p>
                      <div className="space-y-1">
                        <div className="rounded-md px-2 py-1.5 text-foreground hover:bg-accent">
                          Reply
                        </div>
                        <div className="rounded-md px-2 py-1.5 text-foreground hover:bg-accent">
                          Archive
                        </div>
                        <div className="rounded-md px-2 py-1.5 text-foreground hover:bg-accent">
                          Delete
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {pattern === "full-screen" && (
                  <div className="full-sheet">
                    <div className="full-sheet-header">
                      <span className="text-xs font-semibold text-foreground">Design review</span>
                      <button onClick={() => setOpen(false)} aria-label="Close">
                        <X className="h-3.5 w-3.5 text-foreground" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-muted-foreground">
                        Full-screen modal page slides up from the bottom, covering the entire
                        viewport and replacing the header with a close action.
                      </p>
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
                  onClick={() => {
                    setDevice(d.id);
                    setOpen(true);
                  }}
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
                    onClick={() => {
                      setPatterns((prev) => ({ ...prev, [device]: o.id }));
                      setOpen(true);
                    }}
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
                drawer-{pattern}.css
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
              <li>• transform: translate transitions</li>
              <li>• backdrop overlay with color-mix()</li>
              <li>• CSS grid docked layout</li>
              <li>• border-radius clip on sheets</li>
              <li>• data-open attribute state</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .drawer-backdrop {
          position: absolute;
          inset: 0;
          background: color-mix(in oklch, var(--foreground) 35%, transparent);
        }

        .drawer-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 70%;
          background: var(--popover);
          border-left: 1px solid var(--border);
          animation: drawer-slide-in-right .25s ease;
        }

        @keyframes drawer-slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-left {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 65%;
          background: var(--popover);
          border-right: 1px solid var(--border);
          animation: drawer-slide-in-left .25s ease;
        }

        @keyframes drawer-slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .inspector-layout {
          display: grid;
          grid-template-columns: 1fr 42%;
          height: 100%;
        }

        .inspector-col {
          border-left: 1px solid var(--border);
          background: var(--popover);
          overflow: auto;
        }

        .sheet-backdrop {
          position: absolute;
          inset: 0;
          background: color-mix(in oklch, var(--foreground) 35%, transparent);
        }

        .bottom-sheet {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          max-height: 70%;
          background: var(--popover);
          border-top: 1px solid var(--border);
          border-radius: 1.25rem 1.25rem 0 0;
          animation: sheet-slide-up .25s ease;
        }

        @keyframes sheet-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .sheet-handle {
          width: 2.5rem;
          height: 0.3rem;
          margin: 0 auto 0.5rem;
          border-radius: 999px;
          background: var(--muted);
        }

        .full-sheet {
          position: absolute;
          inset: 0;
          background: var(--popover);
          animation: sheet-slide-up .25s ease;
        }

        .full-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding: 0.5rem 0.6rem;
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
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-card">{children}</div>
    </div>
  );
}
