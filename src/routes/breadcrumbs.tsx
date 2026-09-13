import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/breadcrumbs")({
  head: () => ({
    meta: [
      { title: "Breadcrumbs — CSS Showcase" },
      {
        name: "description",
        content:
          "Breadcrumb trail patterns — chevron and slash separators, collapsed overflow trails, mobile back-links, and scrollable trails — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Breadcrumbs — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Breadcrumb navigation styles using flexbox, text-overflow ellipsis, scroll-snap, and mask-image fades.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BreadcrumbsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "chevron" | "slash" | "collapsed" | "back-link" | "scroll-trail";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "chevron", label: "Chevron trail", desc: "Full trail with chevron separators" },
    { id: "slash", label: "Slash trail", desc: "Slash separators, muted ancestors" },
    { id: "collapsed", label: "Collapsed trail", desc: "First › … › parent › current" },
  ],
  ipad: [
    { id: "chevron", label: "Chevron trail", desc: "Full trail with chevron separators" },
    { id: "collapsed", label: "Collapsed trail", desc: "First › … › parent › current" },
  ],
  mobile: [
    { id: "back-link", label: "Back link", desc: "Single ‹ Parent link plus current title" },
    { id: "scroll-trail", label: "Scroll trail", desc: "Horizontally scrollable trail with fade mask" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  chevron: `/* Chevron-separated breadcrumb trail */
.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.crumbs .sep {
  color: var(--muted-foreground);
  opacity: 0.6;
}

.crumbs a {
  color: var(--muted-foreground);
}

.crumbs a:hover {
  color: var(--foreground);
}

.crumbs [aria-current="page"] {
  color: var(--foreground);
  font-weight: 600;
}`,
  slash: `/* Slash separated trail, muted ancestors */
.crumbs-slash {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--muted-foreground);
}

.crumbs-slash .sep::before {
  content: "/";
  opacity: 0.5;
}

.crumbs-slash [aria-current="page"] {
  color: var(--foreground);
  font-weight: 600;
}`,
  collapsed: `/* Collapsed trail with overflow ellipsis */
.crumbs-collapsed {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.crumbs-collapsed .ellipsis {
  padding-inline: 0.25rem;
  color: var(--muted-foreground);
}

.crumbs-collapsed .current {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}`,
  "back-link": `/* Mobile single back-link breadcrumb */
.crumb-back {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  color: var(--primary);
  font-weight: 500;
}

.crumb-current {
  display: block;
  margin-top: 0.35rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`,
  "scroll-trail": `/* Horizontally scrollable trail with fade mask */
.crumbs-scroll {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent,
    black 12px,
    black calc(100% - 12px),
    transparent
  );
  mask-image: linear-gradient(
    90deg,
    transparent,
    black 12px,
    black calc(100% - 12px),
    transparent
  );
}

.crumbs-scroll > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}`,
};

const TRAIL = ["Home", "Store", "Electronics", "Laptops", "Ultrabooks"];

function BreadcrumbsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "chevron",
      ipad: "chevron",
      mobile: "back-link",
    }),
  );

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
            Breadcrumbs that never break.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Trail patterns from full chevron and slash separators to collapsed overflow trails,
            plus mobile-friendly back-links and scrollable trails.
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
                className="breadcrumbs-demo h-full w-full overflow-auto p-3 text-[9px] text-muted-foreground"
              >
                {pattern === "chevron" && (
                  <nav aria-label="Breadcrumb" className="crumbs">
                    {TRAIL.map((label, i) => (
                      <span key={label} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="sep h-2.5 w-2.5" />}
                        {i === TRAIL.length - 1 ? (
                          <span aria-current="page">{label}</span>
                        ) : (
                          <a href="#">{label}</a>
                        )}
                      </span>
                    ))}
                  </nav>
                )}
                {pattern === "slash" && (
                  <nav aria-label="Breadcrumb" className="crumbs-slash">
                    {TRAIL.map((label, i) => (
                      <span key={label} className="flex items-center gap-1">
                        {i > 0 && <span className="sep" />}
                        {i === TRAIL.length - 1 ? (
                          <span aria-current="page">{label}</span>
                        ) : (
                          <a href="#">{label}</a>
                        )}
                      </span>
                    ))}
                  </nav>
                )}
                {pattern === "collapsed" && (
                  <nav aria-label="Breadcrumb" className="crumbs-collapsed">
                    <a href="#">{TRAIL[0]}</a>
                    <ChevronRight className="h-2.5 w-2.5 opacity-60" />
                    <span className="ellipsis">…</span>
                    <ChevronRight className="h-2.5 w-2.5 opacity-60" />
                    <a href="#">{TRAIL[TRAIL.length - 2]}</a>
                    <ChevronRight className="h-2.5 w-2.5 opacity-60" />
                    <span className="current" aria-current="page">
                      {TRAIL[TRAIL.length - 1]}
                    </span>
                  </nav>
                )}
                {pattern === "back-link" && (
                  <nav aria-label="Breadcrumb">
                    <a href="#" className="crumb-back">
                      <ChevronLeft className="h-3 w-3" />
                      {TRAIL[TRAIL.length - 2]}
                    </a>
                    <span className="crumb-current text-foreground">
                      {TRAIL[TRAIL.length - 1]}
                    </span>
                  </nav>
                )}
                {pattern === "scroll-trail" && (
                  <nav aria-label="Breadcrumb" className="crumbs-scroll">
                    {TRAIL.map((label, i) => (
                      <span key={label} className="flex items-center gap-1 whitespace-nowrap">
                        {i > 0 && <ChevronRight className="h-2.5 w-2.5 opacity-60" />}
                        {i === TRAIL.length - 1 ? (
                          <span aria-current="page" className="text-foreground font-semibold">
                            {label}
                          </span>
                        ) : (
                          <a href="#">{label}</a>
                        )}
                      </span>
                    ))}
                  </nav>
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
                breadcrumb-{pattern}.css
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
              <li>• flexbox wrap trails</li>
              <li>• text-overflow: ellipsis</li>
              <li>• scroll-snap-type</li>
              <li>• mask-image fade edges</li>
              <li>• aria-current styling</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .crumbs, .crumbs-slash, .crumbs-collapsed, .crumbs-scroll {
          font-size: 0.7rem;
        }

        .crumbs a, .crumbs-slash a, .crumbs-collapsed a, .crumbs-scroll a {
          color: var(--muted-foreground);
          text-decoration: none;
        }

        .crumbs a:hover, .crumbs-slash a:hover, .crumbs-collapsed a:hover, .crumbs-scroll a:hover {
          color: var(--foreground);
        }

        .crumbs [aria-current="page"],
        .crumbs-slash [aria-current="page"],
        .crumbs-collapsed .current {
          color: var(--foreground);
          font-weight: 600;
        }

        .crumbs-slash .sep::before {
          content: "/";
          opacity: 0.5;
          margin-inline: 0.1rem;
        }

        .crumbs-collapsed .ellipsis {
          color: var(--muted-foreground);
        }

        .crumbs-collapsed .current {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 6rem;
        }

        .crumb-back {
          display: inline-flex;
          align-items: center;
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }

        .crumb-current {
          display: block;
          margin-top: 0.35rem;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .crumbs-scroll {
          overflow-x: auto;
          scroll-snap-type: x proximity;
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            black 12px,
            black calc(100% - 12px),
            transparent
          );
          mask-image: linear-gradient(
            90deg,
            transparent,
            black 12px,
            black calc(100% - 12px),
            transparent
          );
          padding-inline: 0.25rem;
        }

        .crumbs-scroll > * {
          scroll-snap-align: start;
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
