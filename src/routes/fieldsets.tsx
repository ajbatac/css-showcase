import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/fieldsets")({
  head: () => ({
    meta: [
      { title: "Fieldsets & Legends — CSS Showcase" },
      {
        name: "description",
        content:
          "Fieldset and legend do what divs can't: named form groups with a floating border title, radio group semantics, and one-attribute disabling.",
      },
      { property: "og:title", content: "Fieldsets & Legends — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Named form groups, floating legends, and one-attribute disabling — the semantic way.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FieldsetsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "classic" | "radio-set" | "disabled-set" | "stacked";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "classic", label: "Classic fieldset", desc: "Legend floating on the border" },
    {
      id: "radio-set",
      label: "Radio group fieldset",
      desc: "Legend names the group for screen readers",
    },
    {
      id: "disabled-set",
      label: "Disabled group",
      desc: "One attribute disables every control inside",
    },
  ],
  ipad: [
    { id: "classic", label: "Classic fieldset", desc: "Legend floating on the border" },
    {
      id: "radio-set",
      label: "Radio group fieldset",
      desc: "Legend names the group for screen readers",
    },
  ],
  mobile: [{ id: "stacked", label: "Stacked sections", desc: "Fieldsets as mobile form sections" }],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  classic: `/* Classic fieldset with a floating legend */
.fieldset {
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem 1.1rem 1.2rem;
  display: grid;
  gap: 0.8rem;
  background: var(--card);
}

/* The legend slots into the border by default — just style it */
.fieldset legend {
  padding-inline: 0.45rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--foreground);
}

.fieldset .field {
  display: grid;
  gap: 0.3rem;
}

.fieldset .field label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted-foreground);
}

.fieldset input {
  block-size: 2.5rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: var(--background);
  padding: 0 0.75rem;
  font-size: 0.85rem;
}

.fieldset input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
}`,
  "radio-set": `/* Fieldset as an accessible radio group */
.choice-set {
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 0.9rem 1.1rem 1.1rem;
  display: grid;
  gap: 0.55rem;
  background: var(--card);
}

/* The legend IS the group's accessible name — no aria-label needed */
.choice-set legend {
  padding-inline: 0.45rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.choice-set .choice {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-block-size: 2.4rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  padding: 0 0.7rem;
  font-size: 0.82rem;
  transition: border-color 0.12s ease, background-color 0.12s ease;
  cursor: pointer;
}

.choice-set .choice:has(input:checked) {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 8%, transparent);
}

.choice-set input[type="radio"] {
  accent-color: var(--primary);
  inline-size: 1rem;
  block-size: 1rem;
}`,
  "disabled-set": `/* One attribute disables the whole group */
.fieldset:disabled {
  opacity: 0.55;
}

/* Fieldset:disabled makes every descendant control disabled too —
   style off that, not per-control attributes */
.fieldset:disabled input,
.fieldset:disabled button {
  cursor: not-allowed;
  background: var(--muted);
}

.fieldset:disabled .unlock-hint {
  display: flex;
}

.unlock-hint {
  display: none;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--muted-foreground);
}

.unlock-hint kbd {
  font-family: inherit;
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  padding: 0.1rem 0.4rem;
  font-size: 0.68rem;
  background: var(--card);
}`,
  stacked: `/* Stacked sections on mobile */
.section-stack {
  display: grid;
  gap: 1rem;
}

.section-stack .fieldset {
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 0.9rem 1rem 1.1rem;
  display: grid;
  gap: 0.7rem;
  background: var(--card);
}

.section-stack legend {
  padding-inline: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.section-stack .summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.section-stack .summary-row span:last-child {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}`,
};

function FieldsetsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "classic",
      ipad: "classic",
      mobile: "stacked",
    }),
  );
  const [plan, setPlan] = useState("pro");
  const [locked, setLocked] = useState(true);
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const renderDemo = () => {
    if (pattern === "classic") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <form className="fieldset" style={{ inlineSize: "min(20rem, 100%)" }}>
            <legend>Shipping details</legend>
            <div className="field">
              <label htmlFor="fs-name">Full name</label>
              <input id="fs-name" defaultValue="Ada Lovelace" />
            </div>
            <div className="field">
              <label htmlFor="fs-address">Street address</label>
              <input id="fs-address" defaultValue="12 Analytical Way" />
            </div>
            <div className="field">
              <label htmlFor="fs-city">City</label>
              <input id="fs-city" defaultValue="London" />
            </div>
          </form>
        </div>
      );
    }
    if (pattern === "radio-set") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <fieldset className="choice-set" style={{ inlineSize: "min(20rem, 100%)" }}>
            <legend>Plan</legend>
            {[
              { id: "free", label: "Free — 1 project" },
              { id: "pro", label: "Pro — unlimited projects" },
              { id: "team", label: "Team — everything, plus seats" },
            ].map((option) => (
              <label key={option.id} className="choice">
                <input
                  type="radio"
                  name="fs-plan"
                  value={option.id}
                  checked={plan === option.id}
                  onChange={() => setPlan(option.id)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        </div>
      );
    }
    if (pattern === "disabled-set") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto p-4">
          <fieldset
            className="fieldset"
            style={{ inlineSize: "min(20rem, 100%)" }}
            disabled={locked}
          >
            <legend>Billing address</legend>
            <div className="field">
              <label htmlFor="fs-card">Card number</label>
              <input id="fs-card" defaultValue="4242 4242 4242 4242" />
            </div>
            <div className="field">
              <label htmlFor="fs-zip">Postal code</label>
              <input id="fs-zip" defaultValue="EC1A 1BB" />
            </div>
            <p className="unlock-hint">
              Press <kbd>Edit</kbd> below to unlock the group.
            </p>
          </fieldset>
          <button type="button" className="fs-edit-btn" onClick={() => setLocked((v) => !v)}>
            {locked ? "Edit" : "Lock"}
          </button>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full justify-center overflow-auto p-4">
        <div className="section-stack" style={{ inlineSize: "min(19rem, 100%)" }}>
          <fieldset className="fieldset">
            <legend>Order</legend>
            <div className="summary-row">
              <span>Pro plan</span>
              <span>$18.00</span>
            </div>
            <div className="summary-row">
              <span>2 seats</span>
              <span>$36.00</span>
            </div>
            <div className="summary-row">
              <span>Total</span>
              <span>$54.00</span>
            </div>
          </fieldset>
          <fieldset className="fieldset" disabled>
            <legend>Payment</legend>
            <div className="field">
              <label htmlFor="fs-m-card">Card number</label>
              <input id="fs-m-card" placeholder="4242 4242 4242 4242" />
            </div>
          </fieldset>
        </div>
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
            Group it, name it, disable it.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Fieldset and legend do what divs can't: named form groups with a floating border title,
            a real accessible name for radio groups, and one-attribute disabling.
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
                fieldset-{pattern}.css
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
              <li>• fieldset + legend</li>
              <li>• fieldset:disabled</li>
              <li>• :has(input:checked)</li>
              <li>• accent-color on radios</li>
              <li>• color-mix() tints</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .fieldset {
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1rem 1.1rem 1.2rem;
          display: grid;
          gap: 0.8rem;
          background: var(--card);
        }
        .fieldset legend,
        .choice-set legend,
        .section-stack legend {
          padding-inline: 0.45rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--foreground);
        }
        .fieldset .field { display: grid; gap: 0.3rem; }
        .fieldset .field label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .fieldset input {
          block-size: 2.5rem;
          border: 1px solid var(--border);
          border-radius: 0.6rem;
          background: var(--background);
          padding: 0 0.75rem;
          font-size: 0.85rem;
        }
        .fieldset input:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
        }

        .choice-set {
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 0.9rem 1.1rem 1.1rem;
          display: grid;
          gap: 0.55rem;
          background: var(--card);
        }
        .choice-set legend { font-size: 0.8rem; }
        .choice-set .choice {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-block-size: 2.4rem;
          border: 1px solid var(--border);
          border-radius: 0.7rem;
          padding: 0 0.7rem;
          font-size: 0.82rem;
          transition: border-color 0.12s ease, background-color 0.12s ease;
          cursor: pointer;
        }
        .choice-set .choice:has(input:checked) {
          border-color: var(--primary);
          background: color-mix(in srgb, var(--primary) 8%, transparent);
        }
        .choice-set input[type="radio"] {
          accent-color: var(--primary);
          inline-size: 1rem;
          block-size: 1rem;
        }

        .fieldset:disabled { opacity: 0.55; }
        .fieldset:disabled input,
        .fieldset:disabled button {
          cursor: not-allowed;
          background: var(--muted);
        }
        .unlock-hint { display: none; }
        .fieldset:disabled .unlock-hint {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: var(--muted-foreground);
        }
        .unlock-hint kbd {
          font-family: inherit;
          border: 1px solid var(--border);
          border-radius: 0.35rem;
          padding: 0.1rem 0.4rem;
          font-size: 0.68rem;
          background: var(--card);
        }
        .fs-edit-btn {
          min-block-size: 2.4rem;
          border: 1px solid var(--border);
          border-radius: 0.7rem;
          background: var(--card);
          padding: 0 1.1rem;
          font-size: 0.8rem;
          font-weight: 600;
          transition: background-color 0.15s ease;
        }
        .fs-edit-btn:hover { background: var(--accent); }

        .section-stack { display: grid; gap: 1rem; }
        .section-stack .fieldset { gap: 0.7rem; padding: 0.9rem 1rem 1.1rem; }
        .section-stack legend { font-size: 0.78rem; }
        .section-stack .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .section-stack .summary-row span:last-child {
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
