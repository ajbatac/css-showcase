import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronsUpDown, Search, X, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/selects")({
  head: () => ({
    meta: [
      { title: "Select Dropdowns & Multi-Select — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Single select, multi-select with chips, and searchable option lists morphed for mobile, iPad, and desktop using container queries.",
      },
      { property: "og:title", content: "Select Dropdowns & Multi-Select — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One select component reshaped for mobile, iPad, and desktop with CSS container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SelectsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "inline"
  | "twopane"
  | "combobox"
  | "popover"
  | "dialog"
  | "sheet"
  | "fullscreen";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "inline", label: "Inline anchored listbox", desc: "Compact dropdown below trigger" },
    { id: "twopane", label: "Two-pane with search", desc: "Search list + preview pane" },
    { id: "combobox", label: "Tag multi-select combobox", desc: "Type to filter, chips inline" },
  ],
  ipad: [
    { id: "popover", label: "Anchored popover", desc: "Dropdown pinned to trigger" },
    { id: "dialog", label: "Centered dialog", desc: "Modal picker with backdrop" },
  ],
  mobile: [
    { id: "sheet", label: "Bottom sheet", desc: "Slides up from the edge" },
    { id: "fullscreen", label: "Full-screen page", desc: "Dedicated picker screen" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  inline: `/* Inline anchored listbox */
.select-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: .25rem;
  min-width: 8rem;
  border-radius: .5rem;
}`,
  twopane: `/* Two-pane picker with search */
.select-panel--twopane {
  position: absolute;
  top: 100%;
  left: 0;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  width: max(220%, 18rem);
  border-radius: .75rem;
}

.select-panel--twopane .pane-list { border-right: 1px solid var(--border); }`,
  combobox: `/* Tag multi-select combobox */
.combobox-input {
  display: flex;
  flex-wrap: wrap;
  gap: .25rem;
  border-radius: .5rem;
}

.combobox-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: .25rem;
}`,
  popover: `/* Anchored popover (iPad) */
.select-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: .25rem;
  min-width: 10rem;
  border-radius: .625rem;
  animation: pop-in .18s ease both;
}

@keyframes pop-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
  dialog: `/* Centered dialog picker */
.select-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in oklab, var(--foreground) 30%, transparent);
}

.select-dialog {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
}

.select-dialog__panel {
  width: min(80cqw, 22rem);
  border-radius: 1rem;
}`,
  sheet: `/* Bottom sheet (mobile) */
.select-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: .75rem .75rem 0 0;
  animation: sheet-up .25s ease both;
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}`,
  fullscreen: `/* Full-screen picker page (mobile) */
.select-fullscreen {
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-rows: auto auto 1fr;
  background: var(--card);
}`,
};

type Option = { id: string; label: string };

const ROLES: Option[] = [
  { id: "designer", label: "Designer" },
  { id: "developer", label: "Developer" },
  { id: "manager", label: "Product Manager" },
  { id: "writer", label: "Technical Writer" },
];

const TAGS: Option[] = [
  { id: "css", label: "CSS" },
  { id: "react", label: "React" },
  { id: "accessibility", label: "A11y" },
  { id: "performance", label: "Performance" },
  { id: "typescript", label: "TypeScript" },
  { id: "animation", label: "Animation" },
];

function SelectsDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>({
    desktop: "inline",
    ipad: "popover",
    mobile: "sheet",
  });
  const [role, setRole] = useState<string>("developer");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(["react", "css"]));
  const [openPanel, setOpenPanel] = useState<"role" | "tags" | null>("role");
  const [search, setSearch] = useState("");

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One picker. Many patterns per device.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Pick a device, then pick a design pattern for that device — desktop offers inline,
            two-pane, and combobox pickers; mobile offers a bottom sheet and a full-screen page.
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
              <SelectApp
                pattern={pattern}
                role={role}
                setRole={setRole}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                openPanel={openPanel}
                setOpenPanel={setOpenPanel}
                search={search}
                setSearch={setSearch}
              />
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
                  onClick={() => {
                    setDevice(d.id);
                    setOpenPanel(null);
                  }}
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
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {device} design patterns
            </p>
            <div role="tablist" aria-label="Design pattern" className="grid gap-2">
              {options.map((o) => {
                const active = pattern === o.id;
                return (
                  <button
                    key={o.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setPatterns((prev) => ({ ...prev, [device]: o.id }));
                      setOpenPanel(null);
                    }}
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
                selects-{pattern}.css
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
              <li>• Container queries</li>
              <li>• CSS Grid responsive columns</li>
              <li>• Custom select panels</li>
              <li>• Chip / tag styling</li>
              <li>• Mobile bottom sheet</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeviceFrame({
  device,
  children,
}: {
  device: Device;
  children: React.ReactNode;
}) {
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

function SelectApp({
  pattern,
  role,
  setRole,
  selectedTags,
  toggleTag,
  openPanel,
  setOpenPanel,
  search,
  setSearch,
}: {
  pattern: Pattern;
  role: string;
  setRole: (id: string) => void;
  selectedTags: Set<string>;
  toggleTag: (id: string) => void;
  openPanel: "role" | "tags" | null;
  setOpenPanel: (p: "role" | "tags" | null) => void;
  search: string;
  setSearch: (s: string) => void;
}) {
  const isOverlay = pattern === "dialog" || pattern === "fullscreen";
  const filteredRoles = ROLES.filter((r) =>
    r.label.toLowerCase().includes(search.toLowerCase())
  );
  const filteredTags = TAGS.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  const close = () => {
    setOpenPanel(null);
    setSearch("");
  };

  return (
    <div className="select-app relative h-full w-full overflow-auto p-3">
      <div className="grid gap-3">
        {/* Role select */}
        <div className="select-card rounded-xl border bg-card p-2.5">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Role
          </label>
          {pattern === "combobox" ? (
            <Combobox
              options={ROLES}
              multi={false}
              value={new Set([role])}
              onSelect={(id) => setRole(id)}
              onRemove={() => {}}
            />
          ) : (
            <div className="select-control relative">
              <button
                type="button"
                onClick={() => setOpenPanel(openPanel === "role" ? null : "role")}
                className="select-trigger flex w-full items-center justify-between rounded-lg border bg-background px-2 py-1.5 text-left text-xs font-medium"
              >
                <span>{ROLES.find((r) => r.id === role)?.label}</span>
                <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {openPanel === "role" && !isOverlay && (
                <PanelShell pattern={pattern}>
                  {pattern === "twopane" ? (
                    <TwoPane
                      options={filteredRoles}
                      search={search}
                      setSearch={setSearch}
                      selected={new Set([role])}
                      onSelect={(id) => {
                        setRole(id);
                        close();
                      }}
                    />
                  ) : (
                    <SimpleList
                      options={ROLES}
                      selected={new Set([role])}
                      onSelect={(id) => {
                        setRole(id);
                        close();
                      }}
                    />
                  )}
                </PanelShell>
              )}
            </div>
          )}

          {openPanel === "role" && isOverlay && (
            <OverlayShell pattern={pattern} title="Choose a role" onClose={close}>
              <Search className="mb-2 h-3 w-3 text-muted-foreground" />
              <SearchInput search={search} setSearch={setSearch} />
              <SimpleList
                options={filteredRoles}
                selected={new Set([role])}
                onSelect={(id) => {
                  setRole(id);
                  close();
                }}
              />
            </OverlayShell>
          )}
        </div>

        {/* Tags multi-select */}
        <div className="select-card rounded-xl border bg-card p-2.5">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Interests
          </label>
          {pattern === "combobox" ? (
            <Combobox
              options={TAGS}
              multi
              value={selectedTags}
              onSelect={toggleTag}
              onRemove={toggleTag}
            />
          ) : (
            <div className="select-control relative">
              <button
                type="button"
                onClick={() => setOpenPanel(openPanel === "tags" ? null : "tags")}
                className="select-trigger flex min-h-[2.25rem] w-full flex-wrap items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-left text-xs"
              >
                {selectedTags.size === 0 && (
                  <span className="text-muted-foreground">Choose tags…</span>
                )}
                {Array.from(selectedTags).map((id) => {
                  const tag = TAGS.find((t) => t.id === id)!;
                  return (
                    <span
                      key={id}
                      className="chip inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {tag.label}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTag(id);
                        }}
                        className="chip-remove rounded-full hover:bg-primary/20"
                        aria-label={`Remove ${tag.label}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  );
                })}
                <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
              </button>

              {openPanel === "tags" && !isOverlay && (
                <PanelShell pattern={pattern}>
                  {pattern === "twopane" ? (
                    <TwoPane
                      options={filteredTags}
                      search={search}
                      setSearch={setSearch}
                      selected={selectedTags}
                      onSelect={toggleTag}
                    />
                  ) : (
                    <SimpleList options={TAGS} selected={selectedTags} onSelect={toggleTag} />
                  )}
                </PanelShell>
              )}
            </div>
          )}

          {openPanel === "tags" && isOverlay && (
            <OverlayShell pattern={pattern} title="Choose interests" onClose={close}>
              <SearchInput search={search} setSearch={setSearch} />
              <SimpleList options={filteredTags} selected={selectedTags} onSelect={toggleTag} />
            </OverlayShell>
          )}
        </div>
      </div>

      {openPanel && !isOverlay && pattern !== "combobox" && (
        <button
          type="button"
          aria-label="Close select"
          onClick={close}
          className="select-backdrop absolute inset-0 z-20 bg-foreground/20"
        />
      )}

      <style>{`
        .select-app { container-type: inline-size; }
      `}</style>
    </div>
  );
}

function SearchInput({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (s: string) => void;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1 rounded-md border bg-background px-1.5 py-1">
      <Search className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search…"
        className="min-w-0 flex-1 bg-transparent text-[10px] outline-none"
      />
    </div>
  );
}

function SimpleList({
  options,
  selected,
  onSelect,
}: {
  options: Option[];
  selected: Set<string>;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="max-h-40 space-y-0.5 overflow-y-auto p-1">
      {options.map((o) => {
        const active = selected.has(o.id);
        return (
          <li key={o.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(o.id)}
              className={`flex w-full items-center justify-between gap-2 rounded px-1.5 py-1 text-left text-[10px] font-medium transition ${
                active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="min-w-0 truncate">{o.label}</span>
              {active && <Check className="h-3 w-3 shrink-0" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PanelShell({
  pattern,
  children,
}: {
  pattern: Pattern;
  children: React.ReactNode;
}) {
  if (pattern === "twopane") {
    return (
      <div className="select-panel select-panel--twopane absolute left-0 top-full z-30 mt-1 w-[220%] max-w-[24rem] overflow-hidden rounded-xl border bg-card shadow-lg">
        {children}
      </div>
    );
  }
  if (pattern === "sheet") {
    return (
      <div className="select-panel fixed inset-x-0 bottom-0 z-30 rounded-t-xl border bg-card p-2 shadow-lg">
        <div className="mx-auto mb-1 h-1 w-8 rounded-full bg-muted-foreground/40" />
        {children}
      </div>
    );
  }
  // inline / popover
  return (
    <div className="select-panel absolute left-0 top-full z-30 mt-1 min-w-[8rem] overflow-hidden rounded-lg border bg-card p-1 shadow-lg">
      {children}
    </div>
  );
}

function TwoPane({
  options,
  search,
  setSearch,
  selected,
  onSelect,
}: {
  options: Option[];
  search: string;
  setSearch: (s: string) => void;
  selected: Set<string>;
  onSelect: (id: string) => void;
}) {
  const active = options.find((o) => selected.has(o.id)) ?? options[0];
  return (
    <div className="grid grid-cols-2">
      <div className="pane-list min-w-0 border-r p-1.5">
        <SearchInput search={search} setSearch={setSearch} />
        <SimpleList options={options} selected={selected} onSelect={onSelect} />
      </div>
      <div className="min-w-0 p-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
          Preview
        </p>
        <p className="mt-1 truncate text-[10px] font-semibold">{active?.label ?? "—"}</p>
        <p className="mt-1 text-[9px] text-muted-foreground">{selected.size} selected</p>
      </div>
    </div>
  );
}

function Combobox({
  options,
  multi,
  value,
  onSelect,
  onRemove,
}: {
  options: Option[];
  multi: boolean;
  value: Set<string>;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="select-control relative">
      <div className="combobox-input flex min-h-[2.25rem] w-full flex-wrap items-center gap-1 rounded-lg border bg-background px-2 py-1.5">
        {Array.from(value).map((id) => {
          const opt = options.find((o) => o.id === id);
          if (!opt) return null;
          return (
            <span
              key={id}
              className="chip inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
            >
              {opt.label}
              {multi && (
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  className="rounded-full hover:bg-primary/20"
                  aria-label={`Remove ${opt.label}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </span>
          );
        })}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder="Type to filter…"
          className="min-w-[3rem] flex-1 bg-transparent text-[10px] outline-none"
        />
      </div>
      {focused && (
        <div className="combobox-panel absolute left-0 top-full z-30 mt-1 w-full overflow-hidden rounded-lg border bg-card shadow-lg">
          <SimpleList
            options={filtered}
            selected={value}
            onSelect={(id) => {
              onSelect(id);
              setQuery("");
            }}
          />
        </div>
      )}
    </div>
  );
}

function OverlayShell({
  pattern,
  title,
  onClose,
  children,
}: {
  pattern: Pattern;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (pattern === "fullscreen") {
    return (
      <div className="select-fullscreen fixed inset-0 z-40 grid grid-rows-[auto_auto_1fr] bg-card">
        <div className="flex items-center gap-2 border-b px-2 py-1.5">
          <button type="button" onClick={onClose} aria-label="Back">
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <span className="truncate text-[10px] font-semibold">{title}</span>
        </div>
        <div className="p-2">{children}</div>
      </div>
    );
  }
  // dialog
  return (
    <>
      <button
        type="button"
        aria-label="Close select"
        onClick={onClose}
        className="select-backdrop fixed inset-0 z-30 bg-foreground/30"
      />
      <div className="select-dialog fixed inset-0 z-40 grid place-items-center p-4">
        <div className="select-dialog__panel w-full max-w-[80%] rounded-2xl border bg-card p-2.5 shadow-2xl">
          <p className="mb-1.5 truncate text-[10px] font-semibold">{title}</p>
          {children}
        </div>
      </div>
    </>
  );
}
