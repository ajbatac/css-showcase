import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const PRESET_IDS = [
  "12-col",
  "holy-grail",
  "auto-fit",
  "auto-fill",
  "dense",
  "asymmetric",
] as const;
const DEVICE_IDS = ["desktop", "ipad", "mobile"] as const;

type GridSearch = {
  device?: (typeof DEVICE_IDS)[number];
  preset?: (typeof PRESET_IDS)[number];
  gap?: number;
  min?: number;
};

export const Route = createFileRoute("/grid")({
  validateSearch: (search: Record<string, unknown>): GridSearch => {
    const device = DEVICE_IDS.includes(search.device as never)
      ? (search.device as GridSearch["device"])
      : undefined;
    const preset = PRESET_IDS.includes(search.preset as never)
      ? (search.preset as GridSearch["preset"])
      : undefined;
    const gapNum = Number(search.gap);
    const minNum = Number(search.min);
    return {
      device,
      preset,
      gap: Number.isFinite(gapNum) ? Math.min(24, Math.max(0, gapNum)) : undefined,
      min: Number.isFinite(minNum) ? Math.min(160, Math.max(40, minNum)) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "CSS Grid Demo — Modern CSS" },
      {
        name: "description",
        content:
          "Interactive CSS Grid playground: swap between template presets and auto-placement across desktop, iPad, and mobile frames.",
      },
      { property: "og:title", content: "CSS Grid Demo — Modern CSS" },
      {
        property: "og:description",
        content:
          "Tap through grid-template presets, auto-fit, and dense auto-placement on a live device-switching frame.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GridDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Preset =
  | "12-col"
  | "holy-grail"
  | "auto-fit"
  | "auto-fill"
  | "dense"
  | "asymmetric";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PRESETS: { id: Preset; label: string; blurb: string }[] = [
  { id: "12-col", label: "12-column", blurb: "Classic fixed track grid" },
  { id: "holy-grail", label: "Holy grail", blurb: "Header / sidebar / main / footer" },
  { id: "auto-fit", label: "auto-fit", blurb: "Responsive without media queries" },
  { id: "auto-fill", label: "auto-fill", blurb: "Keeps empty tracks reserved" },
  { id: "dense", label: "Dense pack", blurb: "Auto-placement fills holes" },
  { id: "asymmetric", label: "Asymmetric", blurb: "Named areas, uneven tracks" },
];

function GridDemo() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/grid" });
  const device: Device = search.device ?? "mobile";
  const preset: Preset = search.preset ?? "auto-fit";
  const gap: number = search.gap ?? 6;
  const minTrack: number = search.min ?? 80;
  const [copied, setCopied] = useState(false);

  const update = (next: Partial<GridSearch>) => {
    navigate({
      search: (prev: GridSearch) => ({ ...prev, ...next }),
      replace: true,
    });
  };
  const setDevice = (v: Device) => update({ device: v });
  const setPreset = (v: Preset) => update({ preset: v });
  const setGap = (v: number) => update({ gap: v });
  const setMinTrack = (v: number) => update({ min: v });

  const copyLink = async () => {
    const params = new URLSearchParams({
      device,
      preset,
      gap: String(gap),
      min: String(minTrack),
    });
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/grid?${params.toString()}`
        : `/grid?${params.toString()}`;
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const cssCode = buildCss(preset, gap, minTrack);


  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            CSS Grid, six presets deep.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Swap between{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">grid-template-columns</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">grid-template-areas</code>,
            and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">auto-fit / auto-fill</code>{" "}
            inside a device frame.
          </p>
        </header>

        <section
          aria-labelledby="demo-title"
          className="overflow-hidden rounded-3xl border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 id="demo-title" className="text-sm font-semibold">
              Grid playground
            </h2>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {device} · {preset}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device}>
              <GridApp preset={preset} gap={gap} minTrack={minTrack} />
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

          <div className="space-y-4 border-t p-4">
            <div>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                grid preset
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {PRESETS.map((p) => {
                  const active = preset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPreset(p.id)}
                      className={`flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-2 text-left transition ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="text-xs font-semibold">{p.label}</span>
                      <span
                        className={`text-[10px] leading-tight ${
                          active ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {p.blurb}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  gap · {gap}px
                </span>
                <input
                  type="range"
                  min={0}
                  max={24}
                  step={1}
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="accent-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  min track · {minTrack}px
                </span>
                <input
                  type="range"
                  min={40}
                  max={160}
                  step={4}
                  value={minTrack}
                  onChange={(e) => setMinTrack(Number(e.target.value))}
                  disabled={preset !== "auto-fit" && preset !== "auto-fill"}
                  className="accent-primary disabled:opacity-40"
                />
              </label>
            </div>
          </div>

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
              <li>• grid-template-columns</li>
              <li>• grid-template-areas</li>
              <li>• minmax() + auto-fit</li>
              <li>• auto-fill vs auto-fit</li>
              <li>• grid-auto-flow: dense</li>
              <li>• span / row-span</li>
            </ul>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Every preset is real Grid — no JS layout math, no media queries for auto-fit.
        </p>
      </div>
    </main>
  );
}

function buildCss(preset: Preset, gap: number, minTrack: number): string {
  switch (preset) {
    case "12-col":
      return `.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${gap}px;
}
.hero  { grid-column: span 12; }
.card  { grid-column: span 4; }
.wide  { grid-column: span 6; }`;
    case "holy-grail":
      return `.grid {
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "aside  main   nav"
    "footer footer footer";
  gap: ${gap}px;
}
.header { grid-area: header; }
.aside  { grid-area: aside; }
.main   { grid-area: main; }
.nav    { grid-area: nav; }
.footer { grid-area: footer; }`;
    case "auto-fit":
      return `.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(${minTrack}px, 1fr));
  gap: ${gap}px;
}
/* Tracks stretch to fill remaining space. */`;
    case "auto-fill":
      return `.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(${minTrack}px, 1fr));
  gap: ${gap}px;
}
/* Empty tracks are kept — items don't stretch to fill them. */`;
    case "dense":
      return `.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 40px;
  grid-auto-flow: dense;
  gap: ${gap}px;
}
.tall { grid-row: span 2; }
.wide { grid-column: span 2; }
.big  { grid-column: span 2; grid-row: span 2; }`;
    case "asymmetric":
      return `.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "feature  side  side"
    "feature  a     b";
  gap: ${gap}px;
}
.feature { grid-area: feature; }
.side    { grid-area: side; }
.a       { grid-area: a; }
.b       { grid-area: b; }`;
  }
}

function ControlPill() {
  return null; // unused, kept intentionally out
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

function GridApp({
  preset,
  gap,
  minTrack,
}: {
  preset: Preset;
  gap: number;
  minTrack: number;
}) {
  return (
    <div className="grid h-full w-full gap-1.5 overflow-hidden rounded-lg bg-muted/40 p-1.5">
      <div className="flex items-center gap-1.5 rounded-md bg-card px-2 py-1.5">
        <div className="h-2 w-2 rounded-full bg-destructive/60" />
        <div className="h-2 w-2 rounded-full bg-chart-4/70" />
        <div className="h-2 w-2 rounded-full bg-chart-2/70" />
        <div className="ml-2 h-2 flex-1 rounded bg-muted" />
      </div>
      <div className="min-h-0 flex-1 rounded-md border border-dashed border-primary/40 bg-card p-1.5">
        <GridStage preset={preset} gap={gap} minTrack={minTrack} />
      </div>
    </div>
  );
}

function GridStage({
  preset,
  gap,
  minTrack,
}: {
  preset: Preset;
  gap: number;
  minTrack: number;
}) {
  const t = {
    a: "bg-primary/80 text-primary-foreground",
    b: "bg-chart-2/80 text-white",
    c: "bg-chart-4/80 text-foreground",
    d: "bg-chart-1/80 text-white",
    e: "bg-chart-3/80 text-white",
    m: "bg-muted text-foreground",
  } as const;

  const cell = (label: string, tone: keyof typeof t, style?: React.CSSProperties) => (
    <div
      key={label + (style?.gridArea ?? "") + (style?.gridColumn ?? "") + (style?.gridRow ?? "")}
      style={{ transition: "all .3s ease", ...style }}
      className={`grid place-items-center rounded text-[9px] font-bold ${t[tone]}`}
    >
      {label}
    </div>
  );

  const common: React.CSSProperties = {
    display: "grid",
    gap: `${gap}px`,
    height: "100%",
    transition: "gap .3s ease",
  };

  if (preset === "12-col") {
    return (
      <div style={{ ...common, gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "24px" }}>
        {cell("hero", "a", { gridColumn: "span 12", height: 32 })}
        {cell("card", "b", { gridColumn: "span 4" })}
        {cell("card", "c", { gridColumn: "span 4" })}
        {cell("card", "d", { gridColumn: "span 4" })}
        {cell("wide", "e", { gridColumn: "span 6" })}
        {cell("wide", "a", { gridColumn: "span 6" })}
      </div>
    );
  }

  if (preset === "holy-grail") {
    return (
      <div
        style={{
          ...common,
          gridTemplateColumns: "48px 1fr 48px",
          gridTemplateRows: "24px 1fr 20px",
          gridTemplateAreas: `"header header header" "aside main nav" "footer footer footer"`,
        }}
      >
        {cell("header", "a", { gridArea: "header" })}
        {cell("aside", "m", { gridArea: "aside" })}
        {cell("main", "b", { gridArea: "main" })}
        {cell("nav", "m", { gridArea: "nav" })}
        {cell("footer", "c", { gridArea: "footer" })}
      </div>
    );
  }

  if (preset === "auto-fit" || preset === "auto-fill") {
    const kw = preset;
    // Scale min track a bit for the tiny frame so behavior is visible.
    const scaled = Math.max(28, Math.round(minTrack * 0.45));
    return (
      <div
        style={{
          ...common,
          gridTemplateColumns: `repeat(${kw}, minmax(${scaled}px, 1fr))`,
          gridAutoRows: 28,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) =>
          cell(String(i + 1), (["a", "b", "c", "d", "e"] as const)[i % 5]),
        )}
      </div>
    );
  }

  if (preset === "dense") {
    return (
      <div
        style={{
          ...common,
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "22px",
          gridAutoFlow: "dense",
        }}
      >
        {cell("big", "a", { gridColumn: "span 2", gridRow: "span 2" })}
        {cell("1", "b")}
        {cell("tall", "c", { gridRow: "span 2" })}
        {cell("2", "d")}
        {cell("wide", "e", { gridColumn: "span 2" })}
        {cell("3", "b")}
        {cell("4", "a")}
        {cell("5", "d")}
      </div>
    );
  }

  // asymmetric
  return (
    <div
      style={{
        ...common,
        gridTemplateColumns: "2fr 1fr 1fr",
        gridTemplateRows: "1fr auto",
        gridTemplateAreas: `"feature side side" "feature a b"`,
        gridAutoRows: "24px",
      }}
    >
      {cell("feature", "a", { gridArea: "feature" })}
      {cell("side", "b", { gridArea: "side" })}
      {cell("a", "c", { gridArea: "a" })}
      {cell("b", "d", { gridArea: "b" })}
    </div>
  );
}

// keep tree-shaker happy about unused helper
void ControlPill;
