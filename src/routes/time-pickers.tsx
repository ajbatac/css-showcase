import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/time-pickers")({
  head: () => ({
    meta: [
      { title: "Time Pickers — CSS Showcase" },
      {
        name: "description",
        content:
          "Native time inputs with a styled picker indicator, minute-step values, and a live duration readout computed from two times.",
      },
      { property: "og:title", content: "Time Pickers — CSS Showcase" },
      {
        property: "og:description",
        content: "Styled native time fields with a live duration readout between two times.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimePickersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "native" | "duration" | "step" | "sheet-row";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "native", label: "Native time field", desc: "input[type=time], restyled" },
    { id: "duration", label: "Start → end duration", desc: "Two times, one computed output" },
    { id: "step", label: "Minute-step picker", desc: "step attribute snaps to 15 min" },
  ],
  ipad: [
    { id: "native", label: "Native time field", desc: "input[type=time], restyled" },
    { id: "duration", label: "Start → end duration", desc: "Two times, one computed output" },
  ],
  mobile: [{ id: "sheet-row", label: "From / to row", desc: "Two large time fields side by side" }],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  native: `/* Native time field, restyled */
.time-field { display: grid; gap: 0.4rem; max-inline-size: 15rem; }

.time-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted-foreground);
}

.time-field input[type="time"] {
  block-size: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.time-field input[type="time"]:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
}

/* The clock icon is a real control — restyle it, don't hide it */
.time-field input[type="time"]::-webkit-calendar-picker-indicator {
  opacity: 0.55;
  cursor: pointer;
}

.dark .time-field input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}`,
  duration: `/* Two times, one computed output */
.duration {
  display: grid;
  gap: 0.8rem;
  max-inline-size: 22rem;
  inline-size: 100%;
}

.duration .times {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 0.6rem;
}

.duration label { display: grid; gap: 0.3rem; }

.duration label span {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted-foreground);
}

.duration input[type="time"] {
  block-size: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  background: var(--card);
  padding: 0 0.7rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  inline-size: 100%;
}

.duration output {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--primary);
}`,
  step: `/* Minute-step picker */
.step-field { display: grid; gap: 0.4rem; max-inline-size: 15rem; }

.step-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted-foreground);
}

/* step=900 snaps the native picker to 15-minute increments */
.step-field input[type="time"] {
  block-size: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  accent-color: var(--primary);
}

.step-field p {
  font-size: 0.72rem;
  color: var(--muted-foreground);
}`,
  "sheet-row": `/* From / to row */
.times-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.times-row label { display: grid; gap: 0.3rem; }

.times-row label span {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted-foreground);
}

.times-row input[type="time"] {
  block-size: 3.25rem;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  background: var(--card);
  padding: 0 0.7rem;
  font-size: 0.95rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  inline-size: 100%;
}

.times-row input[type="time"]:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
}`,
};

function minutesOf(value: string) {
  const [h, m] = value.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function TimePickersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "native",
      ipad: "native",
      mobile: "sheet-row",
    }),
  );
  const [time, setTime] = useState("09:30");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:30");
  const [from, setFrom] = useState("08:15");
  const [to, setTo] = useState("18:45");
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  // Wrap past midnight so 22:00 → 01:00 reads 3h, not negative.
  const durationMin = (minutesOf(end) - minutesOf(start) + 1440) % 1440;
  const durationLabel = `${Math.floor(durationMin / 60)}h ${String(durationMin % 60).padStart(2, "0")}m`;

  const renderDemo = () => {
    if (pattern === "native") {
      return (
        <div className="flex h-full w-full items-center justify-center gap-4 overflow-auto p-4">
          <div className="time-field">
            <label htmlFor="native-time">Reminder time</label>
            <input
              id="native-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      );
    }
    if (pattern === "duration") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="duration">
            <div className="times">
              <label>
                <span>Start</span>
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  aria-label="Start time"
                />
              </label>
              <span className="text-xs text-muted-foreground">→</span>
              <label>
                <span>End</span>
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  aria-label="End time"
                />
              </label>
            </div>
            <output aria-live="polite">{durationLabel}</output>
            <p className="text-center text-[11px] text-muted-foreground">
              Wraps past midnight — 22:00 → 01:00 is 3h, not −21h.
            </p>
          </div>
        </div>
      );
    }
    if (pattern === "step") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          <div className="step-field">
            <label htmlFor="step-time">Meeting slot</label>
            <input
              id="step-time"
              type="time"
              step={900}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <p>step=900 — the native picker snaps to 15-minute increments.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 overflow-auto p-4">
        <div className="times-row">
          <label>
            <span>From</span>
            <input
              type="time"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="From time"
            />
          </label>
          <label>
            <span>To</span>
            <input
              type="time"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="To time"
            />
          </label>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Two native fields — the sheet pattern is layout, not new controls.
        </p>
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
            Same day, better time.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Native time inputs with a styled picker indicator, minute-step values, and a duration
            readout computed from two times — the platform control, dressed properly.
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
                time-{pattern}.css
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
              <li>• input[type="time"]</li>
              <li>• ::-webkit-calendar-picker-indicator</li>
              <li>• step attribute</li>
              <li>• font-variant-numeric: tabular-nums</li>
              <li>• Dark-mode filter invert</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .time-field { display: grid; gap: 0.4rem; max-inline-size: 15rem; }
        .time-field label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .time-field input[type="time"],
        .duration input[type="time"],
        .step-field input[type="time"],
        .times-row input[type="time"] {
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--card);
          padding: 0 0.8rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .time-field input[type="time"] { block-size: 2.75rem; }
        .time-field input[type="time"]:focus-visible,
        .duration input[type="time"]:focus-visible,
        .step-field input[type="time"]:focus-visible,
        .times-row input[type="time"]:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
        }
        .time-field input[type="time"]::-webkit-calendar-picker-indicator,
        .duration input[type="time"]::-webkit-calendar-picker-indicator,
        .step-field input[type="time"]::-webkit-calendar-picker-indicator,
        .times-row input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0.55;
          cursor: pointer;
        }
        .dark .time-field input[type="time"]::-webkit-calendar-picker-indicator,
        .dark .duration input[type="time"]::-webkit-calendar-picker-indicator,
        .dark .step-field input[type="time"]::-webkit-calendar-picker-indicator,
        .dark .times-row input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }

        .duration {
          display: grid;
          gap: 0.8rem;
          max-inline-size: 22rem;
          inline-size: 100%;
        }
        .duration .times {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          gap: 0.6rem;
        }
        .duration label { display: grid; gap: 0.3rem; }
        .duration label span {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .duration input[type="time"] {
          block-size: 2.75rem;
          inline-size: 100%;
        }
        .duration output {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          color: var(--primary);
        }

        .step-field { display: grid; gap: 0.4rem; max-inline-size: 15rem; }
        .step-field label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .step-field input[type="time"] { block-size: 2.75rem; accent-color: var(--primary); }
        .step-field p { font-size: 0.72rem; color: var(--muted-foreground); }

        .times-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }
        .times-row label { display: grid; gap: 0.3rem; }
        .times-row label span {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted-foreground);
        }
        .times-row input[type="time"] {
          block-size: 3.25rem;
          font-size: 0.95rem;
          font-weight: 700;
          inline-size: 100%;
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
