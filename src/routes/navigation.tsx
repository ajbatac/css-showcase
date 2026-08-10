import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, Bell, ChevronDown, MoreHorizontal, Home, Compass, Bookmark, User } from "lucide-react";

export const Route = createFileRoute("/navigation")({
  head: () => ({
    meta: [
      { title: "Navigation — Hamburger & Desktop Menu" },
      {
        name: "description",
        content:
          "Top bar, left rail, split logo, hamburger drawer, and bottom tab bar navigation patterns reshaped per device with container queries.",
      },
      { property: "og:title", content: "Navigation — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Multiple navigation design patterns per device using container queries: top bar, left rail, split nav, hamburger drawer, bottom tabs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NavigationDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "topbar" | "rail" | "split" | "topbar-overflow" | "drawer" | "bottomtabs";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "topbar", label: "Horizontal top bar", desc: "Links inline in the header" },
    { id: "rail", label: "Left rail", desc: "Vertical sidebar navigation" },
    { id: "split", label: "Centered logo split", desc: "Links flank a centered logo" },
  ],
  ipad: [
    { id: "topbar-overflow", label: "Top bar + overflow", desc: "A few links, rest collapse into More" },
    { id: "rail", label: "Left rail", desc: "Vertical sidebar navigation" },
  ],
  mobile: [
    { id: "drawer", label: "Hamburger drawer", desc: "Menu slides in from the side" },
    { id: "bottomtabs", label: "Bottom tab bar", desc: "Fixed tabs anchored to the bottom" },
  ],
};

const LINKS = ["Home", "Products", "Solutions", "Pricing", "Docs", "Contact"];

const CSS_BY_PATTERN: Record<Pattern, string> = {
  topbar: `/* Horizontal top bar */
.nav-shell { container-type: inline-size; }

.nav-links {
  display: flex;
  gap: 1.25rem;
}`,
  rail: `/* Left rail sidebar */
.nav-shell {
  container-type: inline-size;
  display: grid;
  grid-template-columns: auto 1fr;   /* rail + content */
}

.nav-rail {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  border-right: 1px solid var(--border);
}`,
  split: `/* Centered logo split nav */
.nav-shell { container-type: inline-size; }

.nav-topbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;  /* left links | logo | right links */
  align-items: center;
}

.nav-links--left  { justify-content: flex-end; }
.nav-links--right { justify-content: flex-start; }`,
  "topbar-overflow": `/* Top bar with collapsed overflow */
.nav-links {
  display: flex;
  gap: .75rem;
  overflow: hidden;
}

.nav-more {
  display: inline-flex;
  align-items: center;
  gap: .25rem;
}`,
  drawer: `/* Hamburger drawer */
.nav-links { display: none; }
.nav-burger { display: inline-flex; }

.nav-drawer {
  transform: translateX(-100%);
  transition: transform .3s ease;
}
.nav-drawer[data-open="true"] {
  transform: translateX(0);
}`,
  bottomtabs: `/* Bottom tab bar */
.nav-shell {
  container-type: inline-size;
  display: grid;
  grid-template-rows: 1fr auto;   /* content, tabs */
}

.nav-tabbar {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  border-top: 1px solid var(--border);
}`,
};

function NavigationDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>({
    desktop: "topbar",
    ipad: "rail",
    mobile: "drawer",
  });

  const pattern = patterns[device];
  const options = PATTERNS[device];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One nav. Many shapes per device.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Pick a device, then pick a design pattern for that device — top
            bar, left rail, or centered split on desktop; drawer or bottom
            tabs on mobile — all using{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">container-type</code>{" "}
            — no JS breakpoint listeners.
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
            <DeviceFrame device={device} pattern={pattern} />
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
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {device} design patterns
            </p>
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
                nav-{pattern}.css
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
              <li>• Container queries</li>
              <li>• Transform drawer</li>
              <li>• aspect-ratio frames</li>
              <li>• data-* state</li>
              <li>• Semantic tokens</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeviceFrame({ device, pattern }: { device: Device; pattern: Pattern }) {
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
      <NavApp pattern={pattern} />
    </div>
  );
}

function Content() {
  return (
    <div className="min-w-0 flex-1 space-y-1.5 p-2">
      <div className="h-2 w-1/2 rounded bg-foreground/60" />
      <div className="h-1.5 w-full rounded bg-muted-foreground/30" />
      <div className="h-1.5 w-5/6 rounded bg-muted-foreground/30" />
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="h-8 rounded bg-muted" />
        <div className="h-8 rounded bg-muted" />
      </div>
      <div className="h-1.5 w-2/3 rounded bg-muted-foreground/30" />
      <div className="h-1.5 w-3/4 rounded bg-muted-foreground/30" />
    </div>
  );
}

function Logo() {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <div className="h-2 w-2 rounded-sm bg-primary" />
      <div className="text-[8px] font-bold tracking-wide">ACME</div>
    </div>
  );
}

function NavApp({ pattern }: { pattern: Pattern }) {
  const [open, setOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);

  if (pattern === "rail") {
    return (
      <div className="nav-shell grid h-full w-full grid-cols-[auto_1fr] overflow-hidden rounded-lg bg-card">
        <nav className="flex shrink-0 flex-col items-start gap-1.5 border-r bg-background px-1.5 py-2">
          <Logo />
          <div className="mt-1 flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l}
                className="truncate rounded px-1 py-0.5 text-[7px] font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                {l}
              </a>
            ))}
          </div>
        </nav>
        <Content />
      </div>
    );
  }

  if (pattern === "split") {
    const left = LINKS.slice(0, 3);
    const right = LINKS.slice(3);
    return (
      <div className="nav-shell flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 border-b bg-background px-2 py-1.5">
          <nav className="flex min-w-0 items-center justify-end gap-1.5">
            {left.map((l) => (
              <a key={l} className="truncate text-[7px] font-medium text-foreground/80 hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
          <Logo />
          <nav className="flex min-w-0 items-center justify-start gap-1.5">
            {right.map((l) => (
              <a key={l} className="truncate text-[7px] font-medium text-foreground/80 hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
        </div>
        <Content />
      </div>
    );
  }

  if (pattern === "topbar-overflow") {
    const visible = LINKS.slice(0, 3);
    const rest = LINKS.slice(3);
    return (
      <div className="nav-shell relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 border-b bg-background px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <Logo />
            <nav className="flex min-w-0 items-center gap-1.5">
              {visible.map((l) => (
                <a key={l} className="truncate text-[7px] font-medium text-foreground/80 hover:text-foreground">
                  {l}
                </a>
              ))}
            </nav>
          </div>
          <button
            type="button"
            onClick={() => setOverflowOpen((o) => !o)}
            className="nav-more flex shrink-0 items-center gap-0.5 rounded border bg-card px-1 py-0.5 text-[7px] font-medium text-foreground hover:bg-muted"
          >
            <MoreHorizontal className="h-2.5 w-2.5" />
            More
          </button>
        </div>
        {overflowOpen && (
          <div className="absolute right-1 top-6 z-10 rounded border bg-card p-1 shadow-lg">
            <ul className="space-y-0.5">
              {rest.map((l) => (
                <li key={l} className="truncate rounded px-1.5 py-0.5 text-[7px] font-medium text-foreground hover:bg-muted">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Content />
      </div>
    );
  }

  if (pattern === "bottomtabs") {
    const tabs = [
      { icon: Home, label: "Home" },
      { icon: Compass, label: "Explore" },
      { icon: Bookmark, label: "Saved" },
      { icon: User, label: "You" },
    ];
    return (
      <div className="nav-shell grid h-full w-full grid-rows-[1fr_auto] overflow-hidden rounded-lg bg-card">
        <Content />
        <div className="nav-tabbar grid grid-flow-col auto-cols-fr border-t bg-background py-1">
          {tabs.map((t) => (
            <button
              key={t.label}
              type="button"
              className="flex flex-col items-center justify-center gap-0.5 py-0.5 text-foreground/70 hover:text-foreground"
            >
              <t.icon className="h-2.5 w-2.5" />
              <span className="text-[6px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (pattern === "drawer") {
    return (
      <div className="nav-shell relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
        <div className="relative z-20 flex items-center justify-between border-b bg-background px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="flex items-center justify-center rounded p-0.5 text-foreground hover:bg-muted"
            >
              {open ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
            </button>
            <Logo />
          </div>
          <div className="flex items-center gap-1">
            <Search className="h-2.5 w-2.5 text-muted-foreground" />
            <Bell className="h-2.5 w-2.5 text-muted-foreground" />
          </div>
        </div>

        <div
          className="nav-drawer absolute inset-y-0 left-0 top-6 z-10 w-1/2 border-r bg-card p-2 shadow-lg"
          data-open={open}
          style={{
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform .3s ease",
          }}
        >
          <div className="mb-1 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          <ul className="space-y-0.5">
            {LINKS.map((l) => (
              <li key={l} className="truncate rounded px-1 py-0.5 text-[8px] font-medium text-foreground hover:bg-muted">
                {l}
              </li>
            ))}
          </ul>
        </div>

        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 top-6 z-[5] bg-foreground/20"
          />
        )}

        <Content />
      </div>
    );
  }

  // topbar (default)
  return (
    <div className="nav-shell flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
      <div className="flex items-center justify-between border-b bg-background px-2 py-1.5">
        <Logo />
        <nav className="nav-links flex min-w-0 items-center gap-1.5">
          {LINKS.map((l) => (
            <a key={l} className="truncate text-[7px] font-medium text-foreground/80 hover:text-foreground">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <Search className="h-2.5 w-2.5 text-muted-foreground" />
          <Bell className="h-2.5 w-2.5 text-muted-foreground" />
          <div className="flex items-center gap-0.5 rounded bg-muted px-1 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <ChevronDown className="h-2 w-2 text-muted-foreground" />
          </div>
        </div>
      </div>
      <Content />
    </div>
  );
}
