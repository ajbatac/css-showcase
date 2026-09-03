import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/switches")({
  head: () => ({
    meta: [
      { title: "Switches — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Animated toggle switch patterns — settings rows, compact grids, card toggles, iOS-style lists, and chip toggles — reshaped for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Switches — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One switch component reshaped for mobile, iPad, and desktop with CSS transforms, transitions, and container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SwitchesDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "settings-rows"
  | "compact-grid"
  | "card-toggles"
  | "list"
  | "inline-chips";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "settings-rows", label: "Settings rows", desc: "Label + description, switch on the right" },
    { id: "compact-grid", label: "Compact grid", desc: "Two-column switch grid" },
    { id: "card-toggles", label: "Card toggles", desc: "Selectable cards with a switch" },
  ],
  ipad: [
    { id: "settings-rows", label: "Settings rows", desc: "Label + description, switch on the right" },
    { id: "compact-grid", label: "Compact grid", desc: "Two-column switch grid" },
  ],
  mobile: [
    { id: "list", label: "Grouped list", desc: "iOS-style grouped rows" },
    { id: "inline-chips", label: "Inline chips", desc: "Chip-style toggles" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "settings-rows": `/* Settings rows */
.switch-list[data-pattern="settings-rows"] {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
}

.switch-track {
  transition: background-color 0.2s ease;
}

.switch-thumb {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-track[data-checked="true"] .switch-thumb {
  transform: translateX(1rem);
}`,
  "compact-grid": `/* Compact two-column switch grid */
.switch-list[data-pattern="compact-grid"] {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.switch-row {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
}`,
  "card-toggles": `/* Selectable card toggles */
.switch-list[data-pattern="card-toggles"] {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.switch-card {
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.switch-card[data-checked="true"] {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.06);
}`,
  list: `/* iOS-style grouped list */
.switch-list[data-pattern="list"] {
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  overflow: clip;
}

.switch-list[data-pattern="list"] .switch-row {
  border-bottom: 1px solid hsl(var(--border));
  border-radius: 0;
}

.switch-list[data-pattern="list"] .switch-row:last-child {
  border-bottom: 0;
}`,
  "inline-chips": `/* Chip-style toggles */
.chip-toggle-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip-toggle {
  border-radius: 999px;
  border: 1px solid hsl(var(--border));
  padding: 0.4rem 0.75rem;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.chip-toggle[data-checked="true"] {
  background: hsl(var(--primary));
  border-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}`,
};

const SWITCHES = [
  { id: "wifi", label: "Wi-Fi", desc: "Connect to available networks" },
  { id: "bluetooth", label: "Bluetooth", desc: "Discoverable by nearby devices" },
  { id: "notifications", label: "Notifications", desc: "Allow alerts and badges" },
  { id: "location", label: "Location services", desc: "Share position with apps" },
  { id: "sync", label: "Background sync", desc: "Pending — awaiting server" },
  { id: "legacy", label: "Legacy mode", desc: "Disabled on this account" },
];

function Switch({
  checked,
  onChange,
  disabled,
  pending,
  id,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  pending?: boolean;
  id: string;
  label: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={pending}
      disabled={disabled || pending}
      onClick={onChange}
      data-checked={checked}
      className={`switch-track relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors ${
        checked ? "border-primary bg-primary" : "border-border bg-muted"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      {pending ? (
        <Loader2 className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-spin text-primary-foreground" />
      ) : (
        <span
          className={`switch-thumb h-3.5 w-3.5 rounded-full bg-background shadow ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      )}
    </button>
  );
}

function SwitchesDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "settings-rows",
      ipad: "settings-rows",
      mobile: "list",
    }),
  );
  const [values, setValues] = useState<Record<string, boolean>>({
    wifi: true,
    bluetooth: false,
    notifications: true,
    location: false,
    sync: true,
    legacy: false,
  });

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const toggle = (id: string) => {
    if (id === "sync" || id === "legacy") return;
    setValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isChip = pattern === "inline-chips";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Switches that adapt.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A single toggle switch component reshaped into settings rows, a
            compact grid, selectable cards, a grouped list, and chip toggles —
            with disabled and pending states animated via{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">transform</code>.
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
                className={
                  isChip
                    ? "chip-toggle-list h-full w-full overflow-auto p-3"
                    : "switch-list h-full w-full overflow-auto p-2"
                }
              >
                {SWITCHES.map((s) => {
                  const checked = !!values[s.id];
                  const disabled = s.id === "legacy";
                  const pending = s.id === "sync";
                  if (isChip) {
                    return (
                      <button
                        key={s.id}
                        type="button"
                        data-checked={checked}
                        disabled={disabled}
                        aria-pressed={checked}
                        onClick={() => toggle(s.id)}
                        className="chip-toggle text-[10px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {s.label}
                      </button>
                    );
                  }
                  if (pattern === "card-toggles") {
                    return (
                      <div
                        key={s.id}
                        data-checked={checked}
                        className="switch-card flex items-center justify-between gap-3 p-3"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold">
                            {s.label}
                          </span>
                          <span className="block truncate text-[9px] text-muted-foreground">
                            {s.desc}
                          </span>
                        </span>
                        <Switch
                          id={`sw-${s.id}`}
                          label={s.label}
                          checked={checked}
                          disabled={disabled}
                          pending={pending}
                          onChange={() => toggle(s.id)}
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={s.id} className="switch-row">
                      <span className="min-w-0">
                        <label htmlFor={`sw-${s.id}`} className="block truncate text-[11px] font-semibold">
                          {s.label}
                        </label>
                        <span className="block truncate text-[9px] text-muted-foreground">
                          {s.desc}
                        </span>
                      </span>
                      <Switch
                        id={`sw-${s.id}`}
                        label={s.label}
                        checked={checked}
                        disabled={disabled}
                        pending={pending}
                        onChange={() => toggle(s.id)}
                      />
                    </div>
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
                      active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">{o.label}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">{o.desc}</span>
                    </span>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${active ? "bg-primary" : "bg-border"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">switches-{pattern}.css</span>
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
              <li>• Container queries</li>
              <li>• transform-based thumb animation</li>
              <li>• Disabled &amp; pending states</li>
              <li>• role="switch" + aria-checked</li>
              <li>• CSS Grid auto-placement</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .switch-list {
          container-type: inline-size;
          display: grid;
          gap: 0.5rem;
          align-content: start;
        }

        .switch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
        }

        .switch-track {
          position: relative;
        }

        .switch-thumb {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .switch-list[data-pattern="compact-grid"] {
          grid-template-columns: repeat(2, 1fr);
        }

        .switch-list[data-pattern="compact-grid"] .switch-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .switch-card {
          display: flex;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .switch-card[data-checked="true"] {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.06);
        }

        .switch-list[data-pattern="list"] {
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          overflow: clip;
          gap: 0;
        }

        .switch-list[data-pattern="list"] .switch-row {
          border: 0;
          border-bottom: 1px solid hsl(var(--border));
          border-radius: 0;
          background: hsl(var(--card));
        }

        .switch-list[data-pattern="list"] .switch-row:last-child {
          border-bottom: 0;
        }

        .chip-toggle-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .chip-toggle {
          border-radius: 999px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          padding: 0.4rem 0.75rem;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .chip-toggle[data-checked="true"] {
          background: hsl(var(--primary));
          border-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }

        @container (min-width: 420px) {
          .switch-list[data-pattern="settings-rows"] {
            grid-template-columns: repeat(2, 1fr);
          }
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
