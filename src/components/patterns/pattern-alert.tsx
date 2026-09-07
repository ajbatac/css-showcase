import * as React from "react";

type Tone = "success" | "warning" | "error" | "info";

export type PatternAlertProps = {
  tone?: Tone;
  title: string;
  children?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
};

const TONES: Record<Tone, { wrap: string; dot: string; glyph: string }> = {
  success: { wrap: "border-chart-2/40 bg-chart-2/10", dot: "bg-chart-2", glyph: "✓" },
  warning: { wrap: "border-chart-4/40 bg-chart-4/10", dot: "bg-chart-4", glyph: "!" },
  error: { wrap: "border-destructive/40 bg-destructive/10", dot: "bg-destructive", glyph: "×" },
  info: { wrap: "border-primary/40 bg-primary/10", dot: "bg-primary", glyph: "i" },
};

/** Dismissible inline alert with an accessible live region. */
export function PatternAlert({
  tone = "info",
  title,
  children,
  onDismiss,
  className = "",
}: PatternAlertProps) {
  const t = TONES[tone];
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-2xl border p-3.5 ${t.wrap} ${className}`}
    >
      <span
        aria-hidden
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-background ${t.dot}`}
      >
        {t.glyph}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {children && (
          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{children}</div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          ✕
        </button>
      )}
    </div>
  );
}
