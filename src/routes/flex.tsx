import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/flex")({
  head: () => ({
    meta: [
      { title: "Flexbox Demo — CSS Showcase" },
      {
        name: "description",
        content:
          "Interactive Flexbox playground: switch direction, justify, align, wrap and gap across desktop, iPad, and mobile frames.",
      },
      { property: "og:title", content: "Flexbox Demo — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Tap through flex-direction, justify-content, align-items, wrap and gap on a live device-switching frame.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlexDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Direction = "row" | "row-reverse" | "column" | "column-reverse";
type Justify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type Align = "stretch" | "flex-start" | "center" | "flex-end";
type Wrap = "nowrap" | "wrap";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const DIRECTIONS: Direction[] = ["row", "row-reverse", "column", "column-reverse"];
const JUSTIFIES: Justify[] = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];
const ALIGNS: Align[] = ["stretch", "flex-start", "center", "flex-end"];

const ITEMS = [
  { n: 1, tone: "primary" as const },
  { n: 2, tone: "chart2" as const },
  { n: 3, tone: "chart4" as const },
  { n: 4, tone: "chart1" as const },
  { n: 5, tone: "primary" as const },
];

function FlexDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [direction, setDirection] = useState<Direction>("row");
  const [justify, setJustify] = useState<Justify>("flex-start");
  const [align, setAlign] = useState<Align>("stretch");
  const [wrap, setWrap] = useState<Wrap>("wrap");
  const [gap, setGap] = useState<number>(8);
  const [count, setCount] = useState<number>(5);

  const cssCode = `.flex-box {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}

.flex-item {
  flex: 0 1 auto;
  min-width: 2.5rem;
  min-height: 2.5rem;
}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Flexbox, one tap at a time.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Toggle{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">flex-direction</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">justify-content</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">align-items</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">flex-wrap</code>, and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">gap</code> inside a device frame.
          </p>
        </header>

        <section
          aria-labelledby="demo-title"
          className="overflow-hidden rounded-3xl border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 id="demo-title" className="text-sm font-semibold">
              Flex playground
            </h2>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {device}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device}>
              <FlexApp
                direction={direction}
                justify={justify}
                align={align}
                wrap={wrap}
                gap={gap}
                count={count}
              />
            </DeviceFrame>
          </div>

          {/* Device toggles */}
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

          {/* Property controls */}
          <div className="space-y-4 border-t p-4">
            <ControlGroup label="flex-direction">
              {DIRECTIONS.map((v) => (
                <Pill key={v} active={direction === v} onClick={() => setDirection(v)}>
                  {v}
                </Pill>
              ))}
            </ControlGroup>

            <ControlGroup label="justify-content">
              {JUSTIFIES.map((v) => (
                <Pill key={v} active={justify === v} onClick={() => setJustify(v)}>
                  {v}
                </Pill>
              ))}
            </ControlGroup>

            <ControlGroup label="align-items">
              {ALIGNS.map((v) => (
                <Pill key={v} active={align === v} onClick={() => setAlign(v)}>
                  {v}
                </Pill>
              ))}
            </ControlGroup>

            <ControlGroup label="flex-wrap">
              {(["nowrap", "wrap"] as Wrap[]).map((v) => (
                <Pill key={v} active={wrap === v} onClick={() => setWrap(v)}>
                  {v}
                </Pill>
              ))}
            </ControlGroup>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  gap · {gap}px
                </span>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={2}
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="accent-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  items · {count}
                </span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="accent-primary"
                />
              </label>
            </div>
          </div>

          {/* Code */}
          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">styles.css</span>
              <button
                onClick={() => navigator.clipboard?.writeText(cssCode)}
                className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto bg-card px-4 py-4 text-[11px] leading-relaxed sm:text-xs">
              <code>{cssCode}</code>
            </pre>
          </div>

          <div className="border-t px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CSS features used
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground">
              <li>• display: flex</li>
              <li>• flex-direction</li>
              <li>• justify-content</li>
              <li>• align-items</li>
              <li>• flex-wrap</li>
              <li>• gap</li>
            </ul>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Every control writes directly into the CSS on the right — no JS layout math.
        </p>
      </div>
    </main>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
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
      className="relative mx-auto w-full border-4 border-foreground/80 bg-background p-2 shadow-2xl"
    >
      {device === "mobile" && (
        <div className="absolute left-1/2 top-1 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-foreground/70" />
      )}
      {children}
    </div>
  );
}

function FlexApp({
  direction,
  justify,
  align,
  wrap,
  gap,
  count,
}: {
  direction: Direction;
  justify: Justify;
  align: Align;
  wrap: Wrap;
  gap: number;
  count: number;
}) {
  const items = ITEMS.slice(0, count);
  const tones: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    chart1: "bg-chart-1 text-white",
    chart2: "bg-chart-2 text-white",
    chart4: "bg-chart-4 text-foreground",
  };

  // Vary sizes a bit so align-items and wrap are visible.
  const sizes = [
    { w: 44, h: 44 },
    { w: 60, h: 34 },
    { w: 38, h: 56 },
    { w: 52, h: 40 },
    { w: 46, h: 48 },
    { w: 40, h: 40 },
    { w: 58, h: 44 },
    { w: 36, h: 52 },
  ];

  return (
    <div className="grid h-full w-full gap-1.5 overflow-hidden rounded-lg bg-muted/40 p-1.5">
      <div className="flex items-center gap-1.5 rounded-md bg-card px-2 py-1.5">
        <div className="h-2 w-2 rounded-full bg-destructive/60" />
        <div className="h-2 w-2 rounded-full bg-chart-4/70" />
        <div className="h-2 w-2 rounded-full bg-chart-2/70" />
        <div className="ml-2 h-2 flex-1 rounded bg-muted" />
      </div>

      <div
        className="min-h-0 flex-1 rounded-md border border-dashed border-primary/40 bg-card p-2"
        style={{
          display: "flex",
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap,
          gap: `${gap}px`,
          transition: "gap .3s ease",
        }}
      >
        {items.map((it, i) => {
          const s = sizes[i % sizes.length];
          return (
            <div
              key={i}
              className={`grid place-items-center rounded-md text-[10px] font-bold shadow-sm ${tones[it.tone]}`}
              style={{
                width: `${s.w}px`,
                height: `${s.h}px`,
                transition: "all .3s ease",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
