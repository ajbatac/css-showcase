import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CSS Showcase — Device Switcher" },
      {
        name: "description",
        content:
          "Interactive, mobile-first showcase of modern CSS: switch a skeleton app between desktop, iPad, and mobile with pure CSS.",
      },
      { property: "og:title", content: "CSS Showcase — Device Switcher" },
      {
        property: "og:description",
        content:
          "Tap between desktop, iPad, and mobile to see a skeleton app adapt using container queries, aspect-ratio, and grid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.frame {
  container-type: inline-size;
  aspect-ratio: var(--ratio, 9 / 19.5);
  max-width: var(--max, 320px);
  margin-inline: auto;
  border-radius: var(--radius, 2rem);
  transition: aspect-ratio .5s ease, max-width .5s ease,
              border-radius .5s ease;
}

.frame[data-device="desktop"] { --ratio: 16/10; --max: 100%;  --radius: .75rem; }
.frame[data-device="ipad"]    { --ratio: 4/3;   --max: 90%;   --radius: 1.25rem; }
.frame[data-device="mobile"]  { --ratio: 9/19.5;--max: 260px; --radius: 2rem; }

/* Layout responds to the FRAME size, not the viewport */
.app { display: grid; gap: .5rem; grid-template-columns: 1fr; }

@container (min-width: 520px) {
  .app { grid-template-columns: 160px 1fr; }
  .cards { grid-template-columns: repeat(3, 1fr); }
}
@container (min-width: 780px) {
  .cards { grid-template-columns: repeat(4, 1fr); }
}`;

function Index() {
  const [device, setDevice] = useState<Device>("mobile");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One tap. Three devices. Pure CSS.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A skeleton app that reshapes itself using{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">container-type</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">aspect-ratio</code>, and CSS
            custom properties.
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

          {/* Preview stage */}
          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device} />
          </div>

          {/* Toggles */}
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

          {/* Code */}
          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">styles.css</span>
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

          {/* Notes */}
          <div className="border-t px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CSS features used
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground">
              <li>• Container queries</li>
              <li>• aspect-ratio</li>
              <li>• Custom properties</li>
              <li>• CSS Grid</li>
              <li>• Smooth transitions</li>
              <li>• data-* attribute state</li>
            </ul>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          The skeleton layout responds to the <em>frame's</em> width via container queries — not the
          browser window.
        </p>
      </div>
    </main>
  );
}

function DeviceFrame({ device }: { device: Device }) {
  const style: Record<Device, React.CSSProperties> = {
    desktop: {
      aspectRatio: "16 / 10",
      maxWidth: "100%",
      borderRadius: "0.75rem",
    },
    ipad: {
      aspectRatio: "4 / 3",
      maxWidth: "88%",
      borderRadius: "1.5rem",
    },
    mobile: {
      aspectRatio: "9 / 19.5",
      maxWidth: "220px",
      borderRadius: "2rem",
    },
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
      className="relative mx-auto w-full border-4 border-foreground/80 bg-background p-2 shadow-2xl"
    >
      {/* Notch / camera dot for mobile only */}
      {device === "mobile" && (
        <div className="absolute left-1/2 top-1 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-foreground/70" />
      )}
      <SkeletonApp />
    </div>
  );
}

function SkeletonApp() {
  return (
    <div className="skeleton-app grid h-full w-full gap-1.5 overflow-hidden rounded-lg bg-muted/40 p-1.5">
      {/* Top bar */}
      <div className="flex items-center gap-1.5 rounded-md bg-card px-2 py-1.5">
        <div className="h-2 w-2 rounded-full bg-destructive/60" />
        <div className="h-2 w-2 rounded-full bg-chart-4/70" />
        <div className="h-2 w-2 rounded-full bg-chart-2/70" />
        <div className="ml-2 h-2 flex-1 rounded bg-muted" />
      </div>

      {/* Body */}
      <div className="skeleton-body grid min-h-0 flex-1 gap-1.5">
        {/* Sidebar */}
        <aside className="skeleton-sidebar hidden flex-col gap-1 rounded-md bg-card p-1.5">
          <div className="h-2 rounded bg-primary/70" />
          <div className="h-2 rounded bg-muted" />
          <div className="h-2 rounded bg-muted" />
          <div className="h-2 rounded bg-muted" />
          <div className="mt-auto h-6 rounded bg-muted" />
        </aside>

        {/* Main */}
        <section className="flex min-h-0 flex-col gap-1.5">
          <div className="skeleton-cards grid gap-1.5" style={{ gridTemplateColumns: "1fr" }}>
            <Card tone="primary" />
            <Card tone="chart2" />
            <Card tone="chart4" />
            <Card tone="chart1" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-1 rounded-md bg-card p-1.5">
            <div className="h-2 w-1/3 rounded bg-foreground/60" />
            <div className="flex flex-1 items-end gap-1">
              {[40, 65, 30, 80, 55, 70, 45, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1 rounded-md bg-card p-1.5">
            <div className="h-1.5 w-full rounded bg-muted" />
            <div className="h-1.5 w-4/5 rounded bg-muted" />
            <div className="h-1.5 w-3/5 rounded bg-muted" />
          </div>
        </section>
      </div>

      <style>{`
        .skeleton-body { grid-template-columns: 1fr; }
        @container (min-width: 340px) {
          .skeleton-cards { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @container (min-width: 480px) {
          .skeleton-sidebar { display: flex !important; }
          .skeleton-body { grid-template-columns: 90px 1fr; }
          .skeleton-cards { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @container (min-width: 700px) {
          .skeleton-body { grid-template-columns: 130px 1fr; }
          .skeleton-cards { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

function Card({ tone }: { tone: "primary" | "chart1" | "chart2" | "chart4" }) {
  const bg = {
    primary: "bg-primary/15",
    chart1: "bg-chart-1/20",
    chart2: "bg-chart-2/20",
    chart4: "bg-chart-4/20",
  }[tone];
  const bar = {
    primary: "bg-primary",
    chart1: "bg-chart-1",
    chart2: "bg-chart-2",
    chart4: "bg-chart-4",
  }[tone];
  return (
    <div className={`flex flex-col gap-1 rounded-md ${bg} p-1.5`}>
      <div className={`h-1.5 w-1/2 rounded ${bar}`} />
      <div className="h-3 w-3/4 rounded bg-foreground/60" />
      <div className="h-1.5 w-2/3 rounded bg-foreground/25" />
    </div>
  );
}
