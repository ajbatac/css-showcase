import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, GripVertical, MoreHorizontal, Trash2, Archive } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/lists")({
  head: () => ({
    meta: [
      { title: "Lists — Modern CSS Demos" },
      {
        name: "description",
        content:
          "List and feed patterns — two-column master/detail, media rows, grouped sticky sections, avatar rows, and swipe actions — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Lists — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Responsive list layouts with detail previews, thumbnails, grouped sections, and swipe-to-reveal actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "two-column"
  | "media-rows"
  | "grouped-sections"
  | "avatar-rows"
  | "swipe-actions";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "two-column", label: "Two-column", desc: "List plus a detail preview pane" },
    { id: "media-rows", label: "Media rows", desc: "Thumbnail, title, meta, action" },
    { id: "grouped-sections", label: "Grouped sections", desc: "Sticky section headings" },
  ],
  ipad: [
    { id: "media-rows", label: "Media rows", desc: "Thumbnail, title, meta, action" },
    { id: "grouped-sections", label: "Grouped sections", desc: "Sticky section headings" },
  ],
  mobile: [
    { id: "avatar-rows", label: "Avatar rows", desc: "Avatar, title, subtitle, chevron" },
    { id: "swipe-actions", label: "Swipe actions", desc: "Handle reveals an action strip" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "two-column": `/* Two-column list + detail preview */
.list-two-col {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  height: 100%;
}

.list-two-col .list-pane {
  border-right: 1px solid var(--border);
  overflow-y: auto;
}

.list-two-col .item.active {
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
}`,
  "media-rows": `/* Media rows: thumbnail + title + meta + action */
.list-media .row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding-block: 0.5rem;
}

.list-media .thumb {
  border-radius: 0.5rem;
  background: var(--muted);
}`,
  "grouped-sections": `/* Grouped list with sticky section headings */
.list-grouped .section-heading {
  position: sticky;
  top: 0;
  background: color-mix(in oklch, var(--background) 92%, var(--muted));
  backdrop-filter: blur(4px);
  padding-block: 0.25rem;
  font-weight: 600;
}`,
  "avatar-rows": `/* Avatar rows with chevron */
.list-avatar .row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding-block: 0.5rem;
}

.list-avatar .avatar {
  border-radius: 9999px;
  background: var(--muted);
}`,
  "swipe-actions": `/* Row revealing an action strip via a handle */
.list-swipe .row {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

.list-swipe .content {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.list-swipe .row[data-open="true"] .content {
  transform: translateX(-5.5rem);
}

.list-swipe .actions {
  position: absolute;
  inset-block: 0;
  right: 0;
  display: flex;
  width: 5.5rem;
}`,
};

const ITEMS = [
  { id: 1, title: "Quarterly report draft", meta: "Edited 2h ago", author: "Mina Cho" },
  { id: 2, title: "Design review notes", meta: "Edited yesterday", author: "Theo James" },
  { id: 3, title: "Onboarding checklist", meta: "Edited Mon", author: "Priya Raman" },
  { id: 4, title: "Roadmap v3", meta: "Edited last week", author: "Sam Ortiz" },
];

function ListsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "two-column",
      ipad: "media-rows",
      mobile: "avatar-rows",
    }),
  );
  const [activeId, setActiveId] = useState(ITEMS[0].id);
  const [openSwipeId, setOpenSwipeId] = useState<number | null>(null);

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const activeItem = ITEMS.find((i) => i.id === activeId) ?? ITEMS[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Lists that flow.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Feed and list layouts — two-column master/detail, media rows, grouped sticky
            sections, avatar rows, and swipe-to-reveal actions.
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
                className="lists-demo h-full w-full overflow-auto text-[9px] text-muted-foreground"
              >
                {pattern === "two-column" && (
                  <div className="list-two-col h-full">
                    <div className="list-pane">
                      {ITEMS.map((it) => (
                        <button
                          key={it.id}
                          onClick={() => setActiveId(it.id)}
                          className={`item block w-full border-b px-2 py-1.5 text-left ${
                            it.id === activeId ? "active" : ""
                          }`}
                        >
                          <p className="text-foreground">{it.title}</p>
                          <p>{it.meta}</p>
                        </button>
                      ))}
                    </div>
                    <div className="p-3">
                      <p className="mb-1 text-foreground font-semibold">{activeItem.title}</p>
                      <p className="mb-2">{activeItem.meta} · by {activeItem.author}</p>
                      <p>
                        Preview content for the selected item appears here, giving quick
                        context without navigating away from the list.
                      </p>
                    </div>
                  </div>
                )}
                {pattern === "media-rows" && (
                  <div className="list-media p-2">
                    {ITEMS.map((it) => (
                      <div key={it.id} className="row">
                        <div className="thumb h-8 w-8" />
                        <div className="min-w-0">
                          <p className="truncate text-foreground">{it.title}</p>
                          <p className="truncate">{it.meta}</p>
                        </div>
                        <MoreHorizontal className="h-3 w-3" />
                      </div>
                    ))}
                  </div>
                )}
                {pattern === "grouped-sections" && (
                  <div className="list-grouped h-full overflow-auto p-2">
                    <p className="section-heading">Today</p>
                    {ITEMS.slice(0, 2).map((it) => (
                      <div key={it.id} className="border-b py-1.5">
                        <p className="text-foreground">{it.title}</p>
                        <p>{it.meta}</p>
                      </div>
                    ))}
                    <p className="section-heading">Earlier</p>
                    {ITEMS.slice(2).map((it) => (
                      <div key={it.id} className="border-b py-1.5">
                        <p className="text-foreground">{it.title}</p>
                        <p>{it.meta}</p>
                      </div>
                    ))}
                  </div>
                )}
                {pattern === "avatar-rows" && (
                  <div className="list-avatar p-2">
                    {ITEMS.map((it) => (
                      <div key={it.id} className="row">
                        <div className="avatar h-6 w-6 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-foreground">{it.author}</p>
                          <p className="truncate">{it.title}</p>
                        </div>
                        <ChevronRight className="h-3 w-3 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
                {pattern === "swipe-actions" && (
                  <div className="list-swipe p-2">
                    {ITEMS.map((it) => (
                      <div key={it.id} className="row" data-open={openSwipeId === it.id}>
                        <div className="content w-full items-center gap-2 bg-card px-1 py-2">
                          <button
                            onClick={() =>
                              setOpenSwipeId(openSwipeId === it.id ? null : it.id)
                            }
                            className="shrink-0"
                          >
                            <GripVertical className="h-3 w-3" />
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-foreground">{it.title}</p>
                            <p className="truncate">{it.meta}</p>
                          </div>
                        </div>
                        <div className="actions">
                          <div className="flex flex-1 items-center justify-center bg-accent">
                            <Archive className="h-3 w-3" />
                          </div>
                          <div className="flex flex-1 items-center justify-center bg-destructive/80 text-destructive-foreground">
                            <Trash2 className="h-3 w-3" />
                          </div>
                        </div>
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
                list-{pattern}.css
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
              <li>• CSS grid two-column layout</li>
              <li>• position: sticky headings</li>
              <li>• backdrop-filter blur</li>
              <li>• transform: translateX reveal</li>
              <li>• color-mix() active states</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .list-two-col {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
          height: 100%;
        }

        .list-two-col .list-pane {
          border-right: 1px solid var(--border);
          overflow-y: auto;
        }

        .list-two-col .item.active {
          background: color-mix(in oklch, var(--foreground) 8%, transparent);
        }

        .list-media .row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border);
          padding-block: 0.5rem;
        }

        .list-media .thumb {
          border-radius: 0.5rem;
          background: var(--muted);
        }

        .list-grouped .section-heading {
          position: sticky;
          top: 0;
          background: color-mix(in oklch, var(--background) 92%, var(--muted));
          backdrop-filter: blur(4px);
          padding-block: 0.25rem;
          font-weight: 600;
        }

        .list-avatar .row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border);
          padding-block: 0.5rem;
        }

        .list-avatar .avatar {
          border-radius: 9999px;
          background: var(--muted);
        }

        .list-swipe .row {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }

        .list-swipe .content {
          display: flex;
          transition: transform 0.2s ease;
        }

        .list-swipe .row[data-open="true"] .content {
          transform: translateX(-5.5rem);
        }

        .list-swipe .actions {
          position: absolute;
          inset-block: 0;
          right: 0;
          display: flex;
          width: 5.5rem;
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
