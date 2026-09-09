import * as React from "react";

export type PatternOption = { value: string; label: string };

export type PatternMultiSelectProps = {
  label: string;
  options: PatternOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
};

/** Chip-based multi-select: click to open, chips show selections, Escape closes. */
export function PatternMultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  className = "",
}: PatternMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div ref={rootRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      <span id={id} className="text-xs font-semibold text-foreground">
        {label}
      </span>
      <button
        type="button"
        aria-labelledby={id}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-left text-sm transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex min-w-0 flex-wrap gap-1.5">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            options
              .filter((o) => value.includes(o.value))
              .map((o) => (
                <span
                  key={o.value}
                  className="rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-foreground"
                >
                  {o.label}
                </span>
              ))
          )}
        </span>
        <span aria-hidden className="shrink-0 text-muted-foreground">
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-border bg-card p-1 shadow-lg"
        >
          {options.map((o) => {
            const selected = value.includes(o.value);
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => toggle(o.value)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm transition hover:bg-accent"
                >
                  <span
                    aria-hidden
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] font-bold ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>
                  <span className="truncate">{o.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
