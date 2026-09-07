import * as React from "react";

export type PatternEmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  /** "hero" centers in a card, "inline" is a compact row for small areas. */
  layout?: "hero" | "inline";
  className?: string;
};

/** Empty / no-results placeholder in a centered hero or compact inline layout. */
export function PatternEmptyState({
  title,
  description,
  icon,
  action,
  layout = "hero",
  className = "",
}: PatternEmptyStateProps) {
  if (layout === "inline") {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border border-dashed bg-card px-4 py-3 ${className}`}
      >
        {icon && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card px-6 py-12 text-center ${className}`}
    >
      {icon && (
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
          {icon}
        </span>
      )}
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
