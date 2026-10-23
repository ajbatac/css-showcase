import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/outputs")({
  head: () => ({
    meta: [
      { title: "Output & Live Results — CSS Showcase" },
      {
        name: "description",
        content:
          "The output element ties a result to its inputs — live invoice totals, unit conversion, and a tip calculator with tabular digits and a pulse on change.",
      },
      { property: "og:title", content: "Output & Live Results — CSS Showcase" },
      {
        property: "og:description",
        content: "Live totals, conversions, and a tip calculator on the output element.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OutputsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "invoice" | "converter" | "readout" | "tip";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "invoice", label: "Live invoice", desc: "Quantity × price → output total" },
    { id: "converter", label: "Unit converter", desc: "Slider input, converted output" },
    { id: "readout", label: "Slider readout", desc: "The simplest for= pairing" },
  ],
  ipad: [
    { id: "invoice", label: "Live invoice", desc: "Quantity × price → output total" },
    { id: "converter", label: "Unit converter", desc: "Slider input, converted output" },
  ],
  mobile: [{ id: "tip", label: "Tip calculator", desc: "Bill, tip %, and the total" }],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  invoice: `/* Live invoice */
.invoice { display: grid; gap: 0.9rem; max-inline-size: 21rem; inline-size: 100%; }

.invoice .line {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.4rem 0.9rem;
}

.invoice .line label { font-size: 0.75rem; font-weight: 600; color: var(--muted-foreground); }

.invoice .line input {
  block-size: 2.5rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: var(--card);
  padding: 0 0.7rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  inline-size: 6.5rem;
  justify-self: end;
  text-align: end;
}

/* The result is a first-class element, not a div */
.invoice output {
  grid-column: 1 / -1;
  text-align: end;
  font-size: 1.7rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  animation: result-pop 0.25s ease;
}

@keyframes result-pop {
  from { scale: 1.06; opacity: 0.4; }
  to { scale: 1; opacity: 1; }
}`,
  converter: `/* Unit converter */
.converter { display: grid; gap: 0.8rem; max-inline-size: 21rem; inline-size: 100%; }

.converter .conversion {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: 0.6rem;
}

.converter input[type="range"] { inline-size: 100%; accent-color: var(--primary); }

.converter .km {
  font-size: 1.15rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.converter output {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}

.converter .unit {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
}

/* Re-pulse the result whenever its key changes */
.converter output { animation: result-pop 0.25s ease; }

@keyframes result-pop {
  from { scale: 1.08; opacity: 0.4; }
  to { scale: 1; opacity: 1; }
}`,
  readout: `/* Slider + readout */
.readout { display: grid; gap: 0.6rem; max-inline-size: 20rem; inline-size: 100%; }

.readout .readout-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.readout .readout-head label { font-size: 0.78rem; font-weight: 600; }

/* for="volume" — the output names what it reflects */
.readout output {
  font-size: 1.25rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--primary);
}

.readout input[type="range"] { inline-size: 100%; accent-color: var(--primary); }`,
  tip: `/* Tip calculator */
.tip-card {
  display: grid;
  gap: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 1.1rem;
  background: var(--card);
  padding: 1rem;
}

.tip-card label { font-size: 0.72rem; font-weight: 600; color: var(--muted-foreground); }

.tip-card input {
  block-size: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  background: var(--background);
  padding: 0 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.tip-card .tip-scale {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
}

.tip-card .tip-scale button {
  block-size: 2.4rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: var(--card);
  font-size: 0.8rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  transition: background-color 0.12s ease, border-color 0.12s ease;
}

.tip-card .tip-scale button[aria-pressed="true"] {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

.tip-card .tip-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-block-start: 1px solid var(--border);
  padding-block-start: 0.7rem;
}

.tip-card .tip-total span { font-size: 0.78rem; font-weight: 600; }

.tip-card .tip-total output {
  font-size: 1.45rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  animation: result-pop 0.25s ease;
}

@keyframes result-pop {
  from { scale: 1.06; opacity: 0.4; }
  to { scale: 1; opacity: 1; }
}`,
};

function OutputsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "invoice",
      ipad: "invoice",
      mobile: "tip",
    }),
  );
  const [qty, setQty] = useState(3);
  const [price, setPrice] = useState(18);
  const [km, setKm] = useState(42);
  const [volume, setVolume] = useState(64);
  const [bill, setBill] = useState("48.20");
  const [tipPct, setTipPct] = useState(18);
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const billNum = Number(bill) || 0;
  const tipTotal = billNum * (1 + tipPct / 100);

  const renderDemo = () => {
    if (pattern === "invoice") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="invoice">
            <div className="line">
              <label htmlFor="inv-qty">Seats</label>
              <input
                id="inv-qty"
                type="number"
                min={1}
                max={99}
                value={qty}
                onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="line">
              <label htmlFor="inv-price">Price per seat ($)</label>
              <input
                id="inv-price"
                type="number"
                min={1}
                max={999}
                value={price}
                onChange={(e) => setPrice(Math.min(999, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
            {/* key retriggers the pop animation on every new total */}
            <output key={qty * price} htmlFor="inv-qty inv-price" aria-live="polite">
              ${(qty * price).toFixed(2)}
            </output>
          </div>
        </div>
      );
    }
    if (pattern === "converter") {
      const miles = km * 0.621371;
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="converter">
            <div className="conversion">
              <span className="km">{km}</span>
              <span className="text-xs text-muted-foreground">→</span>
              <output key={km} htmlFor="conv-range" aria-live="polite">
                {miles.toFixed(1)}
              </output>
            </div>
            <input
              id="conv-range"
              type="range"
              min={0}
              max={200}
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              aria-label="Kilometers"
            />
            <div className="flex justify-between">
              <span className="unit">Kilometers</span>
              <span className="unit">Miles</span>
            </div>
          </div>
        </div>
      );
    }
    if (pattern === "readout") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="readout">
            <div className="readout-head">
              <label htmlFor="vol-range">Volume</label>
              <output htmlFor="vol-range" aria-live="polite">
                {volume}%
              </output>
            </div>
            <input
              id="vol-range"
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
            <p className="text-[11px] text-muted-foreground">
              htmlFor="vol-range" documents the pairing — screen readers announce it.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
        <div className="tip-card">
          <label htmlFor="tip-bill">Bill ($)</label>
          <input
            id="tip-bill"
            type="number"
            min={0}
            step="0.01"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
          />
          <label htmlFor="tip-scale">Tip</label>
          <div className="tip-scale" id="tip-scale" role="group" aria-label="Tip percentage">
            {[10, 15, 18, 25].map((pct) => (
              <button
                key={pct}
                type="button"
                aria-pressed={tipPct === pct}
                onClick={() => setTipPct(pct)}
              >
                {pct}%
              </button>
            ))}
          </div>
          <div className="tip-total">
            <span>Total</span>
            <output key={tipTotal.toFixed(2)} htmlFor="tip-bill tip-scale" aria-live="polite">
              ${tipTotal.toFixed(2)}
            </output>
          </div>
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
            Math, but make it markup.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            The output element ties a result to its inputs with <code>for=</code> — live invoice
            totals, unit conversion, and a tip calculator. JavaScript computes; output displays.
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
                output-{pattern}.css
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
              <li>• output for="…"</li>
              <li>• font-variant-numeric: tabular-nums</li>
              <li>• keyframe pop on change</li>
              <li>• aria-live results</li>
              <li>• accent-color sliders</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .invoice { display: grid; gap: 0.9rem; max-inline-size: 21rem; inline-size: 100%; }
        .invoice .line {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 0.4rem 0.9rem;
        }
        .invoice .line label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .invoice .line input {
          block-size: 2.5rem;
          border: 1px solid var(--border);
          border-radius: 0.6rem;
          background: var(--card);
          padding: 0 0.7rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          inline-size: 6.5rem;
          justify-self: end;
          text-align: end;
        }
        .invoice output,
        .converter output,
        .tip-card .tip-total output {
          animation: result-pop 0.25s ease;
        }
        .invoice output {
          grid-column: 1 / -1;
          text-align: end;
          font-size: 1.7rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }
        @keyframes result-pop {
          from { scale: 1.06; opacity: 0.4; }
          to { scale: 1; opacity: 1; }
        }

        .converter { display: grid; gap: 0.8rem; max-inline-size: 21rem; inline-size: 100%; }
        .converter .conversion {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: baseline;
          gap: 0.6rem;
          text-align: center;
        }
        .converter input[type="range"] { inline-size: 100%; accent-color: var(--primary); }
        .converter .km { font-size: 1.15rem; font-weight: 700; font-variant-numeric: tabular-nums; }
        .converter output {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary);
          font-variant-numeric: tabular-nums;
        }
        .converter .unit {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted-foreground);
        }

        .readout { display: grid; gap: 0.6rem; max-inline-size: 20rem; inline-size: 100%; }
        .readout .readout-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .readout .readout-head label { font-size: 0.78rem; font-weight: 600; }
        .readout output {
          font-size: 1.25rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          color: var(--primary);
        }
        .readout input[type="range"] { inline-size: 100%; accent-color: var(--primary); }

        .tip-card {
          display: grid;
          gap: 0.9rem;
          border: 1px solid var(--border);
          border-radius: 1.1rem;
          background: var(--card);
          padding: 1rem;
        }
        .tip-card label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .tip-card input {
          block-size: 2.75rem;
          border: 1px solid var(--border);
          border-radius: 0.7rem;
          background: var(--background);
          padding: 0 0.8rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .tip-card .tip-scale {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.4rem;
        }
        .tip-card .tip-scale button {
          block-size: 2.4rem;
          border: 1px solid var(--border);
          border-radius: 0.6rem;
          background: var(--card);
          font-size: 0.8rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          transition: background-color 0.12s ease, border-color 0.12s ease;
        }
        .tip-card .tip-scale button:hover { background: var(--accent); }
        .tip-card .tip-scale button[aria-pressed="true"] {
          border-color: var(--primary);
          background: color-mix(in srgb, var(--primary) 10%, transparent);
        }
        .tip-card .tip-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-block-start: 1px solid var(--border);
          padding-block-start: 0.7rem;
        }
        .tip-card .tip-total span { font-size: 0.78rem; font-weight: 600; }
        .tip-card .tip-total output {
          font-size: 1.45rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
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
