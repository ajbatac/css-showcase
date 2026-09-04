import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Mail, ShoppingCart, X } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Badges & Chips — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Badge, chip and status patterns — semantic status pills, numeric count badges, removable filter chips, inline tag clouds, and trailing list badges — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Badges & Chips — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Status pills, superscript count badges, toggleable filter chips, and wrapping tag clouds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BadgesDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "status-pills"
  | "count-badges"
  | "filter-chips"
  | "inline-tags"
  | "list-trailing";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "status-pills", label: "Status pills", desc: "Semantic colored pills, dot variant" },
    { id: "count-badges", label: "Count badges", desc: "Icons with numeric superscript" },
    { id: "filter-chips", label: "Filter chips", desc: "Removable, toggleable chips" },
  ],
  ipad: [
    { id: "status-pills", label: "Status pills", desc: "Semantic colored pills, dot variant" },
    { id: "filter-chips", label: "Filter chips", desc: "Removable, toggleable chips" },
  ],
  mobile: [
    { id: "inline-tags", label: "Inline tags", desc: "Wrapping tag cloud" },
    { id: "list-trailing", label: "List trailing", desc: "Rows with trailing status badges" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "status-pills": `/* Semantic status pills with dot variant */
.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 9999px;
  padding: 0.15rem 0.6rem;
  font-weight: 600;
}

.badge-pill[data-tone="success"] {
  background: color-mix(in oklch, var(--success, oklch(0.7 0.15 150)) 15%, transparent);
  color: var(--success, oklch(0.4 0.15 150));
}

.badge-pill .dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
  background: currentColor;
}`,
  "count-badges": `/* Icon with numeric superscript badge */
.badge-count-wrap {
  position: relative;
  display: inline-flex;
}

.badge-count {
  position: absolute;
  top: -0.35rem;
  right: -0.4rem;
  min-width: 1rem;
  border-radius: 9999px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.6rem;
  line-height: 1;
  padding: 0.15rem 0.3rem;
  text-align: center;
}`,
  "filter-chips": `/* Removable / toggleable filter chips */
.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(--border);
  border-radius: 9999px;
  padding: 0.2rem 0.6rem;
  transition: background 0.15s ease;
}

.badge-chip[data-active="true"] {
  background: var(--primary);
  color: var(--primary-foreground);
  border-color: transparent;
}`,
  "inline-tags": `/* Wrapping tag cloud */
.badge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.badge-tags .tag {
  border-radius: 0.35rem;
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
  padding: 0.15rem 0.45rem;
}`,
  "list-trailing": `/* List rows with trailing status badges */
.badge-list .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  padding-block: 0.5rem;
}`,
};

function BadgesDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "status-pills",
      ipad: "status-pills",
      mobile: "inline-tags",
    }),
  );
  const [activeChips, setActiveChips] = useState<Record<string, boolean>>({
    New: true,
    Sale: false,
    "In stock": true,
    "Free shipping": false,
  });

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
            Badges that speak.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Status, count, and filter patterns — semantic pills, superscript count badges,
            toggleable filter chips, and wrapping tag clouds.
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
                className="badges-demo h-full w-full overflow-auto p-3 text-[9px] text-muted-foreground"
              >
                {pattern === "status-pills" && (
                  <div className="grid gap-2">
                    <span className="badge-pill text-emerald-700 dark:text-emerald-300" data-tone="success" style={{ background: "color-mix(in oklch, oklch(0.7 0.15 150) 18%, transparent)" }}>
                      <span className="dot" /> Active
                    </span>
                    <span className="badge-pill text-amber-700 dark:text-amber-300" style={{ background: "color-mix(in oklch, oklch(0.8 0.15 85) 20%, transparent)" }}>
                      <span className="dot" /> Pending
                    </span>
                    <span className="badge-pill text-red-700 dark:text-red-300" style={{ background: "color-mix(in oklch, oklch(0.65 0.2 25) 18%, transparent)" }}>
                      <span className="dot" /> Failed
                    </span>
                    <span className="badge-pill" style={{ background: "color-mix(in oklch, var(--foreground) 10%, transparent)" }}>
                      Archived
                    </span>
                  </div>
                )}
                {pattern === "count-badges" && (
                  <div className="flex items-center gap-6 p-2">
                    <span className="badge-count-wrap">
                      <Bell className="h-4 w-4 text-foreground" />
                      <span className="badge-count">3</span>
                    </span>
                    <span className="badge-count-wrap">
                      <Mail className="h-4 w-4 text-foreground" />
                      <span className="badge-count">12</span>
                    </span>
                    <span className="badge-count-wrap">
                      <ShoppingCart className="h-4 w-4 text-foreground" />
                      <span className="badge-count">99+</span>
                    </span>
                  </div>
                )}
                {pattern === "filter-chips" && (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(activeChips).map((label) => (
                      <button
                        key={label}
                        className="badge-chip"
                        data-active={activeChips[label]}
                        onClick={() =>
                          setActiveChips((prev) => ({ ...prev, [label]: !prev[label] }))
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                {pattern === "inline-tags" && (
                  <div className="badge-tags">
                    {[
                      "React",
                      "TanStack",
                      "CSS",
                      "Design Systems",
                      "Accessibility",
                      "Grid",
                      "Flexbox",
                      "Animation",
                    ].map((t) => (
                      <span key={t} className="tag text-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {pattern === "list-trailing" && (
                  <div className="badge-list">
                    {[
                      { name: "Invoice #204", tone: "success", label: "Paid" },
                      { name: "Invoice #205", tone: "amber", label: "Due" },
                      { name: "Invoice #206", tone: "red", label: "Overdue" },
                      { name: "Invoice #207", tone: "success", label: "Paid" },
                    ].map((r) => (
                      <div key={r.name} className="row">
                        <span className="text-foreground">{r.name}</span>
                        <span
                          className="badge-pill"
                          style={{
                            background:
                              r.tone === "success"
                                ? "color-mix(in oklch, oklch(0.7 0.15 150) 18%, transparent)"
                                : r.tone === "amber"
                                  ? "color-mix(in oklch, oklch(0.8 0.15 85) 20%, transparent)"
                                  : "color-mix(in oklch, oklch(0.65 0.2 25) 18%, transparent)",
                          }}
                        >
                          {r.label}
                        </span>
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
                badge-{pattern}.css
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
              <li>• color-mix() tonal backgrounds</li>
              <li>• position: absolute superscript</li>
              <li>• flex-wrap tag clouds</li>
              <li>• data-attribute state styling</li>
              <li>• border-radius pills</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border-radius: 9999px;
          padding: 0.15rem 0.6rem;
          font-weight: 600;
        }

        .badge-pill .dot {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 9999px;
          background: currentColor;
        }

        .badge-count-wrap {
          position: relative;
          display: inline-flex;
        }

        .badge-count {
          position: absolute;
          top: -0.35rem;
          right: -0.4rem;
          min-width: 1rem;
          border-radius: 9999px;
          background: var(--primary);
          color: var(--primary-foreground);
          font-size: 0.6rem;
          line-height: 1;
          padding: 0.15rem 0.3rem;
          text-align: center;
        }

        .badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          border: 1px solid var(--border);
          border-radius: 9999px;
          padding: 0.2rem 0.6rem;
          transition: background 0.15s ease;
          color: var(--foreground);
        }

        .badge-chip[data-active="true"] {
          background: var(--primary);
          color: var(--primary-foreground);
          border-color: transparent;
        }

        .badge-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .badge-tags .tag {
          border-radius: 0.35rem;
          background: color-mix(in oklch, var(--foreground) 6%, transparent);
          padding: 0.15rem 0.45rem;
        }

        .badge-list .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-block: 0.5rem;
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
