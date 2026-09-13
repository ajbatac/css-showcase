import * as React from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

export type PatternBadgeProps = {
  tone?: Tone;
  /** Show a leading status dot. */
  dot?: boolean;
  /** Pill with a numeric count instead of text. */
  count?: number;
  children?: React.ReactNode;
  className?: string;
};

const TONES: Record<Tone, { pill: string; dot: string }> = {
  neutral: { pill: "border-border bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  success: { pill: "border-chart-2/40 bg-chart-2/15 text-foreground", dot: "bg-chart-2" },
  warning: { pill: "border-chart-4/40 bg-chart-4/15 text-foreground", dot: "bg-chart-4" },
  danger: {
    pill: "border-destructive/40 bg-destructive/15 text-foreground",
    dot: "bg-destructive",
  },
  info: { pill: "border-primary/40 bg-primary/15 text-foreground", dot: "bg-primary" },
};

/** Status pill, count badge or dot indicator. */
export function PatternBadge({
  tone = "neutral",
  dot = false,
  count,
  children,
  className = "",
}: PatternBadgeProps) {
  const t = TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${t.pill} ${className}`}
    >
      {dot && <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />}
      {typeof count === "number" ? (count > 99 ? "99+" : count) : children}
    </span>
  );
}
