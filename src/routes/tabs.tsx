import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type KeyboardEvent } from "react";
import { Activity, BarChart3, Settings2, Users } from "lucide-react";

export const Route = createFileRoute("/tabs")({
  head: () => ({
    meta: [
      { title: "Tabs — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Keyboard-navigable tab panels that reshape across desktop, iPad, and mobile using container queries.",
      },
      { property: "og:title", content: "Tabs — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Accessible tabs with arrow-key, Home/End navigation — reshaped for mobile, iPad, and desktop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TabsDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.tabs-app {
  container-type: inline-size;
}

.tablist {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.tab {
  scroll-snap-align: start;
  border-bottom: 2px solid transparent;
}

.tab[aria-selected="true"] {
  border-color: hsl(var(--primary));
  color: hsl(var(--primary));
}

/* iPad+: enable equal-width tabs */
@container (min-width: 420px) {
  .tablist { overflow: visible; }
  .tab { flex: 1; }
}`;

type TabDef = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const TABS: TabDef[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "audience", label: "Audience", icon: Users },
  { id: "settings", label: "Settings", icon: Settings2 },
];

function TabsDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [active, setActive] = useState<string>(TABS[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusTab = (id: string) => {
    setActive(id);
    requestAnimationFrame(() => tabRefs.current[id]?.focus());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = TABS.findIndex((t) => t.id === active);
    if (idx < 0) return;
    let next = idx;
    switch (e.key) {
      case "ArrowRight":
        next = (idx + 1) % TABS.length;
        break;
      case "ArrowLeft":
        next = (idx - 1 + TABS.length) % TABS.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = TABS.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    focusTab(TABS[next].id);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Tabs with keyboard navigation.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Arrow keys move between tabs, Home/End jump to the ends. On mobile the tablist
            scroll-snaps; on iPad/desktop tabs stretch to fill the row via container queries.
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
              <div className="tabs-app flex h-full w-full flex-col overflow-hidden">
                <div
                  role="tablist"
                  aria-label="Dashboard sections"
                  className="tablist border-b bg-card/60 px-2"
                >
                  {TABS.map((t) => {
                    const selected = t.id === active;
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        ref={(el) => {
                          tabRefs.current[t.id] = el;
                        }}
                        id={`tab-${t.id}`}
                        role="tab"
                        type="button"
                        aria-selected={selected}
                        aria-controls={`panel-${t.id}`}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setActive(t.id)}
                        onKeyDown={onKeyDown}
                        className="tab flex shrink-0 items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-muted-foreground outline-none transition hover:text-foreground focus-visible:text-primary"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-auto p-3">
                  {TABS.map((t) => {
                    const selected = t.id === active;
                    return (
                      <div
                        key={t.id}
                        id={`panel-${t.id}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${t.id}`}
                        hidden={!selected}
                        tabIndex={0}
                        className="outline-none"
                      >
                        <TabContent id={t.id} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </DeviceFrame>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Try it: click a tab, then use <kbd className="rounded border bg-muted px-1">←</kbd>{" "}
              <kbd className="rounded border bg-muted px-1">→</kbd>{" "}
              <kbd className="rounded border bg-muted px-1">Home</kbd>{" "}
              <kbd className="rounded border bg-muted px-1">End</kbd>.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Device viewport"
            className="grid grid-cols-3 gap-2 border-t bg-background/50 p-3"
          >
            {DEVICES.map((d) => {
              const isActive = device === d.id;
              return (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setDevice(d.id)}
                  className={`flex min-h-11 flex-col items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  <span>{d.label}</span>
                  <span
                    className={`mt-0.5 text-[10px] font-normal ${
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
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
              <span className="text-xs font-semibold text-muted-foreground">tabs.css</span>
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
              CSS & a11y features used
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground">
              <li>• Container queries</li>
              <li>• Scroll snap on mobile</li>
              <li>• Roving <code>tabindex</code></li>
              <li>• Arrow / Home / End keys</li>
              <li>• <code>aria-selected</code> + panels</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .tabs-app {
          container-type: inline-size;
        }

        .tablist {
          display: flex;
          gap: 0.25rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .tablist::-webkit-scrollbar { display: none; }

        .tab {
          scroll-snap-align: start;
          border-bottom: 2px solid transparent;
          transition: color .2s ease, border-color .2s ease, background .2s ease;
        }

        .tab[aria-selected="true"] {
          border-color: hsl(var(--primary));
          color: hsl(var(--primary));
        }

        @container (min-width: 420px) {
          .tablist { overflow: visible; }
          .tab { flex: 1; }
        }
      `}</style>
    </main>
  );
}

function TabContent({ id }: { id: string }) {
  switch (id) {
    case "overview":
      return (
        <div className="space-y-2">
          <h3 className="text-xs font-bold">Overview</h3>
          <p className="text-[11px] text-muted-foreground">
            Snapshot of today's activity, revenue and top events.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["Visits", "Signups", "Revenue", "Churn"].map((k) => (
              <div key={k} className="rounded-lg border bg-muted/40 p-2">
                <div className="text-[9px] uppercase text-muted-foreground">{k}</div>
                <div className="text-sm font-bold">
                  {Math.floor(Math.random() * 900 + 100)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "analytics":
      return (
        <div className="space-y-2">
          <h3 className="text-xs font-bold">Analytics</h3>
          <div className="flex h-24 items-end gap-1">
            {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      );
    case "audience":
      return (
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold">Audience</h3>
          {["Aria", "Ben", "Cass", "Dev"].map((n) => (
            <div
              key={n}
              className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1.5"
            >
              <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                {n[0]}
              </div>
              <span className="text-[11px]">{n}</span>
            </div>
          ))}
        </div>
      );
    case "settings":
      return (
        <div className="space-y-2">
          <h3 className="text-xs font-bold">Settings</h3>
          {["Email alerts", "Weekly digest", "Beta features"].map((s) => (
            <label
              key={s}
              className="flex items-center justify-between rounded-md border bg-muted/30 px-2 py-1.5 text-[11px]"
            >
              <span>{s}</span>
              <input type="checkbox" defaultChecked className="h-3.5 w-3.5" />
            </label>
          ))}
        </div>
      );
    default:
      return null;
  }
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
      <div className="h-full w-full overflow-hidden rounded-lg bg-card">{children}</div>
    </div>
  );
}
