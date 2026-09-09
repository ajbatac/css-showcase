import * as React from "react";

export type PatternSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

/** Labelled toggle switch with a 44px row target and real ARIA switch semantics. */
export function PatternSwitch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className = "",
}: PatternSwitchProps) {
  const id = React.useId();
  return (
    <div className={`flex min-h-11 items-center justify-between gap-4 ${className}`}>
      <span className="min-w-0">
        <label htmlFor={id} className="block text-sm font-semibold text-foreground">
          {label}
        </label>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
          checked ? "border-primary bg-primary" : "border-border bg-muted"
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-background shadow transition-all ${
            checked ? "left-[1.55rem]" : "left-0.5"
          }`}
          style={{ height: "1.125rem", width: "1.125rem" }}
        />
      </button>
    </div>
  );
}
