import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/toasts")({
  head: () => ({
    meta: [
      { title: "Toasts & Snackbars — CSS Showcase" },
      {
        name: "description",
        content:
          "Four flavors of toast feedback — success, error, warning, info — reshaped for desktop, iPad, and mobile with container queries.",
      },
      { property: "og:title", content: "Toasts & Snackbars — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Success, error, warning, info toasts across device shapes using container-type and CSS grid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToastsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern =
  | "top-right"
  | "bottom-right"
  | "banner"
  | "bottom-center"
  | "bottom-full"
  | "top-banner";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "top-right", label: "Top-right stack", desc: "Corner-anchored stack" },
    { id: "bottom-right", label: "Bottom-right stack", desc: "Classic corner toasts" },
    { id: "banner", label: "Centered banner", desc: "Full-width bar under header" },
  ],
  ipad: [
    { id: "bottom-center", label: "Bottom-center stack", desc: "Floating pill stack" },
    { id: "top-right", label: "Top-right stack", desc: "Corner-anchored stack" },
  ],
  mobile: [
    { id: "bottom-full", label: "Bottom snackbar", desc: "Full-width edge snackbar" },
    { id: "top-banner", label: "Top inline banner", desc: "Banner under status bar" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "top-right": `/* Top-right stack */
.toast-stack {
  container-type: inline-size;
  position: absolute;
  top: .5rem;
  right: .5rem;
  display: grid;
  justify-items: end;
  gap: .5rem;
}

.toast {
  max-width: min(60cqw, 22rem);
  border-radius: .5rem;
}`,
  "bottom-right": `/* Bottom-right stack */
.toast-stack {
  container-type: inline-size;
  position: absolute;
  bottom: .5rem;
  right: .5rem;
  display: grid;
  justify-items: end;
  gap: .5rem;
}

.toast {
  max-width: min(60cqw, 22rem);
  border-radius: .5rem;
}`,
  banner: `/* Centered banner under header */
.toast-banner {
  position: absolute;
  inset-inline: .5rem;
  top: .5rem;
  display: grid;
  justify-items: center;
}

.toast {
  width: 100%;
  border-radius: .5rem;
  text-align: center;
}`,
  "bottom-center": `/* Bottom-center floating stack */
.toast-stack {
  container-type: inline-size;
  position: absolute;
  bottom: .5rem;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  gap: .5rem;
}

.toast {
  max-width: min(80cqw, 24rem);
  border-radius: .75rem;
}`,
  "bottom-full": `/* Bottom full-width snackbar */
.toast-stack {
  container-type: inline-size;
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: grid;
  gap: .25rem;
}

.toast {
  width: 100%;
  border-radius: .5rem .5rem 0 0;
}`,
  "top-banner": `/* Top inline banner */
.toast-banner {
  position: absolute;
  inset-inline: 0;
  top: 0;
  display: grid;
}

.toast {
  width: 100%;
  border-radius: 0;
  text-align: left;
}`,
};

type Variant = "success" | "error" | "warning" | "info";

const VARIANTS: {
  id: Variant;
  label: string;
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  bar: string;
}[] = [
  {
    id: "success",
    label: "Success",
    title: "Changes saved",
    body: "Your profile is up to date.",
    icon: CheckCircle2,
    tone: "text-emerald-700 dark:text-emerald-300",
    bar: "bg-emerald-500/15 border-emerald-500/40",
  },
  {
    id: "error",
    label: "Error",
    title: "Upload failed",
    body: "File exceeds 25 MB limit.",
    icon: XCircle,
    tone: "text-red-700 dark:text-red-300",
    bar: "bg-red-500/15 border-red-500/40",
  },
  {
    id: "warning",
    label: "Warning",
    title: "Session ending soon",
    body: "You'll be signed out in 2 min.",
    icon: AlertTriangle,
    tone: "text-amber-700 dark:text-amber-300",
    bar: "bg-amber-500/15 border-amber-500/40",
  },
  {
    id: "info",
    label: "Info",
    title: "New version available",
    body: "Refresh to load v2.4.0.",
    icon: Info,
    tone: "text-sky-700 dark:text-sky-300",
    bar: "bg-sky-500/15 border-sky-500/40",
  },
];

function ToastsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS
      ? (initial.device as Device)
      : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
    desktop: "top-right",
    ipad: "bottom-center",
    mobile: "bottom-full",
    }),
  );
  const [visible, setVisible] = useState<Record<Variant, boolean>>({
    success: true,
    error: true,
    warning: true,
    info: true,
  });

  const toggle = (v: Variant) => setVisible((s) => ({ ...s, [v]: !s[v] }));
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
            Four toasts. Many placements per device.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Pick a device, then pick a placement pattern for that device — desktop offers
            top-right, bottom-right, and centered banner; mobile offers a full-width snackbar
            and a top inline banner.
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
            <DeviceFrame device={device} pattern={pattern} visible={visible} />
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

          <div className="border-t px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Toggle variants
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {VARIANTS.map((v) => {
                const on = visible[v.id];
                return (
                  <button
                    key={v.id}
                    onClick={() => toggle(v.id)}
                    className={`flex min-h-10 items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition ${
                      on ? v.bar : "border-border bg-card text-muted-foreground"
                    } ${on ? v.tone : ""}`}
                  >
                    <v.icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                toasts-{pattern}.css
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
              <li>• data-* variants</li>
              <li>• aspect-ratio frames</li>
              <li>• Grid auto-flow stack</li>
              <li>• Semantic tokens</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeviceFrame({
  device,
  pattern,
  visible,
}: {
  device: Device;
  pattern: Pattern;
  visible: Record<Variant, boolean>;
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
      <ToastApp pattern={pattern} visible={visible} />
    </div>
  );
}

function ToastApp({
  pattern,
  visible,
}: {
  pattern: Pattern;
  visible: Record<Variant, boolean>;
}) {
  const items = VARIANTS.filter((v) => visible[v.id]);
  const isBanner = pattern === "banner" || pattern === "top-banner";
  const bannerItem = items[0];

  const stackPositionClass: Record<Pattern, string> = {
    "top-right": "top-1.5 right-1.5 items-end",
    "bottom-right": "bottom-1.5 right-1.5 items-end",
    "bottom-center": "bottom-1.5 left-1/2 -translate-x-1/2 items-center",
    "bottom-full": "inset-x-0 bottom-0 items-stretch",
    banner: "",
    "top-banner": "",
  };

  return (
    <div className="toast-app relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
      {/* Fake app chrome */}
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-2 py-1.5">
        <div className="h-2 w-2 rounded-full bg-foreground/30" />
        <div className="h-1.5 w-12 rounded bg-foreground/40" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="h-2 w-1/2 rounded bg-foreground/60" />
        <div className="h-1.5 w-full rounded bg-muted-foreground/30" />
        <div className="h-1.5 w-5/6 rounded bg-muted-foreground/30" />
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded bg-muted" />
          <div className="h-8 rounded bg-muted" />
        </div>
      </div>

      {isBanner ? (
        bannerItem && (
          <div
            className={`toast-banner absolute inset-x-0 flex items-start gap-1.5 border px-2 py-1.5 shadow-sm backdrop-blur ${bannerItem.bar} ${bannerItem.tone} ${
              pattern === "banner"
                ? "top-1.5 mx-1.5 rounded-md text-center justify-center"
                : "top-0 rounded-none"
            }`}
            data-variant={bannerItem.id}
            style={{ animation: "toast-in .3s ease both" }}
          >
            <bannerItem.icon className="mt-0.5 h-2.5 w-2.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[8px] font-semibold leading-tight">
                {bannerItem.title}
              </div>
              <div className="truncate text-[7px] leading-tight opacity-70">
                {bannerItem.body}
              </div>
            </div>
          </div>
        )
      ) : (
        <div
          className={`toast-stack pointer-events-none absolute grid gap-1 p-1.5 ${stackPositionClass[pattern]}`}
        >
          {items.map((v) => (
            <div
              key={v.id}
              data-variant={v.id}
              className={`toast pointer-events-auto flex items-start gap-1.5 border px-1.5 py-1 shadow-sm backdrop-blur ${v.bar} ${v.tone} ${
                pattern === "bottom-full" ? "w-full rounded-t-md" : "max-w-[60%] rounded-md"
              }`}
              style={{ animation: "toast-in .3s ease both" }}
            >
              <v.icon className="mt-0.5 h-2.5 w-2.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[8px] font-semibold leading-tight">{v.title}</div>
                <div className="truncate text-[7px] opacity-70 leading-tight">{v.body}</div>
              </div>
              <div className="text-[8px] opacity-50">×</div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
