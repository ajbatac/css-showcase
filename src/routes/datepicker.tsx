import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch } from "@/lib/demo-state";

export const Route = createFileRoute("/datepicker")({
  head: () => ({
    meta: [
      { title: "Date Pickers — CSS Showcase" },
      {
        name: "description",
        content:
          "Inline calendars, anchored popovers, two-month range pickers, and mobile date sheets built with CSS grid and container queries.",
      },
      { property: "og:title", content: "Date Pickers — CSS Showcase" },
      {
        property: "og:description",
        content:
          "One date picker reshaped for mobile, iPad, and desktop with CSS grid, container queries, and semantic tokens.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DatePickerDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "inline" | "popover" | "range" | "sheet" | "quick";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "popover", label: "Input + anchored popover", desc: "Calendar drops under the field" },
    { id: "range", label: "Two-month range", desc: "Side-by-side months, start → end" },
    { id: "inline", label: "Always-visible calendar", desc: "Embedded in the form" },
  ],
  ipad: [
    { id: "popover", label: "Input + anchored popover", desc: "Larger tap targets" },
    { id: "inline", label: "Always-visible calendar", desc: "Split panel with summary" },
  ],
  mobile: [
    { id: "sheet", label: "Field + bottom sheet", desc: "Calendar slides up from bottom" },
    { id: "quick", label: "Quick chips + compact grid", desc: "Today / tomorrow shortcuts" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  inline: `/* Always-visible calendar */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 2px;
}

.cal-shell { container-type: inline-size; }

/* Wide containers put a summary next to the calendar */
@container (min-width: 520px) {
  .cal-shell { display: grid; grid-template-columns: 1fr .8fr; gap: .75rem; }
}`,
  popover: `/* Input + anchored popover */
.date-field { position: relative; }

.date-popover {
  position: absolute;
  inset-inline-start: 0;
  top: calc(100% + .375rem);
  z-index: 20;
  transform-origin: top left;
  animation: pop-in .16s ease-out;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(.96) translateY(-4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}`,
  range: `/* Two-month range picker */
.range-months {
  container-type: inline-size;
  display: grid;
  gap: .75rem;
  grid-template-columns: minmax(0, 1fr);
}

@container (min-width: 460px) {
  .range-months { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* In-range days get a continuous band */
.cal-day[data-in-range="true"] {
  background: color-mix(in oklab, var(--primary) 16%, transparent);
  border-radius: 0;
}
.cal-day[data-edge="start"] { border-start-start-radius: 999px; border-end-start-radius: 999px; }
.cal-day[data-edge="end"]   { border-start-end-radius: 999px; border-end-end-radius: 999px; }`,
  sheet: `/* Mobile field + bottom sheet */
.date-sheet {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 30;
  border-start-start-radius: 1rem;
  border-start-end-radius: 1rem;
  animation: sheet-up .22s ease-out;
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.date-backdrop { position: absolute; inset: 0; z-index: 20;
  background: color-mix(in oklab, var(--foreground) 45%, transparent); }`,
  quick: `/* Quick chips + compact grid */
.date-chips {
  display: flex;
  gap: .375rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.date-chips > * { scroll-snap-align: start; flex: 0 0 auto; }

.cal-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 1px; }
.cal-day { aspect-ratio: 1; font-size: 9px; }`,
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TODAY = new Date(2026, 7, 22);

const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fmt = (d: Date | null) =>
  d ? `${MONTHS[d.getMonth()]!.slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}` : "Select a date";

function monthCells(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = first.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let i = 1; i <= days; i += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function DatePickerDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "popover",
      ipad: "popover",
      mobile: "sheet",
    }),
  );

  const pattern = patterns[device];
  const options = PATTERNS[device];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One date picker. Many patterns per device.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Desktop gets an anchored popover, a two-month range picker, and an inline calendar;
            mobile switches to a bottom sheet or quick-chip shortcuts.
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
              <PickerStage pattern={pattern} />
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
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">{o.label}</span>
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
                datepicker-{pattern}.css
              </span>
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
              <li>• 7-column CSS Grid</li>
              <li>• aspect-ratio day cells</li>
              <li>• color-mix() range band</li>
              <li>• Logical border radii</li>
              <li>• Keyframe sheet / popover</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function PickerStage({ pattern }: { pattern: Pattern }) {
  const [month, setMonth] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(TODAY);
  const [start, setStart] = useState<Date | null>(TODAY);
  const [end, setEnd] = useState<Date | null>(addDays(TODAY, 6));
  const [open, setOpen] = useState(pattern === "inline");

  const nextMonth = useMemo(() => new Date(month.getFullYear(), month.getMonth() + 1, 1), [month]);

  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));

  const pickRange = (d: Date) => {
    if (!start || (start && end)) {
      setStart(d);
      setEnd(null);
      return;
    }
    if (d < start) {
      setStart(d);
      return;
    }
    setEnd(d);
  };

  if (pattern === "inline") {
    return (
      <div className="h-full w-full overflow-auto p-3">
        <div className="cal-shell grid gap-3" style={{ containerType: "inline-size" }}>
          <div className="rounded-xl border bg-card p-2.5">
            <Calendar
              month={month}
              onShift={shift}
              isSelected={(d) => !!selected && key(d) === key(selected)}
              onPick={setSelected}
            />
          </div>
          <div className="rounded-xl border bg-card p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Selected
            </p>
            <p className="mt-1 text-[11px] font-bold">{fmt(selected)}</p>
            <p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">
              The calendar is always visible — no popover, no sheet. On wide containers a summary
              panel sits beside it.
            </p>
          </div>
        </div>
        <style>{`
          .cal-shell { grid-template-columns: minmax(0, 1fr); }
          @container (min-width: 520px) {
            .cal-shell { grid-template-columns: 1fr .8fr; }
          }
        `}</style>
      </div>
    );
  }

  if (pattern === "range") {
    return (
      <div className="h-full w-full overflow-auto p-3">
        <div className="mb-2 flex items-center gap-2">
          <FieldBox label="Start" value={fmt(start)} />
          <span className="text-[10px] text-muted-foreground">→</span>
          <FieldBox label="End" value={end ? fmt(end) : "Pick end"} />
        </div>
        <div className="range-months grid gap-2" style={{ containerType: "inline-size" }}>
          {[month, nextMonth].map((m, i) => (
            <div key={i} className="rounded-xl border bg-card p-2">
              <Calendar
                month={m}
                onShift={i === 0 ? shift : undefined}
                isSelected={(d) =>
                  (!!start && key(d) === key(start)) || (!!end && key(d) === key(end))
                }
                inRange={(d) => !!start && !!end && d > start && d < end}
                edge={(d) =>
                  start && key(d) === key(start)
                    ? "start"
                    : end && key(d) === key(end)
                      ? "end"
                      : undefined
                }
                onPick={pickRange}
              />
            </div>
          ))}
        </div>
        <style>{`
          .range-months { grid-template-columns: minmax(0, 1fr); }
          @container (min-width: 460px) {
            .range-months { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
        `}</style>
      </div>
    );
  }

  if (pattern === "quick") {
    const chips = [
      { label: "Today", date: TODAY },
      { label: "Tomorrow", date: addDays(TODAY, 1) },
      { label: "In a week", date: addDays(TODAY, 7) },
      { label: "In a month", date: addDays(TODAY, 30) },
    ];
    return (
      <div className="h-full w-full overflow-auto p-2.5">
        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Delivery date
        </p>
        <div className="date-chips mb-2 flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]">
          {chips.map((c) => {
            const active = !!selected && key(c.date) === key(selected);
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => setSelected(c.date)}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <div className="rounded-xl border bg-card p-2">
          <Calendar
            compact
            month={month}
            onShift={shift}
            isSelected={(d) => !!selected && key(d) === key(selected)}
            onPick={setSelected}
          />
        </div>
        <p className="mt-2 rounded-lg bg-muted px-2 py-1.5 text-[9px] font-semibold">
          {fmt(selected)}
        </p>
      </div>
    );
  }

  // popover (desktop / ipad) and sheet (mobile)
  const isSheet = pattern === "sheet";
  return (
    <div className="relative h-full w-full overflow-hidden p-3">
      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        Booking date
      </p>
      <div className="date-field relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-left text-[10px] font-semibold transition hover:bg-accent"
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{fmt(selected)}</span>
        </button>

        {open && !isSheet && (
          <div
            className="date-popover absolute left-0 top-[calc(100%+0.375rem)] z-20 w-[min(100%,240px)] rounded-xl border bg-card p-2 shadow-xl"
            style={{ animation: "dp-pop .16s ease-out" }}
          >
            <Calendar
              month={month}
              onShift={shift}
              isSelected={(d) => !!selected && key(d) === key(selected)}
              onPick={(d) => {
                setSelected(d);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-2 grid gap-1.5">
        <div className="h-2 w-2/3 rounded bg-muted" />
        <div className="h-2 w-1/2 rounded bg-muted" />
      </div>

      {open && isSheet && (
        <>
          <button
            type="button"
            aria-label="Close date picker"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-20 bg-foreground/45"
          />
          <div
            className="date-sheet absolute inset-x-0 bottom-0 z-30 rounded-t-2xl border-t bg-card p-2.5 shadow-2xl"
            style={{ animation: "dp-sheet .22s ease-out" }}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold">Pick a date</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-0.5 text-muted-foreground hover:bg-accent"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <Calendar
              month={month}
              onShift={shift}
              isSelected={(d) => !!selected && key(d) === key(selected)}
              onPick={setSelected}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-lg bg-primary py-2 text-[10px] font-bold text-primary-foreground"
            >
              Confirm {fmt(selected)}
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes dp-pop {
          from { opacity: 0; transform: scale(.96) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes dp-sheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border bg-card px-2 py-1.5">
      <div className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="truncate text-[10px] font-bold">{value}</div>
    </div>
  );
}

function Calendar({
  month,
  onShift,
  onPick,
  isSelected,
  inRange,
  edge,
  compact,
}: {
  month: Date;
  onShift?: (n: number) => void;
  onPick: (d: Date) => void;
  isSelected: (d: Date) => boolean;
  inRange?: (d: Date) => boolean;
  edge?: (d: Date) => "start" | "end" | undefined;
  compact?: boolean;
}) {
  const cells = useMemo(() => monthCells(month), [month]);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-1">
        {onShift ? (
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onShift(-1)}
            className="rounded-md border border-border p-0.5 text-muted-foreground transition hover:bg-accent"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        ) : (
          <span className="h-4 w-4" />
        )}
        <span className="truncate text-[10px] font-bold">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        {onShift ? (
          <button
            type="button"
            aria-label="Next month"
            onClick={() => onShift(1)}
            className="rounded-md border border-border p-0.5 text-muted-foreground transition hover:bg-accent"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        ) : (
          <span className="h-4 w-4" />
        )}
      </div>

      <div className="grid grid-cols-7 gap-px text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="py-0.5 text-[8px] font-bold uppercase text-muted-foreground">
            {w}
          </span>
        ))}
      </div>

      <div className={`cal-grid grid grid-cols-7 ${compact ? "gap-px" : "gap-0.5"}`}>
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="aspect-square" />;
          const active = isSelected(d);
          const between = inRange?.(d) ?? false;
          const isToday = key(d) === key(TODAY);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(d)}
              data-in-range={between || undefined}
              data-edge={edge?.(d)}
              aria-current={isToday ? "date" : undefined}
              aria-pressed={active}
              className={`cal-day grid aspect-square place-items-center text-[9px] font-semibold transition ${
                active
                  ? "rounded-full bg-primary text-primary-foreground"
                  : between
                    ? "bg-primary/15 text-foreground"
                    : "rounded-full text-foreground hover:bg-accent"
              } ${isToday && !active ? "ring-1 ring-primary/50" : ""}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
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
