import * as React from "react";

export type PatternSkeletonProps = {
  /** Shape preset. */
  variant?: "line" | "block" | "circle" | "card" | "table";
  /** Repeat count for line/table variants. */
  lines?: number;
  className?: string;
};

/** Shimmering loading placeholder built on token colours so it works in light and dark. */
export function PatternSkeleton({
  variant = "line",
  lines = 3,
  className = "",
}: PatternSkeletonProps) {
  const shimmer =
    "relative overflow-hidden bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[pattern-shimmer_1.4s_infinite] before:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent)]";

  const keyframes = (
    <style>{`@keyframes pattern-shimmer { to { transform: translateX(100%); } }`}</style>
  );

  if (variant === "circle") {
    return (
      <div className={className}>
        {keyframes}
        <div className={`h-10 w-10 rounded-full ${shimmer}`} />
      </div>
    );
  }

  if (variant === "block") {
    return (
      <div className={className}>
        {keyframes}
        <div className={`aspect-video w-full rounded-xl ${shimmer}`} />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`rounded-2xl border bg-card p-4 ${className}`}>
        {keyframes}
        <div className={`aspect-video w-full rounded-xl ${shimmer}`} />
        <div className={`mt-3 h-3 w-2/3 rounded ${shimmer}`} />
        <div className={`mt-2 h-3 w-1/3 rounded ${shimmer}`} />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`overflow-hidden rounded-2xl border ${className}`}>
        {keyframes}
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b p-3 last:border-b-0">
            <div className={`h-8 w-8 rounded-full ${shimmer}`} />
            <div className={`h-3 flex-1 rounded ${shimmer}`} />
            <div className={`h-3 w-16 rounded ${shimmer}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {keyframes}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 rounded ${shimmer}`} style={{ width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}
