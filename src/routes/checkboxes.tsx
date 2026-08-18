import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

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
type Pattern = "checklist" | "table" | "toggles" | "chips";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "checklist", label: "Multi-column checklist", desc: "Cards in a grid" },
    { id: "table", label: "Table rows", desc: "Bulk select in the header" },
    { id: "toggles", label: "Toggle settings list", desc: "All items as switches" },
  ],
  ipad: [
    { id: "checklist", label: "Two-column checklist", desc: "Cards in two columns" },
    { id: "toggles", label: "Toggle list", desc: "Switches in a single column" },
  ],
  mobile: [
    { id: "checklist", label: "Full-width rows", desc: "One card per row" },
    { id: "chips", label: "Chip multi-select", desc: "Tap chips to select" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  checklist: `/* Checklist grid */
.selection-list[data-pattern="checklist"] {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr;
}

@container (min-width: 420px) {
  .selection-list[data-pattern="checklist"] {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 680px) {
  .selection-list[data-pattern="checklist"] {
    grid-template-columns: repeat(4, 1fr);
  }
}`,
  table: `/* Table rows with bulk header select */
.selection-table {
  width: 100%;
  border-collapse: collapse;
}

.selection-table th,
.selection-table td {
  border-bottom: 1px solid hsl(var(--border));
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.selection-table thead th {
  background: hsl(var(--muted) / 0.5);
}`,
  toggles: `/* Toggle switch settings list */
.selection-list[data-pattern="toggles"] {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.toggle-track {
  transition: background-color 0.2s ease;
}

.toggle-thumb {
  transition: transform 0.2s ease;
}

@container (min-width: 420px) {
  .selection-list[data-pattern="toggles"] {
    grid-template-columns: repeat(2, 1fr);
  }
}`,
  chips: `/* Chip-style multi-select */
.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 999px;
  padding: 0.4rem 0.75rem;
  border: 1px solid hsl(var(--border));
}

.chip[data-selected="true"] {
  background: hsl(var(--primary));
  border-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}`,
};

const FLAVORS = [
  { id: "vanilla", label: "Vanilla", description: "Classic and creamy" },
  { id: "chocolate", label: "Chocolate", description: "Rich cocoa base" },
  { id: "strawberry", label: "Strawberry", description: "Fresh berry notes" },
  { id: "mint", label: "Mint chip", description: "Cool with dark chips" },
];

function CheckboxesDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS
      ? (initial.device as Device)
      : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
    desktop: "checklist",
    ipad: "checklist",
    mobile: "checklist",
    }),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set(["vanilla"]));
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    vanilla: true,
    chocolate: false,
    strawberry: true,
    mint: false,
  });

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const toggleFlavor = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSwitch = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
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
            select, table rows, toggle switches, and chips — pick a device,
            then pick a design pattern for that device.
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
              <SelectionApp
                pattern={pattern}
                selected={selected}
                toggles={toggles}
                allSelected={allSelected}
                someSelected={someSelected}
                onToggleFlavor={toggleFlavor}
                onToggleSwitch={toggleSwitch}
                onSelectAll={() => {
                  if (allSelected) setSelected(new Set());
                  else setSelected(new Set(FLAVORS.map((f) => f.id)));
                }}
              />
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
                    onClick={() =>
                      setPatterns((prev) => ({ ...prev, [device]: o.id }))
                    }
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">
                        {o.label}
                      </span>
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
                checkboxes-{pattern}.css
              </span>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(CSS_BY_PATTERN[pattern])
                }
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

        .selection-list[data-pattern="checklist"] {
          grid-template-columns: 1fr;
        }

        .selection-list[data-pattern="toggles"] {
          grid-template-columns: 1fr;
        }

        @container (min-width: 420px) {
          .selection-list[data-pattern="checklist"] {
            grid-template-columns: repeat(2, 1fr);
          }
          .selection-list[data-pattern="checklist"] .selection-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .selection-list[data-pattern="toggles"] {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @container (min-width: 680px) {
          .selection-list[data-pattern="checklist"] {
            grid-template-columns: repeat(4, 1fr);
            align-content: center;
          }
          .selection-list[data-pattern="checklist"] .selection-row {
            align-items: center;
            text-align: center;
          }
          .selection-list[data-pattern="checklist"] .selection-row .checkbox-box {
            margin-inline: auto;
          }
        }

        .selection-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }

        .selection-table th,
        .selection-table td {
          border-bottom: 1px solid hsl(var(--border));
          padding: 0.5rem 0.5rem;
          text-align: left;
        }

        .selection-table thead th {
          background: hsl(var(--muted) / 0.5);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--muted-foreground));
        }

        .chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          border-radius: 999px;
          padding: 0.4rem 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .chip[data-selected="true"] {
          background: hsl(var(--primary));
          border-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
      `}</style>
    </main>
  );
}

function SelectionApp({
  pattern,
  selected,
  toggles,
  allSelected,
  someSelected,
  onToggleFlavor,
  onToggleSwitch,
  onSelectAll,
}: {
  pattern: Pattern;
  selected: Set<string>;
  toggles: Record<string, boolean>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleFlavor: (id: string) => void;
  onToggleSwitch: (id: string) => void;
  onSelectAll: () => void;
}) {
  if (pattern === "table") {
    return (
      <div className="h-full w-full overflow-auto p-3">
        <table className="selection-table">
          <thead>
            <tr>
              <th className="w-8">
                <button
                  type="button"
                  onClick={onSelectAll}
                  aria-pressed={allSelected}
                  className="checkbox-root"
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
              </th>
              <th>Flavor</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {FLAVORS.map((flavor) => {
              const isSelected = selected.has(flavor.id);
              return (
                <tr key={flavor.id} className="cursor-pointer hover:bg-accent/40" onClick={() => onToggleFlavor(flavor.id)}>
                  <td>
                    <span
                      className={`checkbox-box flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                  </td>
                  <td className="font-semibold">{flavor.label}</td>
                  <td className="text-muted-foreground">{flavor.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (pattern === "toggles") {
    return (
      <div data-pattern="toggles" className="selection-list h-full w-full overflow-auto p-3">
        {FLAVORS.map((flavor) => {
          const isOn = !!toggles[flavor.id];
          return (
            <label
              key={flavor.id}
              className="selection-row toggle-row cursor-pointer transition-colors hover:bg-accent/50"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold">{flavor.label}</span>
                <span className="truncate text-[10px] text-muted-foreground">
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
                onChange={() => onToggleSwitch(flavor.id)}
              />
            </label>
          );
        })}
      </div>
    );
  }

  if (pattern === "chips") {
    return (
      <div className="chip-list h-full w-full content-start overflow-auto p-3">
        {FLAVORS.map((flavor) => {
          const isSelected = selected.has(flavor.id);
          return (
            <button
              key={flavor.id}
              type="button"
              data-selected={isSelected}
              onClick={() => onToggleFlavor(flavor.id)}
              className="chip text-[10px] font-semibold"
            >
              {isSelected && <Check className="h-3 w-3 shrink-0" />}
              <span className="truncate">{flavor.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // checklist
  return (
    <div data-pattern="checklist" className="selection-list h-full w-full overflow-auto p-3">
      <div className="selection-row col-span-full flex items-center justify-between">
        <span className="text-xs font-semibold">Select all flavors</span>
        <button
          type="button"
          onClick={onSelectAll}
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
              onChange={() => onToggleFlavor(flavor.id)}
            />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold">{flavor.label}</span>
              <span className="truncate text-[10px] text-muted-foreground">
                {flavor.description}
              </span>
            </span>
          </label>
        );
      })}
    </div>
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
