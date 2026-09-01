import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/containers")({
  head: () => ({
    meta: [
      { title: "Containers — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Content container and width patterns — centered prose, sidebar layouts, and full-bleed bands — reshaped for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Containers — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Container width strategies using max-inline-size, margin-inline: auto, ch units, and the full-bleed grid trick.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContainersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "centered" | "sidebar" | "full-bleed" | "padded" | "edge-to-edge";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "centered", label: "Centered prose", desc: "max-inline-size + auto margins" },
    { id: "sidebar", label: "Content + sidebar", desc: "Grid with fixed aside column" },
    { id: "full-bleed", label: "Full-bleed band", desc: "Breaks out of the container" },
  ],
  ipad: [
    { id: "centered", label: "Centered prose", desc: "max-inline-size + auto margins" },
    { id: "sidebar", label: "Content + sidebar", desc: "Grid with fixed aside column" },
  ],
  mobile: [
    { id: "padded", label: "Padded fluid", desc: "Edge padding, fluid width" },
    { id: "edge-to-edge", label: "Edge-to-edge", desc: "No inline padding at all" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  centered: `/* Centered prose container */
.container[data-pattern="centered"] {
  max-inline-size: 62ch;
  margin-inline: auto;
  padding-inline: 1rem;
}`,
  sidebar: `/* Content + sidebar grid */
.container[data-pattern="sidebar"] {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(90px, 28%);
  gap: 0.75rem;
  max-inline-size: 72ch;
  margin-inline: auto;
}`,
  "full-bleed": `/* Full-bleed band trick */
.container[data-pattern="full-bleed"] {
  display: grid;
  grid-template-columns:
    1fr min(62ch, 100%) 1fr;
}

.container[data-pattern="full-bleed"] > * {
  grid-column: 2;
}

.container[data-pattern="full-bleed"] .bleed {
  grid-column: 1 / -1;
  width: 100%;
}`,
  padded: `/* Padded fluid container */
.container[data-pattern="padded"] {
  width: 100%;
  padding-inline: 1rem;
  box-sizing: border-box;
}`,
  "edge-to-edge": `/* Edge-to-edge container */
.container[data-pattern="edge-to-edge"] {
  width: 100%;
  padding-inline: 0;
}`,
};

function ContainersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "centered",
      ipad: "centered",
      mobile: "padded",
    }),
  );

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
            Containers that adapt.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A single content wrapper that centers prose with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">max-inline-size</code>,
            adds a sidebar with grid, and breaks out full-bleed bands — no wrapper divs needed.
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
                className="container h-full w-full overflow-auto bg-background"
              >
                {pattern === "full-bleed" ? (
                  <>
                    <div className="rounded bg-card p-2 text-[9px] text-muted-foreground">
                      Regular content, constrained width.
                    </div>
                    <div className="bleed my-2 flex h-10 items-center justify-center bg-primary/20 text-[9px] font-semibold text-primary">
                      Full-bleed band
                    </div>
                    <div className="rounded bg-card p-2 text-[9px] text-muted-foreground">
                      Back to constrained width again.
                    </div>
                  </>
                ) : pattern === "sidebar" ? (
                  <>
                    <div className="rounded bg-card p-2 text-[9px] leading-relaxed text-muted-foreground">
                      Main content column flows here, taking up the remaining space beside the
                      fixed-width aside.
                    </div>
                    <aside className="rounded border bg-muted/50 p-2 text-[9px] text-muted-foreground">
                      Aside
                    </aside>
                  </>
                ) : (
                  <div className="space-y-2 py-2">
                    <div className="rounded bg-card p-2 text-[9px] leading-relaxed text-muted-foreground">
                      This paragraph is capped at a readable measure regardless of viewport width,
                      keeping line lengths comfortable.
                    </div>
                    <div className="rounded bg-card p-2 text-[9px] leading-relaxed text-muted-foreground">
                      Resize the frame — the text block scales fluidly within its bounds.
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
                container-{pattern}.css
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
              <li>• max-inline-size</li>
              <li>• margin-inline: auto</li>
              <li>• ch units</li>
              <li>• Full-bleed grid trick</li>
              <li>• min() sizing function</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .container {
          padding-block: 0.5rem;
        }

        .container[data-pattern="centered"] {
          max-inline-size: 62ch;
          margin-inline: auto;
          padding-inline: 1rem;
        }

        .container[data-pattern="sidebar"] {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(60px, 30%);
          gap: 0.5rem;
          max-inline-size: 72ch;
          margin-inline: auto;
          padding-inline: 1rem;
          align-items: start;
        }

        .container[data-pattern="full-bleed"] {
          display: grid;
          grid-template-columns: 1fr min(62ch, 100%) 1fr;
          padding-inline: 0;
        }

        .container[data-pattern="full-bleed"] > * {
          grid-column: 2;
        }

        .container[data-pattern="full-bleed"] .bleed {
          grid-column: 1 / -1;
          width: 100%;
        }

        .container[data-pattern="padded"] {
          width: 100%;
          padding-inline: 1rem;
          box-sizing: border-box;
        }

        .container[data-pattern="edge-to-edge"] {
          width: 100%;
          padding-inline: 0;
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
