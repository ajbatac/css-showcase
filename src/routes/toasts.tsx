import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export const Route = createFileRoute("/toasts")({
  head: () => ({
    meta: [
      { title: "Toasts & Snackbars — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Four flavors of toast feedback — success, error, warning, info — reshaped for desktop, iPad, and mobile with container queries.",
      },
      { property: "og:title", content: "Toasts & Snackbars — Modern CSS Demos" },
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

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.toast-stack {
  container-type: inline-size;
  display: grid;
  gap: .5rem;
}

/* Mobile: full-width edge-to-edge */
.toast {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: .5rem;
  border-radius: .5rem;
  padding: .5rem .75rem;
}

/* iPad and up: cap width, right-align */
@container (min-width: 520px) {
  .toast-stack { justify-items: end; }
  .toast { max-width: 22rem; }
}

/* Variants via data-attribute */
.toast[data-variant="success"] { background: hsl(var(--success) / .12); }
.toast[data-variant="error"]   { background: hsl(var(--destructive) / .12); }
.toast[data-variant="warning"] { background: hsl(var(--warning) / .12); }
.toast[data-variant="info"]    { background: hsl(var(--muted)); }`;

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
  const [device, setDevice] = useState<Device>("mobile");
  const [visible, setVisible] = useState<Record<Variant, boolean>>({
    success: true,
    error: true,
    warning: true,
    info: true,
  });

  const toggle = (v: Variant) => setVisible((s) => ({ ...s, [v]: !s[v] }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Four toasts. One responsive stack.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Success, error, warning, and info feedback that goes full-bleed on mobile and
            right-anchored on tablet/desktop using{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">container-type</code> and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data-variant</code>.
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
            <DeviceFrame device={device} visible={visible} />
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
              <span className="text-xs font-semibold text-muted-foreground">toasts.css</span>
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
  visible,
}: {
  device: Device;
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
      <ToastApp visible={visible} />
    </div>
  );
}

function ToastApp({ visible }: { visible: Record<Variant, boolean> }) {
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

      {/* Toast stack */}
      <div className="toast-stack pointer-events-none absolute inset-x-1.5 bottom-1.5 grid gap-1">
        {VARIANTS.filter((v) => visible[v.id]).map((v) => (
          <div
            key={v.id}
            data-variant={v.id}
            className={`toast pointer-events-auto flex items-start gap-1.5 rounded-md border px-1.5 py-1 shadow-sm backdrop-blur ${v.bar} ${v.tone}`}
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

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .toast-stack { justify-items: stretch; }
        @container (min-width: 520px) {
          .toast-stack { justify-items: end; }
          .toast { max-width: 60%; }
        }
      `}</style>
    </div>
  );
}
