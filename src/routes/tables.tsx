import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch } from "@/lib/demo-state";

export const Route = createFileRoute("/tables")({
  head: () => ({
    meta: [
      { title: "Tables — CSS Showcase" },
      {
        name: "description",
        content:
          "Data table patterns — sticky headers, dense compact rows, grouped subtotals, horizontal scroll, and stacked card tables — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Tables — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Responsive data table layouts with clickable column sorting, sticky headers, and stacked mobile rows.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TablesDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "sticky-header"
  | "compact-dense"
  | "grouped"
  | "scroll-x"
  | "stacked-cards"
  | "two-line-rows";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "sticky-header", label: "Sticky header", desc: "Zebra rows, aligned numeric column" },
    { id: "compact-dense", label: "Compact dense", desc: "Dense rows with row actions" },
    { id: "grouped", label: "Grouped rows", desc: "Section headers with subtotals" },
  ],
  ipad: [
    { id: "sticky-header", label: "Sticky header", desc: "Zebra rows, aligned numeric column" },
    { id: "scroll-x", label: "Scroll-x", desc: "Horizontal scroll, sticky first column" },
  ],
  mobile: [
    { id: "stacked-cards", label: "Stacked cards", desc: "Each row as a label/value card" },
    { id: "two-line-rows", label: "Two-line rows", desc: "Title + meta line list rows" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "sticky-header": `/* Sticky header with zebra rows */
.table-sticky thead th {
  position: sticky;
  top: 0;
  background: var(--card);
  border-bottom: 1px solid var(--border);
}

.table-sticky tbody tr:nth-child(even) {
  background: color-mix(in oklch, var(--foreground) 4%, transparent);
}

.table-sticky td.numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}`,
  "compact-dense": `/* Compact dense rows with row actions */
.table-dense td, .table-dense th {
  padding-block: 0.25rem;
  line-height: 1.1;
}

.table-dense tr {
  border-bottom: 1px solid var(--border);
}

.table-dense .row-actions {
  opacity: 0;
  transition: opacity 0.15s ease;
}

.table-dense tr:hover .row-actions {
  opacity: 1;
}`,
  grouped: `/* Grouped section rows with subtotals */
.table-grouped .group-header td {
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
  font-weight: 600;
}

.table-grouped .subtotal-row td {
  border-top: 1px solid var(--border);
  font-weight: 600;
}`,
  "scroll-x": `/* Horizontal scroll with sticky first column */
.table-scroll-wrap {
  overflow-x: auto;
}

.table-scroll-wrap table {
  min-width: max-content;
}

.table-scroll-wrap th:first-child,
.table-scroll-wrap td:first-child {
  position: sticky;
  left: 0;
  background: var(--card);
  border-right: 1px solid var(--border);
}`,
  "stacked-cards": `/* Stacked label/value cards for mobile */
.table-card {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
}

.table-card .field {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding-block: 0.15rem;
}

.table-card .field .label {
  color: var(--muted-foreground);
}`,
  "two-line-rows": `/* Two-line list rows */
.table-two-line .row {
  border-bottom: 1px solid var(--border);
  padding-block: 0.5rem;
}

.table-two-line .title {
  font-weight: 600;
}

.table-two-line .meta {
  color: var(--muted-foreground);
  font-size: 0.8em;
}`,
};

const ROWS = [
  { id: 1, name: "Aurora Kit", sku: "AUR-001", stock: 128, price: 42.0 },
  { id: 2, name: "Basalt Chair", sku: "BAS-014", stock: 12, price: 189.5 },
  { id: 3, name: "Comet Lamp", sku: "COM-233", stock: 64, price: 58.99 },
  { id: 4, name: "Drift Mug", sku: "DRI-091", stock: 340, price: 14.25 },
  { id: 5, name: "Ember Rug", sku: "EMB-007", stock: 8, price: 220.0 },
];

function TablesDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "sticky-header",
      ipad: "sticky-header",
      mobile: "stacked-cards",
    }),
  );
  const [sortKey, setSortKey] = useState<"name" | "stock" | "price">("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const sorted = [...ROWS].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "string") return sortDir * av.localeCompare(bv as string);
    return sortDir * ((av as number) - (bv as number));
  });

  const toggleSort = (key: "name" | "stock" | "price") => {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const SortTh = ({
    k,
    children,
  }: {
    k: "name" | "stock" | "price";
    children: React.ReactNode;
  }) => (
    <th
      onClick={() => toggleSort(k)}
      className="cursor-pointer select-none whitespace-nowrap px-2 py-1.5 text-left font-semibold"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-2.5 w-2.5 opacity-60" />
      </span>
    </th>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Tables that scale.</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Data table layouts with clickable column sorting — sticky headers, dense rows, grouped
            subtotals, horizontal scroll, and stacked mobile cards.
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
              <div
                data-pattern={pattern}
                className="tables-demo h-full w-full overflow-auto p-2 text-[9px] text-muted-foreground"
              >
                {pattern === "sticky-header" && (
                  <div className="h-full overflow-auto">
                    <table className="table-sticky w-full border-collapse">
                      <thead>
                        <tr>
                          <SortTh k="name">Name</SortTh>
                          <th className="px-2 py-1.5 text-left font-semibold">SKU</th>
                          <SortTh k="stock">Stock</SortTh>
                          <SortTh k="price">Price</SortTh>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((r) => (
                          <tr key={r.id}>
                            <td className="px-2 py-1.5 text-foreground">{r.name}</td>
                            <td className="px-2 py-1.5">{r.sku}</td>
                            <td className="numeric px-2 py-1.5">{r.stock}</td>
                            <td className="numeric px-2 py-1.5">${r.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {pattern === "compact-dense" && (
                  <table className="table-dense w-full border-collapse">
                    <thead>
                      <tr>
                        <SortTh k="name">Name</SortTh>
                        <SortTh k="stock">Stock</SortTh>
                        <SortTh k="price">Price</SortTh>
                        <th className="px-2 py-1.5 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((r) => (
                        <tr key={r.id}>
                          <td className="px-2 py-1.5 text-foreground">{r.name}</td>
                          <td className="px-2 py-1.5 numeric">{r.stock}</td>
                          <td className="px-2 py-1.5 numeric">${r.price.toFixed(2)}</td>
                          <td className="px-2 py-1.5 text-right">
                            <span className="row-actions">
                              <MoreHorizontal className="ml-auto h-3 w-3" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {pattern === "grouped" && (
                  <table className="table-grouped w-full border-collapse">
                    <tbody>
                      <tr className="group-header">
                        <td className="px-2 py-1.5" colSpan={3}>
                          Home &amp; Living
                        </td>
                      </tr>
                      {sorted.slice(0, 3).map((r) => (
                        <tr key={r.id}>
                          <td className="px-2 py-1 pl-4 text-foreground">{r.name}</td>
                          <td className="px-2 py-1 numeric">{r.stock}</td>
                          <td className="px-2 py-1 numeric">${r.price.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="subtotal-row">
                        <td className="px-2 py-1 pl-4">Subtotal</td>
                        <td className="px-2 py-1 numeric" />
                        <td className="px-2 py-1 numeric">
                          $
                          {sorted
                            .slice(0, 3)
                            .reduce((s, r) => s + r.price, 0)
                            .toFixed(2)}
                        </td>
                      </tr>
                      <tr className="group-header">
                        <td className="px-2 py-1.5" colSpan={3}>
                          Lighting
                        </td>
                      </tr>
                      {sorted.slice(3).map((r) => (
                        <tr key={r.id}>
                          <td className="px-2 py-1 pl-4 text-foreground">{r.name}</td>
                          <td className="px-2 py-1 numeric">{r.stock}</td>
                          <td className="px-2 py-1 numeric">${r.price.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="subtotal-row">
                        <td className="px-2 py-1 pl-4">Subtotal</td>
                        <td className="px-2 py-1 numeric" />
                        <td className="px-2 py-1 numeric">
                          $
                          {sorted
                            .slice(3)
                            .reduce((s, r) => s + r.price, 0)
                            .toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {pattern === "scroll-x" && (
                  <div className="table-scroll-wrap h-full">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <SortTh k="name">Name</SortTh>
                          <th className="px-2 py-1.5 text-left font-semibold">SKU</th>
                          <th className="px-2 py-1.5 text-left font-semibold">Category</th>
                          <th className="px-2 py-1.5 text-left font-semibold">Warehouse</th>
                          <SortTh k="stock">Stock</SortTh>
                          <SortTh k="price">Price</SortTh>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((r) => (
                          <tr key={r.id}>
                            <td className="px-2 py-1.5 text-foreground">{r.name}</td>
                            <td className="whitespace-nowrap px-2 py-1.5">{r.sku}</td>
                            <td className="whitespace-nowrap px-2 py-1.5">Home &amp; Living</td>
                            <td className="whitespace-nowrap px-2 py-1.5">Warehouse 3</td>
                            <td className="numeric px-2 py-1.5">{r.stock}</td>
                            <td className="numeric px-2 py-1.5">${r.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {pattern === "stacked-cards" && (
                  <div className="grid gap-2">
                    {sorted.map((r) => (
                      <div key={r.id} className="table-card">
                        <p className="mb-1 text-foreground font-semibold">{r.name}</p>
                        <div className="field">
                          <span className="label">SKU</span>
                          <span>{r.sku}</span>
                        </div>
                        <div className="field">
                          <span className="label">Stock</span>
                          <span>{r.stock}</span>
                        </div>
                        <div className="field">
                          <span className="label">Price</span>
                          <span>${r.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {pattern === "two-line-rows" && (
                  <div className="table-two-line">
                    {sorted.map((r) => (
                      <div key={r.id} className="row flex items-center justify-between">
                        <div>
                          <p className="title text-foreground">{r.name}</p>
                          <p className="meta">
                            SKU {r.sku} · {r.stock} in stock
                          </p>
                        </div>
                        <span className="text-foreground">${r.price.toFixed(2)}</span>
                      </div>
                    ))}
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
                table-{pattern}.css
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
              <li>• position: sticky headers/columns</li>
              <li>• color-mix() zebra tints</li>
              <li>• tabular-nums alignment</li>
              <li>• overflow-x auto scrolling</li>
              <li>• group hover reveal</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .table-sticky thead th {
          position: sticky;
          top: 0;
          background: var(--card);
          border-bottom: 1px solid var(--border);
        }

        .table-sticky tbody tr:nth-child(even) {
          background: color-mix(in oklch, var(--foreground) 4%, transparent);
        }

        .table-sticky td.numeric,
        .table-dense td.numeric,
        .table-scroll-wrap td.numeric,
        .table-grouped td.numeric {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .table-dense tr {
          border-bottom: 1px solid var(--border);
        }

        .table-dense .row-actions {
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .table-dense tr:hover .row-actions {
          opacity: 1;
        }

        .table-grouped .group-header td {
          background: color-mix(in oklch, var(--foreground) 6%, transparent);
          font-weight: 600;
        }

        .table-grouped .subtotal-row td {
          border-top: 1px solid var(--border);
          font-weight: 600;
        }

        .table-scroll-wrap {
          overflow-x: auto;
        }

        .table-scroll-wrap table {
          min-width: max-content;
        }

        .table-scroll-wrap th:first-child,
        .table-scroll-wrap td:first-child {
          position: sticky;
          left: 0;
          background: var(--card);
          border-right: 1px solid var(--border);
        }

        .table-card {
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
        }

        .table-card .field {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          padding-block: 0.15rem;
        }

        .table-card .field .label {
          color: var(--muted-foreground);
        }

        .table-two-line .row {
          border-bottom: 1px solid var(--border);
          padding-block: 0.5rem;
        }

        .table-two-line .title {
          font-weight: 600;
        }

        .table-two-line .meta {
          color: var(--muted-foreground);
          font-size: 0.8em;
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
      <div className="h-full w-full overflow-hidden rounded-lg bg-card">{children}</div>
    </div>
  );
}
