import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, X, CornerDownLeft, Clock } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — CSS Showcase" },
      {
        name: "description",
        content:
          "Search UI patterns — inline bar, command palette, filters, expanding icon, and full-screen overlay — reshaped for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Search — CSS Showcase" },
      {
        property: "og:description",
        content:
          "One search experience reshaped for mobile, iPad, and desktop with live client-side filtering and container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "inline-bar"
  | "command-palette"
  | "with-filters"
  | "expanding"
  | "full-screen";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "inline-bar", label: "Inline bar", desc: "Field in header, results below" },
    { id: "command-palette", label: "Command palette", desc: "Centered overlay with groups" },
    { id: "with-filters", label: "With filters", desc: "Search + filter chips" },
  ],
  ipad: [
    { id: "inline-bar", label: "Inline bar", desc: "Field in header, results below" },
    { id: "with-filters", label: "With filters", desc: "Search + filter chips" },
  ],
  mobile: [
    { id: "expanding", label: "Expanding icon", desc: "Icon expands to full-width" },
    { id: "full-screen", label: "Full-screen", desc: "Overlay with recent searches" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "inline-bar": `/* Inline search bar */
.search-shell[data-pattern="inline-bar"] .search-field {
  width: 100%;
  border-radius: 0.75rem;
}

.search-results {
  display: grid;
  gap: 0.375rem;
  margin-top: 0.75rem;
}`,
  "command-palette": `/* Command palette overlay */
.search-shell[data-pattern="command-palette"] {
  display: grid;
  place-items: start center;
  padding-top: 10%;
}

.command-palette {
  width: min(90%, 420px);
  border-radius: 1rem;
  box-shadow: 0 20px 60px hsl(var(--foreground) / 0.15);
}

.command-kbd {
  font-family: ui-monospace, monospace;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
}`,
  "with-filters": `/* Search with filter chips */
.search-shell[data-pattern="with-filters"] .filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.filter-chip[data-active="true"] {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-color: hsl(var(--primary));
}`,
  expanding: `/* Icon expands into a full-width field */
.expand-search {
  display: flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid hsl(var(--border));
  overflow: hidden;
  transition: width 0.3s ease;
}

.expand-search[data-open="false"] {
  width: 2.25rem;
}

.expand-search[data-open="true"] {
  width: 100%;
}

.expand-search input {
  opacity: 0;
  transition: opacity 0.2s ease 0.1s;
}

.expand-search[data-open="true"] input {
  opacity: 1;
}`,
  "full-screen": `/* Full-screen search overlay */
.fullscreen-search {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  background: hsl(var(--card));
  animation: search-fade-in 0.2s ease;
}

@keyframes search-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}`,
};

const ITEMS = [
  { id: 1, title: "Getting started guide", group: "Docs", tag: "docs" },
  { id: 2, title: "Keyboard shortcuts", group: "Docs", tag: "docs" },
  { id: 3, title: "Invoice #1042", group: "Files", tag: "files" },
  { id: 4, title: "Quarterly report.pdf", group: "Files", tag: "files" },
  { id: 5, title: "Jordan Lee", group: "People", tag: "people" },
  { id: 6, title: "Priya Shah", group: "People", tag: "people" },
  { id: 7, title: "Dark mode toggle", group: "Settings", tag: "settings" },
  { id: 8, title: "Notification preferences", group: "Settings", tag: "settings" },
];

const FILTERS = ["docs", "files", "people", "settings"] as const;

function useFilteredItems(query: string, activeFilter: string | null) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((item) => {
      const matchesQuery = q === "" || item.title.toLowerCase().includes(q);
      const matchesFilter = !activeFilter || item.tag === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-1 py-6 text-center">
      <SearchIcon className="h-4 w-4 text-muted-foreground" />
      <p className="text-[10px] font-semibold">No results</p>
      <p className="text-[9px] text-muted-foreground">Try a different search term</p>
    </div>
  );
}

function SearchDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "inline-bar",
      ipad: "inline-bar",
      mobile: "expanding",
    }),
  );
  const [query, setQuery] = useState("report");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const recent = ["quarterly report", "dark mode", "priya"];

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const results = useFilteredItems(query, activeFilter);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Search that finds its shape.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            One search experience with live client-side filtering — an inline
            bar, a command palette, filter chips, an expanding icon, and a
            full-screen overlay for mobile.
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
              <div data-pattern={pattern} className="search-shell relative h-full w-full overflow-auto p-3">
                {pattern === "inline-bar" && (
                  <div>
                    <div className="search-field flex items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-1.5">
                      <SearchIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search…"
                        aria-label="Search"
                        className="w-full min-w-0 bg-transparent text-[10px] outline-none"
                      />
                      {query && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          onClick={() => setQuery("")}
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className="search-results">
                      {results.length === 0 ? (
                        <EmptyState />
                      ) : (
                        results.map((r) => (
                          <div key={r.id} className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px]">
                            <span className="font-semibold">{r.title}</span>
                            <span className="ml-1 text-muted-foreground">· {r.group}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {pattern === "command-palette" && (
                  <div className="command-palette mx-auto mt-2 border border-border bg-card p-2">
                    <div className="flex items-center gap-2 border-b border-border px-1 pb-2">
                      <SearchIcon className="h-3 w-3 text-muted-foreground" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a command or search…"
                        aria-label="Search commands"
                        className="w-full min-w-0 bg-transparent text-[10px] outline-none"
                      />
                      <kbd className="command-kbd flex items-center gap-0.5 px-1 py-0.5 text-[8px] text-muted-foreground">
                        <CornerDownLeft className="h-2.5 w-2.5" /> esc
                      </kbd>
                    </div>
                    <div className="mt-1 max-h-40 overflow-auto">
                      {results.length === 0 ? (
                        <EmptyState />
                      ) : (
                        FILTERS.map((group) => {
                          const groupItems = results.filter((r) => r.tag === group);
                          if (groupItems.length === 0) return null;
                          return (
                            <div key={group} className="mb-1.5">
                              <p className="px-1 pb-0.5 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {group}
                              </p>
                              {groupItems.map((r) => (
                                <div key={r.id} className="rounded-md px-1.5 py-1 text-[10px] hover:bg-accent">
                                  {r.title}
                                </div>
                              ))}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {pattern === "with-filters" && (
                  <div>
                    <div className="search-field flex items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-1.5">
                      <SearchIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search…"
                        aria-label="Search"
                        className="w-full min-w-0 bg-transparent text-[10px] outline-none"
                      />
                      {query && (
                        <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                    <div className="filter-row" role="group" aria-label="Filters">
                      {FILTERS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          data-active={activeFilter === f}
                          aria-pressed={activeFilter === f}
                          onClick={() => setActiveFilter((prev) => (prev === f ? null : f))}
                          className="filter-chip rounded-full border border-border bg-background px-2 py-0.5 text-[9px] font-medium capitalize"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <div className="search-results">
                      {results.length === 0 ? (
                        <EmptyState />
                      ) : (
                        results.map((r) => (
                          <div key={r.id} className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px]">
                            {r.title}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {pattern === "expanding" && (
                  <div>
                    <div data-open={expanded} className="expand-search bg-background">
                      <button
                        type="button"
                        aria-label="Open search"
                        onClick={() => setExpanded(true)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center"
                      >
                        <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setExpanded(true)}
                        placeholder="Search…"
                        aria-label="Search"
                        className="w-full min-w-0 bg-transparent text-[10px] outline-none"
                      />
                      {expanded && (
                        <button
                          type="button"
                          aria-label="Close search"
                          onClick={() => {
                            setExpanded(false);
                            setQuery("");
                          }}
                          className="mr-2 shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {expanded && (
                      <div className="search-results">
                        {results.length === 0 ? (
                          <EmptyState />
                        ) : (
                          results.map((r) => (
                            <div key={r.id} className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px]">
                              {r.title}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {pattern === "full-screen" && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setFullScreenOpen(true)}
                      className="flex w-full items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-1.5 text-left text-[10px] text-muted-foreground"
                    >
                      <SearchIcon className="h-3 w-3" /> Tap to search
                    </button>
                    {fullScreenOpen && (
                      <div className="fullscreen-search">
                        <div className="flex items-center gap-2 border-b border-border p-2">
                          <SearchIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search…"
                            aria-label="Search"
                            className="w-full min-w-0 bg-transparent text-[10px] outline-none"
                          />
                          <button
                            type="button"
                            aria-label="Close search"
                            onClick={() => setFullScreenOpen(false)}
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="overflow-auto p-2">
                          {query === "" ? (
                            <div>
                              <p className="mb-1 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Recent
                              </p>
                              {recent.map((r) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => setQuery(r)}
                                  className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] hover:bg-accent"
                                >
                                  <Clock className="h-2.5 w-2.5 text-muted-foreground" /> {r}
                                </button>
                              ))}
                            </div>
                          ) : results.length === 0 ? (
                            <EmptyState />
                          ) : (
                            <div className="grid gap-1">
                              {results.map((r) => (
                                <div key={r.id} className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px]">
                                  {r.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                      active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">{o.label}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">{o.desc}</span>
                    </span>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${active ? "bg-primary" : "bg-border"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">search-{pattern}.css</span>
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
              <li>• Container queries</li>
              <li>• Live client-side filtering</li>
              <li>• Width transitions</li>
              <li>• Absolute overlay positioning</li>
              <li>• Keyframe fade-in</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .search-shell {
          container-type: inline-size;
        }

        .search-results {
          display: grid;
          gap: 0.375rem;
          margin-top: 0.75rem;
        }

        .search-shell[data-pattern="command-palette"] {
          display: grid;
          place-items: start center;
          padding-top: 12%;
        }

        .command-palette {
          width: min(92%, 420px);
          border-radius: 1rem;
          box-shadow: 0 20px 60px hsl(var(--foreground) / 0.15);
        }

        .command-kbd {
          font-family: ui-monospace, monospace;
          border-radius: 0.375rem;
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }

        .filter-chip {
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .filter-chip[data-active="true"] {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
        }

        .expand-search {
          display: flex;
          align-items: center;
          border-radius: 999px;
          border: 1px solid hsl(var(--border));
          overflow: hidden;
          transition: width 0.3s ease;
        }

        .expand-search[data-open="false"] {
          width: 2.25rem;
        }

        .expand-search[data-open="true"] {
          width: 100%;
        }

        .fullscreen-search {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-rows: auto 1fr;
          background: hsl(var(--card));
          animation: search-fade-in 0.2s ease;
        }

        @keyframes search-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
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
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-card">{children}</div>
    </div>
  );
}
