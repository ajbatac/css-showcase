import { useRef } from "react";

export type DemoDevice = "desktop" | "ipad" | "mobile";

const DEVICES: { id: DemoDevice; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

/**
 * Radiogroup keyboard behaviour: arrows cycle, Home/End jump to the edges.
 * Selection and focus move together, matching the WAI-ARIA radio group pattern.
 */
function handleRadioKeys(
  event: React.KeyboardEvent,
  index: number,
  count: number,
  select: (index: number) => void,
) {
  let next: number | undefined;
  if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % count;
  else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + count) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  if (next === undefined) return;
  event.preventDefault();
  select(next);
}

/**
 * The three-way desktop / iPad / mobile viewport switcher shared by every demo.
 * Announced as a radio group (it swaps content inline rather than controlling
 * tab panels) with roving tabindex and arrow-key navigation.
 */
export function DeviceTabs({
  value,
  onChange,
}: {
  value: DemoDevice;
  onChange: (device: DemoDevice) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    onChange(DEVICES[index].id);
    refs.current[index]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Device viewport"
      className="grid grid-cols-3 gap-2 border-t bg-background/50 p-3"
    >
      {DEVICES.map((d, index) => {
        const active = value === d.id;
        return (
          <button
            key={d.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => handleRadioKeys(event, index, DEVICES.length, select)}
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
  );
}

/**
 * The per-device design-pattern picker shared by every demo. Same radiogroup
 * semantics as DeviceTabs.
 */
export function PatternList<P extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: P; label: string; desc: string }[];
  value: P;
  onChange: (pattern: P) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    onChange(options[index].id);
    refs.current[index]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Design pattern" className="grid gap-2">
      {options.map((o, index) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => handleRadioKeys(event, index, options.length, select)}
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
              active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"
            }`}
          >
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold">{o.label}</span>
              <span className="block truncate text-[10px] text-muted-foreground">{o.desc}</span>
            </span>
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${active ? "bg-primary" : "bg-border"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
