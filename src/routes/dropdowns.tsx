import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, User, Settings, LogOut, CreditCard } from "lucide-react";

export const Route = createFileRoute("/dropdowns")({
  head: () => ({
    meta: [
      { title: "Dropdowns — Menus, Selects & Action Sheets" },
      {
        name: "description",
        content:
          "Dropdown menu on desktop, popover on iPad, native-style action sheet on mobile — one component, three shapes via container queries.",
      },
      { property: "og:title", content: "Dropdowns — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Dropdown, popover, and action sheet variants across desktop, iPad, and mobile.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DropdownsDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const OPTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logout", label: "Sign out", icon: LogOut },
];

const CSS_CODE = `.dd-menu {
  container-type: inline-size;
  position: relative;
}

/* Mobile default: bottom sheet */
.dd-panel {
  position: fixed;
  inset: auto 0 0 0;
  border-radius: 1rem 1rem 0 0;
  animation: sheet-up .25s ease both;
}

/* iPad: floating popover, anchored */
@container (min-width: 480px) {
  .dd-panel {
    position: absolute;
    inset: 100% 0 auto auto;
    min-width: 12rem;
    border-radius: .75rem;
    animation: pop-in .18s ease both;
  }
}

/* Desktop: compact dropdown */
@container (min-width: 720px) {
  .dd-panel { min-width: 10rem; border-radius: .5rem; }
}

@keyframes sheet-up { from { transform: translateY(100%); } }
@keyframes pop-in   { from { opacity: 0; transform: translateY(-4px); } }`;

function DropdownsDemo() {
  const [device, setDevice] = useState<Device>("mobile");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One dropdown. Three shapes.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Compact dropdown on desktop, anchored popover on iPad, native-style bottom
            sheet on mobile — driven by{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">container-type</code>{" "}
            and one panel.
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
              {device}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device} />
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

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">dropdown.css</span>
              <button
                onClick={() => navigator.clipboard?.writeText(CSS_CODE)}
                className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto bg-card px-4 py-4 text-[11px] leading-relaxed sm:text-xs">
              <code>{CSS_CODE}</code>
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

function DeviceFrame({ device }: { device: Device }) {
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
      <DropdownApp />
    </div>
  );
}

function DropdownApp() {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("profile");

  return (
    <div className="dd-app relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
      {/* Fake app chrome */}
      <div className="flex items-center justify-between border-b bg-muted/40 px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-foreground/30" />
          <div className="h-1.5 w-10 rounded bg-foreground/40" />
        </div>

        <div className="dd-menu relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 rounded border bg-background px-1 py-0.5 text-[8px] font-semibold text-foreground shadow-sm"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Account</span>
            <ChevronDown className="h-2 w-2" />
          </button>

          {open && (
            <div className="dd-panel z-30 border bg-card p-1 shadow-xl">
              <div className="dd-handle mx-auto mb-1 h-1 w-8 rounded-full bg-muted-foreground/40" />
              <div className="mb-0.5 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-muted-foreground">
                Signed in as jane
              </div>
              <ul className="space-y-0.5">
                {OPTIONS.map((o) => {
                  const active = selected === o.id;
                  return (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(o.id)}
                        className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[8px] font-medium transition ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <o.icon className="h-2.5 w-2.5 shrink-0" />
                        <span className="flex-1 text-left">{o.label}</span>
                        {active && <Check className="h-2.5 w-2.5" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for sheet on mobile */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="dd-backdrop absolute inset-0 z-20 bg-foreground/20"
        />
      )}

      {/* Content */}
      <div className="flex-1 space-y-1.5 p-2">
        <div className="h-2 w-1/2 rounded bg-foreground/60" />
        <div className="h-1.5 w-full rounded bg-muted-foreground/30" />
        <div className="h-1.5 w-5/6 rounded bg-muted-foreground/30" />
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded bg-muted" />
          <div className="h-8 rounded bg-muted" />
        </div>
      </div>

      <style>{`
        /* Mobile-first: bottom sheet */
        .dd-panel {
          position: absolute;
          left: 0; right: 0; bottom: 0; top: auto;
          border-radius: .75rem .75rem 0 0;
          min-width: 0;
          animation: sheet-up .25s ease both;
        }
        .dd-handle { display: block; }

        /* iPad+ : anchored popover, hide backdrop & handle */
        @container (min-width: 380px) {
          .dd-panel {
            position: absolute;
            top: 100%; right: 0; left: auto; bottom: auto;
            margin-top: .25rem;
            min-width: 6.5rem;
            border-radius: .5rem;
            animation: pop-in .18s ease both;
          }
          .dd-handle { display: none; }
          .dd-backdrop { display: none; }
        }

        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
