import * as React from "react";

export type PatternProgressProps = {
  /** 0–100. Omit for an indeterminate bar. */
  value?: number;
  label?: string;
  /** "bar" is a linear track, "ring" is a circular indicator. */
  variant?: "bar" | "ring";
  showValue?: boolean;
  className?: string;
};

/** Determinate or indeterminate progress as a linear bar or a circular ring. */
export function PatternProgress({
  value,
  label,
  variant = "bar",
  showValue = true,
  className = "",
}: PatternProgressProps) {
  const indeterminate = typeof value !== "number";
  const pct = Math.min(100, Math.max(0, value ?? 0));
  const aria = {
    role: "progressbar" as const,
    "aria-label": label ?? "Progress",
    "aria-valuenow": indeterminate ? undefined : Math.round(pct),
    "aria-valuemin": 0,
    "aria-valuemax": 100,
  };

  if (variant === "ring") {
    const size = 64;
    const stroke = 6;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className}`} {...aria}>
        <svg width={size} height={size} className={indeterminate ? "animate-spin" : undefined}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={indeterminate ? c * 0.75 : c * (1 - pct / 100)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 400ms ease" }}
          />
        </svg>
        {label && <span className="text-xs font-semibold text-muted-foreground">{label}</span>}
        {showValue && !indeterminate && (
          <span className="text-xs text-muted-foreground">{Math.round(pct)}%</span>
        )}
      </div>
    );
  }

  return (
    <div className={className} {...aria}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>{label}</span>
          {showValue && !indeterminate && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full bg-primary ${indeterminate ? "w-1/3 animate-[pattern-slide_1.2s_ease-in-out_infinite]" : ""}`}
          style={indeterminate ? undefined : { width: `${pct}%`, transition: "width 400ms ease" }}
        />
      </div>
      <style>{`@keyframes pattern-slide{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}
