import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, Bell, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/navigation")({
  head: () => ({
    meta: [
      { title: "Navigation — Hamburger & Desktop Menu" },
      {
        name: "description",
        content:
          "One nav, two shapes: a full horizontal menu on desktop that collapses into a hamburger drawer on tablet and mobile using container queries.",
      },
      { property: "og:title", content: "Navigation — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Hamburger drawer on mobile, horizontal menu on desktop with container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NavigationDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const LINKS = ["Home", "Products", "Solutions", "Pricing", "Docs", "Contact"];

const CSS_CODE = `.nav-shell {
  container-type: inline-size;
}

/* Mobile-first: hamburger visible, links hidden */
.nav-links { display: none; }
.nav-burger { display: inline-flex; }

/* Drawer slides in from the side on mobile */
.nav-drawer[data-open="true"] {
  transform: translateX(0);
}
.nav-drawer {
  transform: translateX(-100%);
  transition: transform .3s ease;
}

/* Desktop: swap to horizontal menu, hide burger */
@container (min-width: 640px) {
  .nav-links  { display: flex; gap: 1.25rem; }
  .nav-burger { display: none; }
  .nav-drawer { display: none; }
}`;

function NavigationDemo() {
  const [device, setDevice] = useState<Device>("mobile");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One nav. Two shapes.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A horizontal menu on desktop that collapses into a hamburger drawer on tablet
            and mobile using{" "}
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
              {device}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device} />
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
              <span className="text-xs font-semibold text-muted-foreground">nav.css</span>
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

function DeviceFrame({ device }: { device: Device }) {
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
      <NavApp />
    </div>
  );
}

function NavApp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="nav-shell relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between border-b bg-background px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="nav-burger items-center justify-center rounded p-0.5 text-foreground hover:bg-muted"
          >
            {open ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
          </button>
          <div className="h-2 w-2 rounded-sm bg-primary" />
          <div className="text-[8px] font-bold tracking-wide">ACME</div>
        </div>

        {/* Desktop horizontal links */}
        <nav className="nav-links hidden items-center">
          {LINKS.map((l) => (
            <a
              key={l}
              className="text-[7px] font-medium text-foreground/80 hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Search className="h-2.5 w-2.5 text-muted-foreground" />
          <Bell className="h-2.5 w-2.5 text-muted-foreground" />
          <div className="flex items-center gap-0.5 rounded bg-muted px-1 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <ChevronDown className="h-2 w-2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className="nav-drawer absolute inset-y-0 left-0 top-6 z-10 w-1/2 border-r bg-card p-2 shadow-lg"
        data-open={open}
      >
        <div className="mb-1 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </div>
        <ul className="space-y-0.5">
          {LINKS.map((l) => (
            <li
              key={l}
              className="rounded px-1 py-0.5 text-[8px] font-medium text-foreground hover:bg-muted"
            >
              {l}
            </li>
          ))}
        </ul>
      </div>

      {/* Backdrop for mobile drawer */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="nav-backdrop absolute inset-0 top-6 z-[5] bg-foreground/20"
        />
      )}

      {/* Content */}
      <div className="flex-1 space-y-1.5 p-2">
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

      <style>{`
        .nav-links { display: none; }
        .nav-burger { display: inline-flex; }
        .nav-drawer { transform: translateX(-100%); transition: transform .3s ease; }
        .nav-drawer[data-open="true"] { transform: translateX(0); }
        @container (min-width: 460px) {
          .nav-links  { display: flex; align-items: center; gap: .75rem; }
          .nav-burger { display: none; }
          .nav-drawer { display: none; }
          .nav-backdrop { display: none; }
        }
      `}</style>
    </div>
  );
}
