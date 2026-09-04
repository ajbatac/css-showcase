import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts & Banners — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Inline alert and banner patterns — success/warning/error/info cards, sticky top banners, field-level alerts, compact stacked alerts, and bottom-anchored banners — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Alerts & Banners — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Dismissible alert cards, sticky banners, and inline field alerts built with semantic tokens.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlertsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "inline-cards"
  | "top-banner"
  | "field-alert"
  | "stacked-compact"
  | "sticky-bottom";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "inline-cards", label: "Inline cards", desc: "Icon, title, body, and actions" },
    { id: "top-banner", label: "Top banner", desc: "Sticky full-width banner with CTA" },
    { id: "field-alert", label: "Field alert", desc: "Alert attached under a form field" },
  ],
  ipad: [
    { id: "inline-cards", label: "Inline cards", desc: "Icon, title, body, and actions" },
    { id: "top-banner", label: "Top banner", desc: "Sticky full-width banner with CTA" },
  ],
  mobile: [
    { id: "stacked-compact", label: "Stacked compact", desc: "Compact one-line alerts" },
    { id: "sticky-bottom", label: "Sticky bottom", desc: "Bottom-anchored banner over content" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "inline-cards": `/* Inline alert cards */
.alert-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.alert-card[data-tone="success"] {
  background: color-mix(in oklch, var(--foreground) 6%, transparent);
  border-color: color-mix(in oklch, green 40%, var(--border));
}

.alert-card[data-tone="error"] {
  border-color: color-mix(in oklch, red 40%, var(--border));
}`,
  "top-banner": `/* Sticky top banner */
.top-banner {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--border);
  background: color-mix(in oklch, var(--foreground) 6%, var(--background));
}`,
  "field-alert": `/* Field-level alert */
.field-alert {
  margin-top: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  color: color-mix(in oklch, red 65%, var(--foreground));
}

.field-alert-input[data-invalid="true"] {
  border-color: color-mix(in oklch, red 55%, var(--border));
  outline-color: color-mix(in oklch, red 55%, var(--border));
}`,
  "stacked-compact": `/* Compact stacked alerts */
.alert-compact {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  font-size: 0.7rem;
  line-height: 1.1;
}`,
  "sticky-bottom": `/* Bottom-anchored banner */
.sticky-bottom-banner {
  position: absolute;
  inset-inline: 0.5rem;
  bottom: 0.6rem;
  border-radius: 0.85rem;
  border: 1px solid var(--border);
  box-shadow: 0 10px 30px color-mix(in oklch, var(--foreground) 18%, transparent);
  padding: 0.7rem 0.8rem;
}`,
};

const FEATURES_BY_PATTERN: Record<Pattern, string[]> = {
  "inline-cards": [
    "CSS grid icon/body/actions",
    "color-mix tone backgrounds",
    "data-tone attribute styling",
    "Semantic tokens",
  ],
  "top-banner": [
    "position: sticky",
    "flexbox space-between",
    "color-mix background tint",
    "z-index layering",
  ],
  "field-alert": [
    "data-invalid attribute styling",
    "outline-color on focus/invalid",
    "color-mix text tint",
    "Flexbox icon + text",
  ],
  "stacked-compact": [
    "Compact flex rows",
    "line-height tightening",
    "border radius scale",
    "Semantic tokens",
  ],
  "sticky-bottom": [
    "position: absolute anchoring",
    "box-shadow elevation",
    "color-mix shadow tint",
    "inset-inline shorthand",
  ],
};

function AlertsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "inline-cards",
      ipad: "inline-cards",
      mobile: "stacked-compact",
    }),
  );
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const isDismissed = (key: string) => !!dismissed[key];
  const dismiss = (key: string) => setDismissed((prev) => ({ ...prev, [key]: true }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Alerts that get noticed.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Dismissible alert cards, sticky banners, and field-level alerts built with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">color-mix</code> tone tints
            and semantic tokens.
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
                className="alerts-demo relative h-full w-full overflow-auto text-[9px] text-muted-foreground"
              >
                {pattern === "inline-cards" && (
                  <div className="flex flex-col gap-2 p-3">
                    {[
                      {
                        key: "success",
                        tone: "success",
                        Icon: CheckCircle2,
                        title: "Payment received",
                        body: "Your invoice #1042 has been paid in full.",
                      },
                      {
                        key: "warning",
                        tone: "warning",
                        Icon: AlertTriangle,
                        title: "Storage almost full",
                        body: "You're using 92% of your plan's storage.",
                      },
                      {
                        key: "error",
                        tone: "error",
                        Icon: XCircle,
                        title: "Sync failed",
                        body: "We couldn't sync your latest changes.",
                      },
                      {
                        key: "info",
                        tone: "info",
                        Icon: Info,
                        title: "New feature",
                        body: "Dark mode is now available in settings.",
                      },
                    ].map(
                      ({ key, tone, Icon, title, body }) =>
                        !isDismissed(key) && (
                          <div key={key} className="alert-card" data-tone={tone}>
                            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground">{title}</p>
                              <p className="mt-0.5">{body}</p>
                              <div className="mt-1.5 flex gap-2">
                                <button className="rounded bg-primary px-2 py-0.5 font-semibold text-primary-foreground">
                                  Action
                                </button>
                                <button className="rounded border px-2 py-0.5 font-semibold">
                                  Dismiss
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => dismiss(key)}
                              aria-label="Close alert"
                              className="h-4 w-4 shrink-0 rounded hover:bg-muted"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ),
                    )}
                  </div>
                )}

                {pattern === "top-banner" && (
                  <div className="flex h-full flex-col">
                    {!isDismissed("banner") && (
                      <div className="top-banner">
                        <span className="text-foreground">
                          <span className="font-semibold">New:</span> Try our redesigned dashboard.
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          <button className="rounded bg-primary px-2 py-0.5 font-semibold text-primary-foreground">
                            Try it
                          </button>
                          <button onClick={() => dismiss("banner")} aria-label="Close banner">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex-1 space-y-2 p-3">
                      <p className="text-foreground font-semibold">Dashboard</p>
                      <div className="h-10 rounded-lg bg-muted" />
                      <div className="h-16 rounded-lg bg-muted" />
                    </div>
                  </div>
                )}

                {pattern === "field-alert" && (
                  <div className="flex flex-col gap-3 p-3">
                    <p className="font-semibold text-foreground">Create account</p>
                    <label className="flex flex-col gap-1">
                      <span className="text-foreground">Email</span>
                      <input
                        className="field-alert-input rounded border bg-background px-2 py-1 text-foreground"
                        data-invalid="true"
                        defaultValue="not-an-email"
                        readOnly
                      />
                      <span className="field-alert">
                        <XCircle className="h-3 w-3 shrink-0" /> Enter a valid email address.
                      </span>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-foreground">Password</span>
                      <input
                        className="field-alert-input rounded border bg-background px-2 py-1 text-foreground"
                        type="password"
                        defaultValue="secret"
                        readOnly
                      />
                    </label>
                    <button className="rounded bg-primary px-2 py-1 font-semibold text-primary-foreground">
                      Sign up
                    </button>
                  </div>
                )}

                {pattern === "stacked-compact" && (
                  <div className="flex flex-col gap-1.5 p-3">
                    {[
                      { key: "c1", Icon: CheckCircle2, text: "Backup completed" },
                      { key: "c2", Icon: AlertTriangle, text: "Battery at 15%" },
                      { key: "c3", Icon: Info, text: "3 new updates available" },
                      { key: "c4", Icon: XCircle, text: "Upload failed, tap to retry" },
                    ].map(
                      ({ key, Icon, text }) =>
                        !isDismissed(key) && (
                          <div key={key} className="alert-compact">
                            <Icon className="h-3 w-3 shrink-0 text-foreground" />
                            <span className="flex-1 truncate text-foreground">{text}</span>
                            <button onClick={() => dismiss(key)} aria-label="Dismiss">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ),
                    )}
                  </div>
                )}

                {pattern === "sticky-bottom" && (
                  <div className="relative h-full">
                    <div className="space-y-2 p-3">
                      <p className="font-semibold text-foreground">Photos</p>
                      <div className="grid grid-cols-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="aspect-square rounded bg-muted" />
                        ))}
                      </div>
                    </div>
                    {!isDismissed("sticky") && (
                      <div className="sticky-bottom-banner bg-card">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-foreground font-semibold">
                            Upgrade for more storage
                          </span>
                          <button onClick={() => dismiss("sticky")} aria-label="Close">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <button className="mt-1.5 w-full rounded bg-primary px-2 py-1 font-semibold text-primary-foreground">
                          Upgrade
                        </button>
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
                alert-{pattern}.css
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
              {FEATURES_BY_PATTERN[pattern].map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .alert-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.6rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.6rem;
          background: var(--card);
        }

        .alert-card[data-tone="success"] {
          background: color-mix(in oklch, green 12%, transparent);
          border-color: color-mix(in oklch, green 40%, var(--border));
        }

        .alert-card[data-tone="warning"] {
          background: color-mix(in oklch, orange 12%, transparent);
          border-color: color-mix(in oklch, orange 40%, var(--border));
        }

        .alert-card[data-tone="error"] {
          background: color-mix(in oklch, red 10%, transparent);
          border-color: color-mix(in oklch, red 40%, var(--border));
        }

        .alert-card[data-tone="info"] {
          background: color-mix(in oklch, var(--foreground) 6%, transparent);
        }

        .top-banner {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          padding: 0.5rem 0.7rem;
          border-bottom: 1px solid var(--border);
          background: color-mix(in oklch, var(--foreground) 6%, var(--background));
        }

        .field-alert {
          margin-top: 0.3rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: color-mix(in oklch, red 65%, var(--foreground));
        }

        .field-alert-input[data-invalid="true"] {
          border-color: color-mix(in oklch, red 55%, var(--border));
        }

        .alert-compact {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--card);
        }

        .sticky-bottom-banner {
          position: absolute;
          inset-inline: 0.4rem;
          bottom: 0.5rem;
          border-radius: 0.85rem;
          border: 1px solid var(--border);
          box-shadow: 0 10px 30px color-mix(in oklch, var(--foreground) 18%, transparent);
          padding: 0.6rem 0.7rem;
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
