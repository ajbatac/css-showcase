import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CircleHelp, Info } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/tooltips")({
  head: () => ({
    meta: [
      { title: "Tooltips & Popovers — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Tooltip and popover-hint patterns — hover arrows, rich hover cards, inline help icons, tap bubbles, long-press sheets, and persistent helper text — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Tooltips & Popovers — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Accessible tooltip patterns triggered by hover, focus, and tap, with aria-describedby wiring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TooltipsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "hover-arrow"
  | "rich-card"
  | "inline-help"
  | "tap-bubble"
  | "long-press-sheet"
  | "helper-text";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "hover-arrow", label: "Hover arrow tooltip", desc: "Dark tooltip with CSS arrow above trigger" },
    { id: "rich-card", label: "Rich hover card", desc: "Wider card with title, body, and link" },
    { id: "inline-help", label: "Inline help icons", desc: "Question-mark tooltips inside a form" },
  ],
  ipad: [
    { id: "tap-bubble", label: "Tap bubble", desc: "Tap to reveal, tap outside to dismiss" },
    { id: "inline-help", label: "Inline help icons", desc: "Question-mark tooltips inside a form" },
  ],
  mobile: [
    { id: "long-press-sheet", label: "Long-press sheet", desc: "Tap info icon opens a bottom sheet" },
    { id: "helper-text", label: "Persistent helper text", desc: "Inline helper text instead of tooltips" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "hover-arrow": `/* Dark tooltip with CSS arrow */
.tip-wrap { position: relative; display: inline-block; }

.tip-bubble {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: var(--foreground);
  color: var(--background);
  padding: 0.35rem 0.6rem;
  border-radius: 0.4rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s ease;
}

.tip-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--foreground);
}

.tip-wrap:hover .tip-bubble,
.tip-wrap:focus-within .tip-bubble {
  opacity: 1;
}`,
  "rich-card": `/* Wider rich hover card */
.hover-card-wrap { position: relative; display: inline-block; }

.hover-card {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 16rem;
  background: var(--popover);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.75rem;
  box-shadow: 0 8px 24px color-mix(in oklch, var(--foreground) 12%, transparent);
  opacity: 0;
  transform: translateY(-4px);
  pointer-events: none;
  transition: opacity .15s ease, transform .15s ease;
}

.hover-card-wrap:hover .hover-card,
.hover-card-wrap:focus-within .hover-card {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}`,
  "inline-help": `/* Inline question-mark help tooltips */
.help-icon-wrap { position: relative; display: inline-flex; }

.help-tip {
  position: absolute;
  bottom: calc(100% + 0.4rem);
  left: 50%;
  transform: translateX(-50%);
  width: 12rem;
  background: var(--popover);
  color: var(--popover-foreground);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 0.65rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s ease;
  z-index: 10;
}

.help-icon-wrap:hover .help-tip,
.help-icon-wrap:focus-within .help-tip {
  opacity: 1;
}`,
  "tap-bubble": `/* Tap-triggered bubble (touch devices) */
.tap-bubble-wrap { position: relative; display: inline-block; }

.tap-bubble {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: var(--popover);
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  padding: 0.5rem 0.75rem;
  white-space: nowrap;
  box-shadow: 0 6px 16px color-mix(in oklch, var(--foreground) 10%, transparent);
}

/* visibility toggled via aria-expanded + JS state, not CSS-only */`,
  "long-press-sheet": `/* Info icon opens bottom sheet */
.info-sheet-backdrop {
  position: absolute;
  inset: 0;
  background: color-mix(in oklch, var(--foreground) 40%, transparent);
}

.info-sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--popover);
  border-top: 1px solid var(--border);
  border-radius: 1rem 1rem 0 0;
  padding: 0.9rem;
  transform: translateY(0);
  transition: transform .2s ease;
}`,
  "helper-text": `/* Persistent inline helper text */
.helper-field .helper-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.65rem;
  color: var(--muted-foreground);
}`,
};

function TooltipsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "hover-arrow",
      ipad: "tap-bubble",
      mobile: "long-press-sheet",
    }),
  );
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Tooltips that stay out of the way.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Hover and focus-triggered hints, keyboard accessible with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">aria-describedby</code>,
            plus touch-friendly tap bubbles and bottom sheets for smaller screens.
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
                className="tooltips-demo h-full w-full overflow-auto p-4 text-[9px] text-muted-foreground"
              >
                {pattern === "hover-arrow" && (
                  <div className="flex h-full items-center justify-center">
                    <span className="tip-wrap">
                      <button
                        aria-describedby="tip-arrow-1"
                        className="rounded-md border border-border bg-card px-3 py-1.5 text-[10px] font-semibold text-foreground"
                      >
                        Save changes
                      </button>
                      <span role="tooltip" id="tip-arrow-1" className="tip-bubble">
                        Ctrl+S to save
                      </span>
                    </span>
                  </div>
                )}
                {pattern === "rich-card" && (
                  <div className="flex h-full items-start justify-center pt-6">
                    <span className="hover-card-wrap">
                      <button
                        aria-describedby="rich-card-1"
                        className="rounded-md border border-border bg-card px-3 py-1.5 text-[10px] font-semibold text-foreground underline decoration-dotted"
                      >
                        @acme-labs
                      </button>
                      <span role="tooltip" id="rich-card-1" className="hover-card text-left">
                        <span className="mb-1 block text-xs font-semibold text-foreground">
                          Acme Labs
                        </span>
                        <span className="mb-2 block text-[10px] text-muted-foreground">
                          Design systems &amp; developer tooling. Building in the open since 2019.
                        </span>
                        <span className="text-[10px] font-medium text-primary">View profile →</span>
                      </span>
                    </span>
                  </div>
                )}
                {pattern === "inline-help" && (
                  <form className="space-y-3">
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 text-foreground">
                        API key
                        <span className="help-icon-wrap">
                          <button
                            type="button"
                            aria-describedby="help-api"
                            className="text-muted-foreground"
                          >
                            <CircleHelp className="h-3 w-3" />
                          </button>
                          <span role="tooltip" id="help-api" className="help-tip">
                            Found in Settings → Developer → API keys.
                          </span>
                        </span>
                      </span>
                      <input
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-[10px] text-foreground"
                        placeholder="sk-live-..."
                        readOnly
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 text-foreground">
                        Webhook URL
                        <span className="help-icon-wrap">
                          <button
                            type="button"
                            aria-describedby="help-webhook"
                            className="text-muted-foreground"
                          >
                            <CircleHelp className="h-3 w-3" />
                          </button>
                          <span role="tooltip" id="help-webhook" className="help-tip">
                            We POST events here as JSON.
                          </span>
                        </span>
                      </span>
                      <input
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-[10px] text-foreground"
                        placeholder="https://example.com/hook"
                        readOnly
                      />
                    </label>
                  </form>
                )}
                {pattern === "tap-bubble" && (
                  <div className="flex h-full items-start justify-center pt-8">
                    <span className="tap-bubble-wrap">
                      <button
                        aria-expanded={bubbleOpen}
                        aria-describedby={bubbleOpen ? "tap-bubble-1" : undefined}
                        onClick={() => setBubbleOpen((v) => !v)}
                        className="rounded-full border border-border bg-card p-2 text-foreground"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                      {bubbleOpen && (
                        <span role="tooltip" id="tap-bubble-1" className="tap-bubble text-foreground">
                          Synced 2 minutes ago
                        </span>
                      )}
                    </span>
                    {bubbleOpen && (
                      <button
                        aria-label="Dismiss"
                        onClick={() => setBubbleOpen(false)}
                        className="absolute inset-0 h-full w-full cursor-default"
                        style={{ zIndex: -1 }}
                        tabIndex={-1}
                      />
                    )}
                  </div>
                )}
                {pattern === "long-press-sheet" && (
                  <div className="relative flex h-full items-start justify-center pt-6">
                    <button
                      aria-expanded={sheetOpen}
                      onClick={() => setSheetOpen(true)}
                      className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-foreground"
                    >
                      <Info className="h-3.5 w-3.5" /> Storage limit
                    </button>
                    {sheetOpen && (
                      <>
                        <div className="info-sheet-backdrop" onClick={() => setSheetOpen(false)} />
                        <div role="dialog" aria-label="Storage limit info" className="info-sheet">
                          <p className="mb-1 text-xs font-semibold text-foreground">Storage limit</p>
                          <p className="mb-3 text-[10px] text-muted-foreground">
                            Free plans include 5GB. Upgrade any time to increase this limit.
                          </p>
                          <button
                            onClick={() => setSheetOpen(false)}
                            className="w-full rounded-md bg-primary py-1.5 text-[10px] font-semibold text-primary-foreground"
                          >
                            Got it
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {pattern === "helper-text" && (
                  <form className="space-y-3">
                    <label className="helper-field block">
                      <span className="mb-1 block text-foreground">Display name</span>
                      <input
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-[10px] text-foreground"
                        placeholder="Jane Doe"
                        readOnly
                      />
                      <span className="helper-text">Shown on your public profile.</span>
                    </label>
                    <label className="helper-field block">
                      <span className="mb-1 block text-foreground">Password</span>
                      <input
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-[10px] text-foreground"
                        placeholder="••••••••"
                        readOnly
                      />
                      <span className="helper-text">At least 8 characters, one number.</span>
                    </label>
                  </form>
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
                    onClick={() => {
                      setPatterns((prev) => ({ ...prev, [device]: o.id }));
                      setBubbleOpen(false);
                      setSheetOpen(false);
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
                tooltip-{pattern}.css
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
              <li>• :hover / :focus-within</li>
              <li>• ::after CSS arrow triangle</li>
              <li>• aria-describedby wiring</li>
              <li>• position: absolute anchoring</li>
              <li>• color-mix() shadows</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .tip-wrap { position: relative; display: inline-block; }

        .tip-bubble {
          position: absolute;
          bottom: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          background: var(--foreground);
          color: var(--background);
          padding: 0.35rem 0.6rem;
          border-radius: 0.4rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity .15s ease;
        }

        .tip-bubble::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: var(--foreground);
        }

        .tip-wrap:hover .tip-bubble,
        .tip-wrap:focus-within .tip-bubble {
          opacity: 1;
        }

        .hover-card-wrap { position: relative; display: inline-block; }

        .hover-card {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          width: 12rem;
          background: var(--popover);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.6rem;
          box-shadow: 0 8px 24px color-mix(in oklch, var(--foreground) 12%, transparent);
          opacity: 0;
          transform: translateY(-4px);
          pointer-events: none;
          transition: opacity .15s ease, transform .15s ease;
          z-index: 10;
        }

        .hover-card-wrap:hover .hover-card,
        .hover-card-wrap:focus-within .hover-card {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .help-icon-wrap { position: relative; display: inline-flex; }

        .help-tip {
          position: absolute;
          bottom: calc(100% + 0.4rem);
          left: 50%;
          transform: translateX(-50%);
          width: 9rem;
          background: var(--popover);
          color: var(--popover-foreground);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.4rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity .15s ease;
          z-index: 10;
        }

        .help-icon-wrap:hover .help-tip,
        .help-icon-wrap:focus-within .help-tip {
          opacity: 1;
        }

        .tap-bubble-wrap { position: relative; display: inline-block; }

        .tap-bubble {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          background: var(--popover);
          border: 1px solid var(--border);
          border-radius: 0.6rem;
          padding: 0.4rem 0.6rem;
          white-space: nowrap;
          box-shadow: 0 6px 16px color-mix(in oklch, var(--foreground) 10%, transparent);
          z-index: 10;
        }

        .info-sheet-backdrop {
          position: absolute;
          inset: 0;
          background: color-mix(in oklch, var(--foreground) 40%, transparent);
        }

        .info-sheet {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--popover);
          border-top: 1px solid var(--border);
          border-radius: 1rem 1rem 0 0;
          padding: 0.75rem;
        }

        .helper-field .helper-text {
          display: block;
          margin-top: 0.25rem;
          color: var(--muted-foreground);
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
