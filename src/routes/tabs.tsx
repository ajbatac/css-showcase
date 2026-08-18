import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type KeyboardEvent } from "react";
import { Activity, BarChart3, Lock, Settings2, ShieldAlert, Users } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/tabs")({
  head: () => ({
    meta: [
      { title: "Tabs — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Keyboard-navigable tab panels with per-device design patterns: underline, pills, side rail, scroll-snap, and bottom bar.",
      },
      { property: "og:title", content: "Tabs — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Accessible tabs with disabled states, truncation, and overflow scrolling — pick a device, then pick a design pattern for that device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TabsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "underline" | "pills" | "rail" | "scroll" | "bottombar";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "underline", label: "Underline bar", desc: "Equal-width tabs, animated underline" },
    { id: "pills", label: "Segmented pills", desc: "Compact pill group, left-aligned" },
    { id: "rail", label: "Side rail", desc: "Vertical tab rail beside the panel" },
  ],
  ipad: [
    { id: "underline", label: "Underline bar", desc: "Stretched tabs with icons + labels" },
    { id: "pills", label: "Segmented pills", desc: "Centered pill group" },
  ],
  mobile: [
    { id: "scroll", label: "Scroll-snap strip", desc: "Horizontal snapping tablist" },
    { id: "bottombar", label: "Bottom tab bar", desc: "Icon-first bar pinned to bottom" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  underline: `/* Underline bar — equal-width tabs */
.tabs-app { container-type: inline-size; }

.tablist[data-pattern="underline"] {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  border-bottom: 1px solid hsl(var(--border));
}
.tablist[data-pattern="underline"] .tab {
  min-width: 0;
  max-width: 12rem;
  border-bottom: 2px solid transparent;
}
.tablist[data-pattern="underline"] .tab[aria-selected="true"] {
  border-color: hsl(var(--primary));
  color: hsl(var(--primary));
}

@container (min-width: 420px) {
  .tablist[data-pattern="underline"] .tab { flex: 1 1 0; }
}`,
  pills: `/* Segmented pills */
.tablist[data-pattern="pills"] {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  margin: 0.5rem;
  border-radius: 999px;
  background: hsl(var(--muted));
  overflow-x: auto;
}
.tablist[data-pattern="pills"] .tab {
  border-radius: 999px;
  min-width: 0;
  max-width: 10rem;
}
.tablist[data-pattern="pills"] .tab[aria-selected="true"] {
  background: hsl(var(--card));
  color: hsl(var(--primary));
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
}

@container (min-width: 680px) {
  .tablist[data-pattern="pills"] { justify-content: flex-start; }
}`,
  rail: `/* Vertical side rail */
.tabs-shell[data-pattern="rail"] {
  display: grid;
  grid-template-columns: minmax(0, 11rem) minmax(0, 1fr);
  height: 100%;
}
.tablist[data-pattern="rail"] {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  overflow-y: auto;
  border-right: 1px solid hsl(var(--border));
  padding: 0.5rem;
}
.tablist[data-pattern="rail"] .tab {
  justify-content: flex-start;
  border-radius: 0.5rem;
  border-left: 2px solid transparent;
}
.tablist[data-pattern="rail"] .tab[aria-selected="true"] {
  border-left-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}`,
  scroll: `/* Mobile scroll-snap strip */
.tablist[data-pattern="scroll"] {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  border-bottom: 1px solid hsl(var(--border));
}
.tablist[data-pattern="scroll"] .tab {
  scroll-snap-align: start;
  flex: 0 0 auto;
  min-width: 0;
  max-width: 9rem;
  border-bottom: 2px solid transparent;
}
.tab-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`,
  bottombar: `/* Mobile bottom tab bar */
.tabs-shell[data-pattern="bottombar"] {
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
}
.tablist[data-pattern="bottombar"] {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  border-top: 1px solid hsl(var(--border));
  padding-bottom: env(safe-area-inset-bottom);
  background: hsl(var(--card));
}
.tablist[data-pattern="bottombar"] .tab {
  flex-direction: column;
  gap: 0.125rem;
  min-height: 3rem;
  font-size: 9px;
}
.tablist[data-pattern="bottombar"] .tab[aria-selected="true"] {
  color: hsl(var(--primary));
}`,
};

type TabDef = {
  id: string;
  label: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  disabledReason?: string;
};

const TABS: TabDef[] = [
  { id: "overview", label: "Overview", short: "Home", icon: Activity },
  { id: "analytics", label: "Analytics & Realtime Metrics", short: "Stats", icon: BarChart3 },
  { id: "audience", label: "Audience Segments", short: "People", icon: Users },
  {
    id: "billing",
    label: "Billing & Invoicing History",
    short: "Billing",
    icon: Lock,
    disabled: true,
    disabledReason: "Upgrade to Pro to access billing",
  },
  { id: "settings", label: "Settings", short: "Settings", icon: Settings2 },
  {
    id: "admin",
    label: "Admin Console — Restricted",
    short: "Admin",
    icon: ShieldAlert,
    disabled: true,
    disabledReason: "Requires admin role",
  },
];

function TabsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS
      ? (initial.device as Device)
      : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
    desktop: "underline",
    ipad: "underline",
    mobile: "scroll",
    }),
  );
  const firstEnabled = TABS.find((t) => !t.disabled)?.id ?? TABS[0].id;
  const [active, setActive] = useState<string>(firstEnabled);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const iconOnly = pattern === "bottombar";
  const visibleTabs = pattern === "bottombar" ? TABS.slice(0, 5) : TABS;

  const focusTab = (id: string) => {
    setActive(id);
    requestAnimationFrame(() => {
      const el = tabRefs.current[id];
      el?.focus();
      el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    });
  };

  const nextEnabled = (from: number, dir: 1 | -1) => {
    const n = visibleTabs.length;
    for (let step = 1; step <= n; step++) {
      const i = (from + dir * step + n * step) % n;
      if (!visibleTabs[i].disabled) return i;
    }
    return from;
  };
  const edgeEnabled = (dir: 1 | -1) => {
    const range = dir === 1 ? visibleTabs : [...visibleTabs].reverse();
    const found = range.find((t) => !t.disabled);
    return visibleTabs.findIndex((t) => t.id === (found?.id ?? visibleTabs[0].id));
  };

  const vertical = pattern === "rail";

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = visibleTabs.findIndex((t) => t.id === active);
    if (idx < 0) return;
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    let next = idx;
    switch (e.key) {
      case nextKey:
        next = nextEnabled(idx, 1);
        break;
      case prevKey:
        next = nextEnabled(idx, -1);
        break;
      case "Home":
        next = edgeEnabled(1);
        break;
      case "End":
        next = edgeEnabled(-1);
        break;
      default:
        return;
    }
    e.preventDefault();
    focusTab(visibleTabs[next].id);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Tabs — one component, five patterns.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Underline bars, segmented pills, a vertical side rail, a scroll-snapping mobile strip,
            and a bottom tab bar. Disabled tabs are skipped by keyboard, long labels truncate, and
            the tablist stays overflow-safe — pick a device, then pick a pattern for that device.
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
              <div className="tabs-app h-full w-full min-w-0 overflow-hidden">
                <div
                  data-pattern={pattern}
                  className="tabs-shell flex h-full w-full min-w-0 flex-col overflow-hidden"
                >
                  <div
                    role="tablist"
                    aria-label="Dashboard sections"
                    aria-orientation={vertical ? "vertical" : "horizontal"}
                    data-pattern={pattern}
                    className="tablist"
                  >
                    {visibleTabs.map((t) => {
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
                          aria-disabled={t.disabled || undefined}
                          title={t.disabled ? t.disabledReason : t.label}
                          tabIndex={selected ? 0 : -1}
                          onClick={() => {
                            if (t.disabled) return;
                            focusTab(t.id);
                          }}
                          onKeyDown={onKeyDown}
                          className="tab flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-muted-foreground outline-none transition hover:text-foreground focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="tab-label">{iconOnly ? t.short : t.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="min-w-0 flex-1 overflow-auto p-3">
                    {visibleTabs.map((t) => {
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
                          <TabContent tab={t} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </DeviceFrame>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Try it: <kbd className="rounded border bg-muted px-1">{vertical ? "↑" : "←"}</kbd>{" "}
              <kbd className="rounded border bg-muted px-1">{vertical ? "↓" : "→"}</kbd> skip
              disabled tabs, <kbd className="rounded border bg-muted px-1">Home</kbd>{" "}
              <kbd className="rounded border bg-muted px-1">End</kbd> jump to first / last enabled.
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

          <div className="border-t bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {device} design patterns
              </p>
              <CopyLinkButton device={device} pattern={pattern} />
            </div>
            <div role="tablist" aria-label="Design pattern" className="grid gap-2">
              {options.map((o) => {
                const isActive = pattern === o.id;
                return (
                  <button
                    key={o.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setPatterns((prev) => ({ ...prev, [device]: o.id }));
                      setActive(firstEnabled);
                    }}
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      isActive
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
                        isActive ? "bg-primary" : "bg-border"
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
                tabs-{pattern}.css
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
              CSS & a11y features used
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground">
              <li>• Container queries</li>
              <li>• Overflow-x scroll + snap</li>
              <li>• Roving <code>tabindex</code></li>
              <li>• Skips <code>aria-disabled</code> tabs</li>
              <li>• Truncation via <code>min-width:0</code></li>
              <li>• <code>aria-orientation</code> keys</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .tabs-app { container-type: inline-size; }

        .tab {
          min-width: 0;
          transition: color .2s ease, border-color .2s ease, background .2s ease, opacity .2s ease;
        }
        .tab-label {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tab[aria-disabled="true"] { opacity: .45; cursor: not-allowed; }

        .tablist { scrollbar-width: thin; }
        .tablist::-webkit-scrollbar { height: 4px; width: 4px; }
        .tablist::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 999px;
        }

        /* underline */
        .tablist[data-pattern="underline"] {
          display: flex;
          gap: 0.25rem;
          overflow-x: auto;
          padding-inline: 0.5rem;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--card) / 0.6);
        }
        .tablist[data-pattern="underline"] .tab {
          flex: 0 0 auto;
          max-width: 12rem;
          border-bottom: 2px solid transparent;
        }
        .tablist[data-pattern="underline"] .tab[aria-selected="true"] {
          border-bottom-color: hsl(var(--primary));
          color: hsl(var(--primary));
        }
        @container (min-width: 420px) {
          .tablist[data-pattern="underline"] .tab { flex: 1 1 0; }
        }

        /* pills */
        .tablist[data-pattern="pills"] {
          display: flex;
          gap: 0.25rem;
          padding: 0.25rem;
          margin: 0.5rem;
          border-radius: 999px;
          background: hsl(var(--muted));
          overflow-x: auto;
          justify-content: center;
        }
        .tablist[data-pattern="pills"] .tab {
          flex: 0 0 auto;
          max-width: 10rem;
          border-radius: 999px;
        }
        .tablist[data-pattern="pills"] .tab[aria-selected="true"] {
          background: hsl(var(--card));
          color: hsl(var(--primary));
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
        }
        @container (min-width: 680px) {
          .tablist[data-pattern="pills"] { justify-content: flex-start; }
        }

        /* rail */
        .tabs-shell[data-pattern="rail"] {
          display: grid;
          grid-template-columns: minmax(0, 9.5rem) minmax(0, 1fr);
          grid-template-rows: 100%;
        }
        .tablist[data-pattern="rail"] {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          overflow-y: auto;
          padding: 0.5rem;
          border-right: 1px solid hsl(var(--border));
          background: hsl(var(--card) / 0.6);
        }
        .tablist[data-pattern="rail"] .tab {
          justify-content: flex-start;
          border-radius: 0.5rem;
          border-left: 2px solid transparent;
          text-align: left;
        }
        .tablist[data-pattern="rail"] .tab[aria-selected="true"] {
          border-left-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
        }

        /* mobile scroll strip */
        .tablist[data-pattern="scroll"] {
          display: flex;
          gap: 0.25rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-inline: 0.5rem;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--card) / 0.6);
        }
        .tablist[data-pattern="scroll"] .tab {
          scroll-snap-align: start;
          flex: 0 0 auto;
          max-width: 9rem;
          border-bottom: 2px solid transparent;
        }
        .tablist[data-pattern="scroll"] .tab[aria-selected="true"] {
          border-bottom-color: hsl(var(--primary));
          color: hsl(var(--primary));
        }

        /* mobile bottom bar */
        .tabs-shell[data-pattern="bottombar"] {
          display: flex;
          flex-direction: column-reverse;
        }
        .tablist[data-pattern="bottombar"] {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          border-top: 1px solid hsl(var(--border));
          background: hsl(var(--card));
        }
        .tablist[data-pattern="bottombar"] .tab {
          flex-direction: column;
          gap: 0.125rem;
          min-height: 3rem;
          padding-inline: 0.25rem;
          font-size: 9px;
        }
        .tablist[data-pattern="bottombar"] .tab[aria-selected="true"] {
          color: hsl(var(--primary));
        }
      `}</style>
    </main>
  );
}

function TabContent({ tab }: { tab: TabDef }) {
  if (tab.disabled) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-6 text-center">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <p className="text-[11px] font-semibold">{tab.label}</p>
        <p className="text-[10px] text-muted-foreground">{tab.disabledReason}</p>
      </div>
    );
  }
  switch (tab.id) {
    case "overview":
      return (
        <div className="space-y-2">
          <h3 className="text-xs font-bold">Overview</h3>
          <p className="text-[11px] text-muted-foreground">
            Snapshot of today's activity, revenue and top events.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["Visits", "Signups", "Revenue", "Churn"].map((k, i) => (
              <div key={k} className="rounded-lg border bg-muted/40 p-2">
                <div className="text-[9px] uppercase text-muted-foreground">{k}</div>
                <div className="text-sm font-bold">{[482, 137, 916, 24][i]}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case "analytics":
      return (
        <div className="space-y-2">
          <h3 className="truncate text-xs font-bold">Analytics & Realtime Metrics</h3>
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
          <h3 className="text-xs font-bold">Audience Segments</h3>
          {["Aria", "Ben", "Cass", "Dev"].map((n) => (
            <div
              key={n}
              className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1.5"
            >
              <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                {n[0]}
              </div>
              <span className="truncate text-[11px]">{n}</span>
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
              <span className="truncate">{s}</span>
              <input type="checkbox" defaultChecked className="h-3.5 w-3.5 shrink-0" />
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
