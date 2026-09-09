import * as React from "react";

export type PatternPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** "numbers" shows truncated page numbers, "compact" shows "Page x of y". */
  variant?: "numbers" | "compact";
  className?: string;
};

function range(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/** Pagination with truncated page numbers or a compact mobile-friendly counter. */
export function PatternPagination({
  page,
  pageCount,
  onPageChange,
  variant = "numbers",
  className = "",
}: PatternPaginationProps) {
  const go = (p: number) => onPageChange(Math.min(pageCount, Math.max(1, p)));

  const pages: (number | "gap")[] = React.useMemo(() => {
    if (pageCount <= 7) return range(1, pageCount);
    if (page <= 4) return [...range(1, 5), "gap", pageCount];
    if (page >= pageCount - 3) return [1, "gap", ...range(pageCount - 4, pageCount)];
    return [1, "gap", page - 1, page, page + 1, "gap", pageCount];
  }, [page, pageCount]);

  const navBtn =
    "grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-card text-sm font-semibold transition hover:bg-accent disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1.5 ${className}`}>
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => go(page - 1)} className={navBtn}>
        ‹
      </button>

      {variant === "compact" ? (
        <span className="px-3 text-sm font-semibold text-muted-foreground">
          Page {page} of {pageCount}
        </span>
      ) : (
        pages.map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} aria-hidden className="px-1 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              onClick={() => go(p)}
              className={`grid min-h-11 min-w-11 place-items-center rounded-xl border text-sm font-semibold transition ${
                p === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ),
        )
      )}

      <button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => go(page + 1)} className={navBtn}>
        ›
      </button>
    </nav>
  );
}
