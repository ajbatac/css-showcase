import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, User, Settings, LogOut, CreditCard, Layers, BarChart, Users, Puzzle } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/dropdowns")({
  head: () => ({
    meta: [
      { title: "Dropdowns — Menus, Selects & Action Sheets" },
      {
        name: "description",
        content:
          "Compact menu or mega menu on desktop, popover or centered dialog picker on iPad, bottom sheet or inline expanding list on mobile — driven by container queries.",
      },
      { property: "og:title", content: "Dropdowns — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Multiple dropdown design patterns per device: compact menu, mega menu, popover, dialog picker, bottom sheet, inline list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DropdownsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "compact" | "mega" | "popover" | "dialog" | "sheet" | "inline";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "compact", label: "Anchored compact menu", desc: "Small menu under the trigger" },
    { id: "mega", label: "Mega menu", desc: "Wide two-column panel" },
  ],
  ipad: [
    { id: "popover", label: "Anchored popover", desc: "Floating panel near the trigger" },
    { id: "dialog", label: "Centered dialog picker", desc: "Modal-style picker over a scrim" },
  ],
  mobile: [
    { id: "sheet", label: "Bottom sheet", desc: "Slides up from the bottom" },
    { id: "inline", label: "Inline expanding list", desc: "Expands in place, no overlay" },
  ],
};

const OPTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logout", label: "Sign out", icon: LogOut },
];

const MEGA_COLUMNS = [
  {
    heading: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    heading: "Workspace",
    items: [
      { id: "teams", label: "Teams", icon: Users },
      { id: "analytics", label: "Analytics", icon: BarChart },
      { id: "integrations", label: "Integrations", icon: Puzzle },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const CSS_BY_PATTERN: Record<Pattern, string> = {
  compact: `/* Anchored compact menu */
.dd-menu { position: relative; container-type: inline-size; }

.dd-panel {
  position: absolute;
  inset: 100% 0 auto auto;
  min-width: 10rem;
  border-radius: .5rem;
  animation: pop-in .18s ease both;
}

@keyframes pop-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
  mega: `/* Wide two-column mega menu */
.dd-panel--mega {
  position: absolute;
  inset: 100% auto auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  width: min(90cqw, 32rem);
  border-radius: .75rem;
  animation: pop-in .18s ease both;
}`,
  popover: `/* Anchored popover */
.dd-panel {
  position: absolute;
  top: 100%; right: 0;
  margin-top: .25rem;
  min-width: 12rem;
  border-radius: .75rem;
  animation: pop-in .18s ease both;
}`,
  dialog: `/* Centered dialog picker */
.dd-scrim {
  position: absolute; inset: 0;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / .45);
}

.dd-panel--dialog {
  width: min(90cqw, 20rem);
  border-radius: 1rem;
  animation: dialog-in .2s ease both;
}

@keyframes dialog-in {
  from { opacity: 0; transform: scale(.96); }
  to   { opacity: 1; transform: scale(1); }
}`,
  sheet: `/* Bottom sheet */
.dd-panel {
  position: absolute;
  inset: auto 0 0 0;
  border-radius: 1rem 1rem 0 0;
  animation: sheet-up .25s ease both;
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}`,
  inline: `/* Inline expanding list, no overlay */
.dd-inline {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .25s ease;
}
.dd-inline[data-open="true"] {
  grid-template-rows: 1fr;
}
.dd-inline > * { overflow: hidden; }`,
};

function DropdownsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS
      ? (initial.device as Device)
      : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
    desktop: "compact",
    ipad: "popover",
    mobile: "sheet",
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
            One trigger. Many menu patterns.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Pick a device, then pick a design pattern for that device —
            compact menu or mega menu on desktop, popover or dialog picker on
            iPad, bottom sheet or inline list on mobile — driven by{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">container-type</code>.
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
            <DeviceFrame device={device} pattern={pattern} />
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
                    onClick={() =>
                      setPatterns((prev) => ({ ...prev, [device]: o.id }))
                    }
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">
                        {o.label}
                      </span>
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
                dropdown-{pattern}.css
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
              <li>• Positional swaps</li>
              <li>• Keyframe animations</li>
              <li>• aspect-ratio frames</li>
              <li>• Semantic tokens</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeviceFrame({ device, pattern }: { device: Device; pattern: Pattern }) {
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
      <DropdownApp pattern={pattern} />
    </div>
  );
}

function Content() {
  return (
    <div className="flex-1 space-y-1.5 p-2">
      <div className="h-2 w-1/2 rounded bg-foreground/60" />
      <div className="h-1.5 w-full rounded bg-muted-foreground/30" />
      <div className="h-1.5 w-5/6 rounded bg-muted-foreground/30" />
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="h-8 rounded bg-muted" />
        <div className="h-8 rounded bg-muted" />
      </div>
    </div>
  );
}

function OptionList({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <ul className="space-y-0.5">
      {OPTIONS.map((o) => {
        const active = selected === o.id;
        return (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => onSelect(o.id)}
              className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 rounded px-1.5 py-1 text-[8px] font-medium transition ${
                active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <o.icon className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate text-left">{o.label}</span>
              </span>
              {active && <Check className="h-2.5 w-2.5 shrink-0" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function TriggerChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b bg-muted/40 px-2 py-1.5">
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-foreground/30" />
        <div className="h-1.5 w-10 rounded bg-foreground/40" />
      </div>
      {children}
    </div>
  );
}

function DropdownApp({ pattern }: { pattern: Pattern }) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("profile");

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="flex items-center gap-1 rounded border bg-background px-1 py-0.5 text-[8px] font-semibold text-foreground shadow-sm"
    >
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span>Account</span>
      <ChevronDown className="h-2 w-2" />
    </button>
  );

  if (pattern === "mega") {
    return (
      <div className="dd-app relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
        <TriggerChrome>
          <div className="relative">
            {trigger}
            {open && (
              <div className="dd-panel--mega absolute right-0 top-full z-30 mt-1 grid w-[min(94cqw,220px)] grid-cols-2 gap-2 rounded-lg border bg-card p-1.5 shadow-xl">
                {MEGA_COLUMNS.map((col) => (
                  <div key={col.heading} className="min-w-0">
                    <div className="mb-0.5 truncate text-[6px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {col.heading}
                    </div>
                    <ul className="space-y-0.5">
                      {col.items.map((it) => (
                        <li key={it.id} className="flex items-center gap-1 rounded px-1 py-0.5 text-[7px] font-medium text-foreground hover:bg-muted">
                          <it.icon className="h-2 w-2 shrink-0" />
                          <span className="truncate">{it.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TriggerChrome>
        <Content />
      </div>
    );
  }

  if (pattern === "dialog") {
    return (
      <div className="dd-app relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
        <TriggerChrome>{trigger}</TriggerChrome>
        <Content />
        {open && (
          <div
            className="dd-scrim absolute inset-0 z-30 grid place-items-center bg-black/45"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="dd-panel--dialog w-[min(88%,180px)] rounded-xl border bg-card p-1.5 shadow-2xl"
              style={{ animation: "dialog-in .2s ease both" }}
            >
              <div className="mb-1 px-0.5 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground">
                Choose account section
              </div>
              <OptionList selected={selected} onSelect={setSelected} />
            </div>
          </div>
        )}
        <style>{`
          @keyframes dialog-in {
            from { opacity: 0; transform: scale(.96); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (pattern === "inline") {
    return (
      <div className="dd-app relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
        <TriggerChrome>{trigger}</TriggerChrome>
        <div
          className="dd-inline grid overflow-hidden border-b bg-muted/20"
          data-open={open}
          style={{
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows .25s ease",
          }}
        >
          <div className="overflow-hidden">
            <div className="p-1.5">
              <OptionList selected={selected} onSelect={setSelected} />
            </div>
          </div>
        </div>
        <Content />
      </div>
    );
  }

  if (pattern === "sheet") {
    return (
      <div className="dd-app relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
        <TriggerChrome>{trigger}</TriggerChrome>
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-20 bg-foreground/20"
          />
        )}
        <Content />
        {open && (
          <div
            className="dd-panel absolute inset-x-0 bottom-0 z-30 rounded-t-xl border bg-card p-1.5 shadow-xl"
            style={{ animation: "sheet-up .25s ease both" }}
          >
            <div className="mx-auto mb-1 h-1 w-8 rounded-full bg-muted-foreground/40" />
            <div className="mb-0.5 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground">
              Signed in as jane
            </div>
            <OptionList selected={selected} onSelect={setSelected} />
          </div>
        )}
        <style>{`
          @keyframes sheet-up {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // popover (ipad) and compact (desktop) default
  return (
    <div className="dd-app relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
      <TriggerChrome>
        <div className="dd-menu relative">
          {trigger}
          {open && (
            <div
              className="dd-panel absolute right-0 top-full z-30 mt-1 min-w-[6.5rem] rounded-lg border bg-card p-1 shadow-xl"
              style={{ animation: "pop-in .18s ease both" }}
            >
              <div className="mb-0.5 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground">
                Signed in as jane
              </div>
              <OptionList selected={selected} onSelect={setSelected} />
            </div>
          )}
        </div>
      </TriggerChrome>
      <Content />
      <style>{`
        @keyframes pop-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
