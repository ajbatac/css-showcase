import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CheckSquare, Minus, ToggleLeft } from "lucide-react";

export const Route = createFileRoute("/checkboxes")({
  head: () => ({
    meta: [
      { title: "Checkboxes & Multi-Select — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Checkbox, multi-select, toggle, and indeterminate states morphed for mobile, iPad, and desktop using container queries.",
      },
      { property: "og:title", content: "Checkboxes & Multi-Select — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One selection component reshaped for mobile, iPad, and desktop with CSS grid, transitions, and container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckboxesDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.selection-list {
  container-type: inline-size;
  display: grid;
  gap: 0.5rem;
}

.selection-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid hsl(var(--border));
}

/* iPad+: two-column cards */
@container (min-width: 420px) {
  .selection-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: horizontal toolbar */
@container (min-width: 680px) {
  .selection-list {
    grid-template-columns: repeat(4, 1fr);
    align-content: center;
  }
}`;

const FLAVORS = [
  { id: "vanilla", label: "Vanilla", description: "Classic and creamy" },
  { id: "chocolate", label: "Chocolate", description: "Rich cocoa base" },
  { id: "strawberry", label: "Strawberry", description: "Fresh berry notes" },
  { id: "mint", label: "Mint chip", description: "Cool with dark chips" },
];

const OPTIONS = [
  { id: "notifications", label: "Notifications", checked: true },
  { id: "newsletter", label: "Newsletter", checked: false },
];

function CheckboxesDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [selected, setSelected] = useState<Set<string>>(new Set(["vanilla"]));
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    newsletter: false,
  });
  const [master, setMaster] = useState<boolean | "indeterminate">(false);

  const toggleFlavor = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleOption = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMaster = () => {
    setMaster((prev) => (prev === true ? false : true));
  };

  const allSelected = selected.size === FLAVORS.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Checkboxes & multi-select.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A single selection component that shows classic checkboxes, bulk
            select, indeterminate state, and toggle switches — reshaped for
            mobile, iPad, and desktop with container queries.
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
            <DeviceFrame device={device}>
              <div className="selection-list h-full w-full p-3">
                <div className="selection-row col-span-full flex items-center justify-between">
                  <span className="text-xs font-semibold">Select all flavors</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (allSelected) setSelected(new Set());
                      else setSelected(new Set(FLAVORS.map((f) => f.id)));
                    }}
                    className="checkbox-root"
                    aria-pressed={allSelected}
                  >
                    <span
                      className={`checkbox-box flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        allSelected || someSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background"
                      }`}
                    >
                      {someSelected ? (
                        <Minus className="h-3 w-3" />
                      ) : allSelected ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </span>
                  </button>
                </div>

                {FLAVORS.map((flavor) => {
                  const isSelected = selected.has(flavor.id);
                  return (
                    <label
                      key={flavor.id}
                      className="selection-row cursor-pointer transition-colors hover:bg-accent/50"
                    >
                      <span
                        className={`checkbox-box flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleFlavor(flavor.id)}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-xs font-semibold">{flavor.label}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {flavor.description}
                        </span>
                      </span>
                    </label>
                  );
                })}

                {OPTIONS.map((option) => {
                  const isOn = toggles[option.id];
                  return (
                    <label
                      key={option.id}
                      className="selection-row toggle-row cursor-pointer transition-colors hover:bg-accent/50"
                    >
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-xs font-semibold">{option.label}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {isOn ? "Enabled" : "Disabled"}
                        </span>
                      </span>
                      <span
                        className={`toggle-track relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${
                          isOn ? "bg-primary" : "bg-input"
                        }`}
                      >
                        <span
                          className={`toggle-thumb inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${
                            isOn ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isOn}
                        onChange={() => toggleOption(option.id)}
                      />
                    </label>
                  );
                })}
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

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                checkboxes.css
              </span>
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
              <li>• CSS Grid auto-placement</li>
              <li>• Custom checkbox styling</li>
              <li>• Indeterminate state</li>
              <li>• Toggle switch animation</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .selection-list {
          container-type: inline-size;
          display: grid;
          gap: 0.5rem;
          align-content: start;
        }

        .selection-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
        }

        .checkbox-box {
          box-shadow: inset 0 0 0 1px hsl(var(--border));
        }

        .toggle-row {
          justify-content: space-between;
        }

        @container (min-width: 420px) {
          .selection-list {
            grid-template-columns: repeat(2, 1fr);
          }

          .selection-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .toggle-row {
            flex-direction: row;
            align-items: center;
          }
        }

        @container (min-width: 680px) {
          .selection-list {
            grid-template-columns: repeat(4, 1fr);
            align-content: center;
          }

          .selection-row {
            align-items: center;
            text-align: center;
          }

          .selection-row .checkbox-box,
          .selection-row .toggle-track {
            margin-inline: auto;
          }
        }
      `}</style>
    </main>
  );
}

function DeviceFrame({
  device,
  children,
}: {
  device: Device;
  children: React.ReactNode;
}) {
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
      <div className="h-full w-full overflow-hidden rounded-lg bg-card">
        {children}
      </div>
    </div>
  );
}
