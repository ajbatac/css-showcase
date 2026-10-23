import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/numbers")({
  head: () => ({
    meta: [
      { title: "Number Inputs — CSS Showcase" },
      {
        name: "description",
        content:
          "Number inputs with plus/minus steppers, currency and unit affixes, native spin buttons, and cart-style quantity rows with big touch targets.",
      },
      { property: "og:title", content: "Number Inputs — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Quantity pickers, currency fields, and native spin buttons — one number input reshaped per device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NumbersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "stepper" | "affix" | "native-spin" | "touch-steppers" | "qty-row";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "stepper", label: "Stepper row", desc: "Plus/minus buttons around a centered value" },
    { id: "affix", label: "Currency & unit affixes", desc: "Prefix and suffix inside the field" },
    { id: "native-spin", label: "Native spin buttons", desc: "type=number with visible spinners" },
  ],
  ipad: [
    { id: "stepper", label: "Stepper row", desc: "Plus/minus buttons around a centered value" },
    { id: "affix", label: "Currency & unit affixes", desc: "Prefix and suffix inside the field" },
  ],
  mobile: [
    { id: "touch-steppers", label: "Big touch steppers", desc: "44px+ targets, full-width" },
    { id: "qty-row", label: "Cart quantity row", desc: "Product line with stepper and price" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  stepper: `/* Stepper row */
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  overflow: clip;
}

.stepper button {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  color: var(--foreground);
  transition: background-color 0.15s ease;
}

.stepper button:hover:not(:disabled) {
  background: var(--accent);
}

.stepper button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Hide the UA spin buttons — our buttons do the stepping */
.stepper input {
  inline-size: 3.5rem;
  block-size: 2.75rem;
  text-align: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  border-inline: 1px solid var(--border);
  appearance: textfield;
  -moz-appearance: textfield;
}

.stepper input::-webkit-outer-spin-button,
.stepper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stepper:focus-within {
  border-color: var(--ring);
  outline: 2px solid color-mix(in srgb, var(--ring) 35%, transparent);
}`,
  affix: `/* Currency & unit affixes */
.affix-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0 0.9rem;
  transition: border-color 0.15s ease;
}

.affix-field:focus-within {
  border-color: var(--ring);
  outline: 2px solid color-mix(in srgb, var(--ring) 35%, transparent);
}

.affix-field .affix {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted-foreground);
  user-select: none;
}

.affix-field input {
  block-size: 2.75rem;
  inline-size: 6rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  appearance: textfield;
  -moz-appearance: textfield;
}

.affix-field input::-webkit-outer-spin-button,
.affix-field input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}`,
  "native-spin": `/* Native spin buttons, restyled */
.native-spin {
  display: grid;
  gap: 0.4rem;
  max-inline-size: 16rem;
}

.native-spin label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted-foreground);
}

/* The UA spinner is a real control — tint it, don't rebuild it */
.native-spin input {
  block-size: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0 0.9rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  accent-color: var(--primary);
}

.native-spin input::-webkit-inner-spin-button {
  opacity: 1;
  cursor: pointer;
}

.native-spin input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
}`,
  "touch-steppers": `/* Big touch steppers */
.touch-stepper {
  display: grid;
  grid-template-columns: 4.5rem 1fr 4.5rem;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--card);
  overflow: clip;
}

.touch-stepper button {
  block-size: 3.75rem;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  transition: background-color 0.15s ease;
}

.touch-stepper button:hover { background: var(--accent); }
.touch-stepper button:active { background: color-mix(in srgb, var(--accent) 60%, transparent); }

.touch-stepper output {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}`,
  "qty-row": `/* Cart quantity row */
.qty-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--card);
  padding: 0.75rem;
}

.qty-row .qty-name {
  min-inline-size: 0;
  flex: 1;
}

.qty-row .qty-name strong {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
}

.qty-row .qty-name span {
  font-size: 0.7rem;
  color: var(--muted-foreground);
}

.qty-row .qty-mini {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  overflow: clip;
}

.qty-row .qty-mini button {
  inline-size: 2.25rem;
  block-size: 2.25rem;
  display: grid;
  place-items: center;
}

.qty-row .qty-mini output {
  min-inline-size: 2ch;
  text-align: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.qty-row .qty-price {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}`,
};

function NumbersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "stepper",
      ipad: "stepper",
      mobile: "touch-steppers",
    }),
  );
  const [count, setCount] = useState(2);
  const [weight, setWeight] = useState(12);
  const [spin, setSpin] = useState(5);
  const [bigCount, setBigCount] = useState(1);
  const [cartQty, setCartQty] = useState(3);
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const step = (value: number, delta: number, min: number, max: number) =>
    setCount(Math.min(max, Math.max(min, value + delta)));

  const renderDemo = () => {
    if (pattern === "stepper") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto p-4">
          <label htmlFor="stepper-input" className="text-xs font-semibold">
            Guests
          </label>
          <div className="stepper">
            <button
              type="button"
              aria-label="Remove one guest"
              disabled={count <= 1}
              onClick={() => step(count, -1, 1, 12)}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              id="stepper-input"
              type="number"
              min={1}
              max={12}
              value={count}
              onChange={(e) => setCount(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
            />
            <button
              type="button"
              aria-label="Add one guest"
              disabled={count >= 12}
              onClick={() => step(count, 1, 1, 12)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Min 1 · max 12 — buttons disable at the bounds.
          </p>
        </div>
      );
    }
    if (pattern === "affix") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto p-4">
          <label htmlFor="affix-input" className="text-xs font-semibold">
            Order weight
          </label>
          <div className="affix-field">
            <span className="affix" aria-hidden="true">
              kg
            </span>
            <input
              id="affix-input"
              type="number"
              min={0}
              max={99}
              step={0.5}
              value={weight}
              onChange={(e) => setWeight(Math.max(0, Number(e.target.value) || 0))}
            />
            <span className="affix" aria-hidden="true">
              ± 0.5
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Affixes are siblings of the input, not pseudo-elements.
          </p>
        </div>
      );
    }
    if (pattern === "native-spin") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-auto p-4">
          <div className="native-spin">
            <label htmlFor="native-spin-input">Tickets</label>
            <input
              id="native-spin-input"
              type="number"
              min={0}
              max={20}
              value={spin}
              onChange={(e) => setSpin(Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            The UA spinner is a real control — tint it with accent-color instead of rebuilding it.
          </p>
        </div>
      );
    }
    if (pattern === "touch-steppers") {
      return (
        <div className="flex h-full w-full flex-col justify-center gap-3 overflow-auto p-4">
          <p className="text-xs font-semibold">Servings</p>
          <div className="touch-stepper">
            <button
              type="button"
              aria-label="Fewer servings"
              disabled={bigCount <= 1}
              onClick={() => setBigCount((v) => Math.max(1, v - 1))}
            >
              <Minus />
            </button>
            <output aria-live="polite">{bigCount}</output>
            <button
              type="button"
              aria-label="More servings"
              onClick={() => setBigCount((v) => Math.min(12, v + 1))}
            >
              <Plus />
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            3.75rem-tall buttons — comfortably above the 44px floor.
          </p>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 overflow-auto p-4">
        <div className="qty-row">
          <span className="qty-name">
            <strong>Studio membership</strong>
            <span>$18.00 / month</span>
          </span>
          <span className="qty-mini">
            <button
              type="button"
              aria-label="Remove one seat"
              disabled={cartQty <= 1}
              onClick={() => setCartQty((v) => Math.max(1, v - 1))}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <output aria-live="polite">{cartQty}</output>
            <button
              type="button"
              aria-label="Add one seat"
              onClick={() => setCartQty((v) => Math.min(9, v + 1))}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </span>
          <span className="qty-price">${(cartQty * 18).toFixed(2)}</span>
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShoppingBag className="h-3.5 w-3.5" /> One cart line — the same stepper pattern,
          condensed.
        </p>
      </div>
    );
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-16 md:pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Count anything, step by step.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Quantity pickers, currency and unit affixes, native spin buttons, and cart-style rows —
            number inputs that keep 44px touch targets and tabular digits.
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
                number-{pattern}.css
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
              <li>• appearance: textfield</li>
              <li>• ::-webkit-inner-spin-button</li>
              <li>• :focus-within rings</li>
              <li>• font-variant-numeric: tabular-nums</li>
              <li>• color-mix() active states</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--card);
          overflow: clip;
        }
        .stepper button {
          display: grid;
          place-items: center;
          inline-size: 2.75rem;
          block-size: 2.75rem;
          color: var(--foreground);
          transition: background-color 0.15s ease;
        }
        .stepper button:hover:not(:disabled) { background: var(--accent); }
        .stepper button:disabled { opacity: 0.4; cursor: not-allowed; }
        .stepper input {
          inline-size: 3.5rem;
          block-size: 2.75rem;
          text-align: center;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          border-inline: 1px solid var(--border);
          appearance: textfield;
          -moz-appearance: textfield;
        }
        .stepper input::-webkit-outer-spin-button,
        .stepper input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .stepper:focus-within {
          border-color: var(--ring);
          outline: 2px solid color-mix(in srgb, var(--ring) 35%, transparent);
        }

        .affix-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--card);
          padding: 0 0.9rem;
          transition: border-color 0.15s ease;
        }
        .affix-field:focus-within {
          border-color: var(--ring);
          outline: 2px solid color-mix(in srgb, var(--ring) 35%, transparent);
        }
        .affix-field .affix {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted-foreground);
          user-select: none;
        }
        .affix-field input {
          block-size: 2.75rem;
          inline-size: 6rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          appearance: textfield;
          -moz-appearance: textfield;
        }
        .affix-field input::-webkit-outer-spin-button,
        .affix-field input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .native-spin { display: grid; gap: 0.4rem; max-inline-size: 16rem; }
        .native-spin label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .native-spin input {
          block-size: 2.75rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--card);
          padding: 0 0.9rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          accent-color: var(--primary);
        }
        .native-spin input::-webkit-inner-spin-button {
          opacity: 1;
          cursor: pointer;
        }
        .native-spin input:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
        }

        .touch-stepper {
          display: grid;
          grid-template-columns: 4.5rem 1fr 4.5rem;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 1rem;
          background: var(--card);
          overflow: clip;
        }
        .touch-stepper button {
          block-size: 3.75rem;
          display: grid;
          place-items: center;
          font-size: 1.25rem;
          transition: background-color 0.15s ease;
        }
        .touch-stepper button:hover { background: var(--accent); }
        .touch-stepper button:active {
          background: color-mix(in srgb, var(--accent) 60%, transparent);
        }
        .touch-stepper output {
          text-align: center;
          font-size: 1.4rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }

        .qty-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 1rem;
          background: var(--card);
          padding: 0.75rem;
        }
        .qty-row .qty-name { min-inline-size: 0; flex: 1; }
        .qty-row .qty-name strong { display: block; font-size: 0.8rem; font-weight: 600; }
        .qty-row .qty-name span { font-size: 0.7rem; color: var(--muted-foreground); }
        .qty-row .qty-mini {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 0.6rem;
          overflow: clip;
        }
        .qty-row .qty-mini button {
          inline-size: 2.25rem;
          block-size: 2.25rem;
          display: grid;
          place-items: center;
          transition: background-color 0.15s ease;
        }
        .qty-row .qty-mini button:hover:not(:disabled) { background: var(--accent); }
        .qty-row .qty-mini button:disabled { opacity: 0.4; }
        .qty-row .qty-mini output {
          min-inline-size: 2ch;
          text-align: center;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
        .qty-row .qty-price {
          font-weight: 700;
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
