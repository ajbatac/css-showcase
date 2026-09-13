import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/pagination")({
  head: () => ({
    meta: [
      { title: "Pagination — CSS Showcase" },
      {
        name: "description",
        content:
          "Interactive pagination patterns — numbered windows, compact page selectors, load-more buttons, mobile prev/next, and infinite scroll sentinels — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Pagination — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Pagination UI styles using flexbox, CSS grid, sticky sentinels, and interactive React state.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaginationDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "numbered" | "compact" | "load-more" | "prev-next" | "infinite";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "numbered", label: "Numbered", desc: "Prev/next + numbered buttons with ellipsis" },
    { id: "compact", label: "Compact", desc: '"Page X of Y" + arrows + per-page select' },
    { id: "load-more", label: "Load more", desc: "Button appending items to the list" },
  ],
  ipad: [
    { id: "numbered", label: "Numbered", desc: "Prev/next + numbered buttons with ellipsis" },
    { id: "compact", label: "Compact", desc: '"Page X of Y" + arrows + per-page select' },
  ],
  mobile: [
    {
      id: "prev-next",
      label: "Prev / Next",
      desc: "Large full-width prev/next with page indicator",
    },
    {
      id: "infinite",
      label: "Infinite scroll",
      desc: 'Auto "Loading more…" sentinel with Load more',
    },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  numbered: `/* Numbered pagination with ellipsis windowing */
.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination button {
  min-width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.pagination button[aria-current="page"] {
  background: var(--primary);
  color: var(--primary-foreground);
  border-color: transparent;
}

.pagination .ellipsis {
  padding-inline: 0.25rem;
  color: var(--muted-foreground);
}`,
  compact: `/* Compact "Page X of Y" pagination */
.pagination-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.pagination-compact select {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--card);
}`,
  "load-more": `/* Load-more button appends items */
.load-more-btn {
  display: block;
  width: 100%;
  border: 1px dashed var(--border);
  border-radius: 0.75rem;
  padding-block: 0.5rem;
  color: var(--muted-foreground);
  transition: background 0.2s ease;
}

.load-more-btn:hover {
  background: color-mix(in oklch, var(--foreground) 10%, transparent);
}`,
  "prev-next": `/* Mobile full-width prev/next controls */
.prev-next-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.prev-next-bar button {
  padding-block: 0.6rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  font-weight: 600;
}

.prev-next-bar button:disabled {
  opacity: 0.4;
}`,
  infinite: `/* Infinite scroll sentinel */
.infinite-sentinel {
  display: flex;
  justify-content: center;
  padding-block: 0.75rem;
  color: var(--muted-foreground);
}

.infinite-sentinel .spinner {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--foreground);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`,
};

const TOTAL_ITEMS = 97;
const PER_PAGE_DEFAULT = 10;

function itemsLabel(page: number, perPage: number) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, TOTAL_ITEMS);
  return `${start}–${end} of ${TOTAL_ITEMS}`;
}

function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const add = (p: number | "ellipsis") => pages.push(p);
  add(1);
  if (current > 3) add("ellipsis");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) add(p);
  if (current < total - 2) add("ellipsis");
  if (total > 1) add(total);
  return pages;
}

function PaginationDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "numbered",
      ipad: "numbered",
      mobile: "prev-next",
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
            Pagination that scales.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Interactive pagination — numbered windows with ellipsis, compact page selectors,
            load-more buttons, and mobile-first prev/next and infinite-scroll patterns.
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
              <PaginationMiniPage key={pattern} pattern={pattern} />
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
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
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
                pagination-{pattern}.css
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
              <li>• CSS grid controls</li>
              <li>• aria-current styling</li>
              <li>• @keyframes spinner</li>
              <li>• color-mix hover states</li>
              <li>• disabled state opacity</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .pagination button {
          min-width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--card);
        }

        .pagination button[aria-current="page"] {
          background: var(--primary);
          color: var(--primary-foreground);
          border-color: transparent;
        }

        .pagination button:disabled {
          opacity: 0.4;
        }

        .pagination .ellipsis {
          padding-inline: 0.15rem;
          color: var(--muted-foreground);
        }

        .pagination-compact select {
          border: 1px solid var(--border);
          border-radius: 0.4rem;
          background: var(--card);
        }

        .load-more-btn {
          display: block;
          width: 100%;
          border: 1px dashed var(--border);
          border-radius: 0.6rem;
          color: var(--muted-foreground);
          transition: background 0.2s ease;
        }

        .load-more-btn:hover {
          background: color-mix(in oklch, var(--foreground) 10%, transparent);
        }

        .prev-next-bar button {
          border-radius: 0.6rem;
          border: 1px solid var(--border);
          font-weight: 600;
          background: var(--card);
        }

        .prev-next-bar button:disabled {
          opacity: 0.4;
        }

        .infinite-sentinel .spinner {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          border: 2px solid var(--border);
          border-top-color: var(--foreground);
          animation: pg-spin 0.8s linear infinite;
        }

        @keyframes pg-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

function PaginationMiniPage({ pattern }: { pattern: Pattern }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE_DEFAULT);
  const totalPages = Math.ceil(TOTAL_ITEMS / perPage);

  const [loadedCount, setLoadedCount] = useState(perPage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pattern !== "infinite") return;
    if (loadedCount >= TOTAL_ITEMS) return;
    setLoading(true);
    const t = setTimeout(() => {
      setLoadedCount((c) => Math.min(TOTAL_ITEMS, c + perPage));
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, [pattern, loadedCount, perPage]);

  const rows = (count: number) => Array.from({ length: count }, (_, i) => `Item ${i + 1}`);

  return (
    <div className="pagination-demo flex h-full w-full flex-col overflow-hidden text-[9px] text-muted-foreground">
      <div className="flex-1 overflow-auto p-3">
        <p className="mb-2 text-[10px] font-semibold text-foreground">Results</p>
        <ul className="space-y-1">
          {pattern === "load-more" || pattern === "infinite"
            ? rows(pattern === "load-more" ? loadedCount : loadedCount).map((label) => (
                <li
                  key={label}
                  className="rounded-lg border border-border bg-card px-2 py-1.5 text-foreground"
                >
                  {label}
                </li>
              ))
            : rows(Math.min(perPage, TOTAL_ITEMS - (page - 1) * perPage)).map((_, i) => {
                const n = (page - 1) * perPage + i + 1;
                return (
                  <li
                    key={n}
                    className="rounded-lg border border-border bg-card px-2 py-1.5 text-foreground"
                  >
                    Item {n}
                  </li>
                );
              })}
        </ul>

        {pattern === "load-more" && loadedCount < TOTAL_ITEMS && (
          <button
            className="load-more-btn mt-2"
            onClick={() => setLoadedCount((c) => Math.min(TOTAL_ITEMS, c + perPage))}
          >
            Load more
          </button>
        )}

        {pattern === "infinite" && (
          <div className="infinite-sentinel mt-2">
            {loadedCount < TOTAL_ITEMS ? (
              loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="spinner" /> Loading more…
                </span>
              ) : (
                <button
                  className="load-more-btn"
                  onClick={() => setLoadedCount((c) => Math.min(TOTAL_ITEMS, c + perPage))}
                >
                  Load more
                </button>
              )
            ) : (
              <span>All {TOTAL_ITEMS} items loaded</span>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-background/60 p-2">
        {pattern === "numbered" && (
          <nav aria-label="Pagination" className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="mx-auto h-3 w-3" />
            </button>
            {pageWindow(page, totalPages).map((p, i) =>
              p === "ellipsis" ? (
                <span key={`e${i}`} className="ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  aria-current={p === page ? "page" : undefined}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ),
            )}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="mx-auto h-3 w-3" />
            </button>
          </nav>
        )}

        {pattern === "compact" && (
          <div className="pagination-compact">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="px-1 py-0.5 text-foreground"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        )}

        {pattern === "load-more" && (
          <p className="text-center text-[9px]">{itemsLabel(1, loadedCount)}</p>
        )}

        {pattern === "prev-next" && (
          <div>
            <div className="prev-next-bar">
              <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                ‹ Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next ›
              </button>
            </div>
            <p className="mt-1.5 text-center text-foreground">
              Page {page} of {totalPages}
            </p>
          </div>
        )}

        {pattern === "infinite" && (
          <p className="text-center text-[9px]">
            {loadedCount} of {TOTAL_ITEMS} loaded
          </p>
        )}
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
