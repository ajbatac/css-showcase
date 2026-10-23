import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pipette } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/color-pickers")({
  head: () => ({
    meta: [
      { title: "Color Pickers — CSS Showcase" },
      {
        name: "description",
        content:
          "Swatch grids, native color inputs reskinned with ::-webkit-color-swatch, and a live hex readout — no color picker libraries.",
      },
      { property: "og:title", content: "Color Pickers — CSS Showcase" },
      {
        property: "og:description",
        content: "Swatch grids and reskinned native color inputs with a live hex readout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ColorPickersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "swatch-grid" | "inline-field" | "hex-readout" | "picker-card";

const SWATCHES = [
  "#35c3ad",
  "#6d5df1",
  "#f472b6",
  "#fbbf24",
  "#ef4444",
  "#38bdf8",
  "#101828",
  "#f8fafc",
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "swatch-grid", label: "Swatch grid", desc: "Preset swatches plus a custom picker" },
    { id: "inline-field", label: "Inline color field", desc: "input[type=color], restyled" },
    { id: "hex-readout", label: "Picker + hex readout", desc: "Live hex value beside the swatch" },
  ],
  ipad: [
    { id: "swatch-grid", label: "Swatch grid", desc: "Preset swatches plus a custom picker" },
    { id: "inline-field", label: "Inline color field", desc: "input[type=color], restyled" },
  ],
  mobile: [{ id: "picker-card", label: "Picker card", desc: "Large tap target with hex readout" }],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "swatch-grid": `/* Swatch grid */
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

.swatch {
  position: relative;
  block-size: 3rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.swatch:hover { transform: scale(1.05); }

.swatch[aria-pressed="true"] {
  box-shadow:
    0 0 0 2px var(--card),
    0 0 0 4px var(--primary);
}

/* The native picker rides inside each swatch, invisible */
.swatch input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}`,
  "inline-field": `/* Native color input, reskinned */
.color-field {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  background: var(--card);
  padding: 0.6rem 0.9rem;
}

.color-field input[type="color"] {
  inline-size: 3rem;
  block-size: 3rem;
  appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

/* Strip the UA chrome — the swatch is fully yours */
.color-field input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-field input[type="color"]::-webkit-color-swatch {
  border: 1px solid var(--border);
  border-radius: 0.7rem;
}

.color-field input[type="color"]::-moz-color-swatch {
  border: 1px solid var(--border);
  border-radius: 0.7rem;
}`,
  "hex-readout": `/* Picker + hex readout */
.hex-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hex-row input[type="color"] {
  inline-size: 3.5rem;
  block-size: 3.5rem;
  appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.hex-row input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
.hex-row input[type="color"]::-webkit-color-swatch {
  border: 1px solid var(--border);
  border-radius: 0.9rem;
}

.hex-row code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: var(--muted);
  border-radius: 0.5rem;
  padding: 0.5rem 0.8rem;
}`,
  "picker-card": `/* Picker card */
.picker-card {
  display: grid;
  gap: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--card);
  padding: 1.1rem;
}

.picker-card .picker-preview {
  block-size: 4.5rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  transition: background-color 0.2s ease;
}

/* A checkerboard shows through translucent colors */
.picker-card .picker-checker {
  background-image:
    linear-gradient(45deg, color-mix(in srgb, var(--border) 60%, transparent) 25%, transparent 25%),
    linear-gradient(-45deg, color-mix(in srgb, var(--border) 60%, transparent) 25%, transparent 25%);
  background-size: 16px 16px;
}

.picker-card label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted-foreground);
}

.picker-card input[type="color"] {
  inline-size: 100%;
  block-size: 3rem;
  appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.picker-card input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
.picker-card input[type="color"]::-webkit-color-swatch {
  border: 1px solid var(--border);
  border-radius: 0.7rem;
}`,
};

function ColorPickersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "swatch-grid",
      ipad: "swatch-grid",
      mobile: "picker-card",
    }),
  );
  const [color, setColor] = useState("#35c3ad");
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const renderDemo = () => {
    if (pattern === "swatch-grid") {
      return (
        <div className="flex h-full w-full flex-col justify-center gap-3 overflow-auto p-4">
          <p className="text-xs font-semibold">Brand color</p>
          <div className="swatch-grid" role="group" aria-label="Brand color swatches">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                className="swatch"
                style={{ background: swatch }}
                aria-pressed={color === swatch}
                aria-label={`Use color ${swatch}`}
                onClick={() => setColor(swatch)}
              />
            ))}
            <label
              className="swatch grid place-items-center border-dashed"
              style={{ background: color }}
              aria-label="Custom color"
            >
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              <Pipette className="pointer-events-none h-4 w-4 mix-blend-difference invert" />
            </label>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Selected: <code className="font-mono">{color}</code> — the eyedropper tile opens the
            native picker for anything else.
          </p>
        </div>
      );
    }
    if (pattern === "inline-field") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto p-4">
          <div className="color-field">
            <input
              type="color"
              aria-label="Accent color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <span className="text-xs text-muted-foreground">
              Accent color
              <br />
              <code className="font-mono text-[11px]">{color}</code>
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            ::-webkit-color-swatch-wrapper and ::-webkit-color-swatch strip the UA chrome.
          </p>
        </div>
      );
    }
    if (pattern === "hex-readout") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto p-4">
          <p className="text-xs font-semibold">Theme accent</p>
          <div className="hex-row">
            <input
              type="color"
              aria-label="Theme accent color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <code>{color.toUpperCase()}</code>
          </div>
          <p className="text-[11px] text-muted-foreground">
            The value is always hex — no JS color parsing needed for the readout.
          </p>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full flex-col justify-center gap-2 overflow-auto p-4">
        <div className="picker-card">
          <div
            className="picker-preview picker-checker"
            style={{ backgroundColor: color }}
            role="img"
            aria-label={`Selected color ${color}`}
          />
          <label htmlFor="picker-card-input">Custom color</label>
          <input
            id="picker-card-input"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <code className="text-center font-mono text-sm font-bold">{color.toUpperCase()}</code>
        </div>
      </div>
    );
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Pick a color, any color.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Swatch grids, native color inputs reskinned with ::-webkit-color-swatch, and a live hex
            readout — zero color-picker libraries.
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
            <DeviceFrame device={device}>{renderDemo()}</DeviceFrame>
          </div>

          <DeviceTabs value={device} onChange={setDevice} />

          <div className="border-t bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {device} design patterns
              </p>
              <CopyLinkButton device={device} pattern={pattern} />
            </div>
            <PatternList
              options={options}
              value={pattern}
              onChange={(p) => setPatterns((prev) => ({ ...prev, [device]: p }))}
            />
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                color-{pattern}.css
              </span>
              <CopyButton getText={() => CSS_BY_PATTERN[pattern]} />
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
              <li>• ::-webkit-color-swatch</li>
              <li>• ::-webkit-color-swatch-wrapper</li>
              <li>• ::-moz-color-swatch</li>
              <li>• appearance: none</li>
              <li>• aria-pressed state</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .swatch-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
        }
        .swatch {
          position: relative;
          block-size: 3rem;
          border-radius: 0.9rem;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .swatch:hover { transform: scale(1.05); }
        .swatch[aria-pressed="true"] {
          box-shadow:
            0 0 0 2px var(--card),
            0 0 0 4px var(--primary);
        }
        .swatch input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
        .swatch.border-dashed {
          border-style: dashed;
          border-color: color-mix(in srgb, var(--foreground) 40%, transparent);
        }

        .color-field {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 0.9rem;
          background: var(--card);
          padding: 0.6rem 0.9rem;
        }
        .color-field input[type="color"],
        .hex-row input[type="color"],
        .picker-card input[type="color"] {
          appearance: none;
          -webkit-appearance: none;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        .color-field input[type="color"] {
          inline-size: 3rem;
          block-size: 3rem;
        }
        .color-field input[type="color"]::-webkit-color-swatch-wrapper,
        .hex-row input[type="color"]::-webkit-color-swatch-wrapper,
        .picker-card input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        .color-field input[type="color"]::-webkit-color-swatch,
        .hex-row input[type="color"]::-webkit-color-swatch,
        .picker-card input[type="color"]::-webkit-color-swatch {
          border: 1px solid var(--border);
          border-radius: 0.7rem;
        }
        .color-field input[type="color"]::-moz-color-swatch,
        .hex-row input[type="color"]::-moz-color-swatch,
        .picker-card input[type="color"]::-moz-color-swatch {
          border: 1px solid var(--border);
          border-radius: 0.7rem;
        }

        .hex-row { display: flex; align-items: center; gap: 1rem; }
        .hex-row input[type="color"] {
          inline-size: 3.5rem;
          block-size: 3.5rem;
        }
        .hex-row code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: var(--muted);
          border-radius: 0.5rem;
          padding: 0.5rem 0.8rem;
        }

        .picker-card {
          display: grid;
          gap: 0.9rem;
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          background: var(--card);
          padding: 1.1rem;
        }
        .picker-card .picker-preview {
          block-size: 4.5rem;
          border-radius: 0.9rem;
          border: 1px solid var(--border);
          transition: background-color 0.2s ease;
        }
        .picker-card .picker-checker {
          background-image:
            linear-gradient(45deg, color-mix(in srgb, var(--border) 60%, transparent) 25%, transparent 25%),
            linear-gradient(-45deg, color-mix(in srgb, var(--border) 60%, transparent) 25%, transparent 25%);
          background-size: 16px 16px;
        }
        .picker-card label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .picker-card input[type="color"] {
          inline-size: 100%;
          block-size: 3rem;
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
