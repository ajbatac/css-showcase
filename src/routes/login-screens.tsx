import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/login-screens")({
  head: () => ({
    meta: [
      { title: "Login Screens — CSS Showcase" },
      {
        name: "description",
        content:
          "Multiple login design patterns per device: centered card, split half/half, hero overlay on desktop, and stacked or sheet layouts on mobile.",
      },
      { property: "og:title", content: "Login Screens — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Switch device and design pattern independently: centered, half/half, and overlay login layouts driven by container queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreens,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "centered" | "split" | "overlay" | "sheet";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "centered", label: "Centered card", desc: "Card on a soft canvas" },
    { id: "split", label: "Half / half", desc: "Hero beside the form" },
    { id: "overlay", label: "Hero overlay", desc: "Form floats on the hero" },
  ],
  ipad: [
    { id: "centered", label: "Centered card", desc: "Comfortable 60% card" },
    { id: "split", label: "Half / half", desc: "Even two-pane split" },
  ],
  mobile: [
    { id: "centered", label: "Full-bleed", desc: "Form fills the screen" },
    { id: "sheet", label: "Hero + sheet", desc: "Hero top, form sheet below" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  centered: `/* Centered card */
.login {
  container-type: inline-size;
  display: grid;
  place-items: center;
  background: var(--muted);
}

.login__card {
  width: min(92cqw, 340px);
  border-radius: 1rem;
  background: var(--card);
  box-shadow: 0 10px 30px -12px rgb(0 0 0 / .35);
}`,
  split: `/* Half / half */
.login {
  container-type: inline-size;
  display: grid;
  grid-template-columns: 1fr;   /* mobile */
}

@container (min-width: 520px) {
  .login { grid-template-columns: 1fr 1fr; }
}

@container (min-width: 780px) {
  .login { grid-template-columns: 1.3fr 1fr; }
}`,
  overlay: `/* Hero overlay */
.login {
  container-type: inline-size;
  display: grid;
  place-items: center;
  background: var(--primary);
}

.login__card {
  width: min(60cqw, 300px);
  backdrop-filter: blur(8px);
  background: color-mix(in oklab, var(--card) 80%, transparent);
}`,
  sheet: `/* Hero + sheet (mobile) */
.login {
  container-type: inline-size;
  display: grid;
  grid-template-rows: 38% 1fr;
}

.login__sheet {
  margin-top: -1.25rem;
  border-radius: 1.25rem 1.25rem 0 0;
  background: var(--card);
}`,
};

function LoginScreens() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "split",
      ipad: "centered",
      mobile: "centered",
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
            One login. Many patterns per device.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Pick a device, then pick a design pattern for that device — desktop offers centered,
            half/half, and hero overlay; mobile offers full-bleed and hero + sheet.
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
                login-{pattern}.css
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
              <li>• cqw units</li>
              <li>• Responsive grid</li>
              <li>• aspect-ratio frames</li>
              <li>• color-mix / backdrop blur</li>
              <li>• Semantic tokens</li>
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
      <LoginApp pattern={pattern} />
    </div>
  );
}

function Hero({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative h-full overflow-hidden bg-primary p-3 text-primary-foreground">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary-foreground/10" />
      <div className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-primary-foreground/10" />
      <div className="relative flex h-full flex-col justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-primary-foreground/90" />
          <div className="h-1.5 w-10 rounded bg-primary-foreground/80" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded bg-primary-foreground/90" />
          <div className="h-2 w-1/2 rounded bg-primary-foreground/70" />
          {!compact && (
            <>
              <div className="mt-2 h-1 w-2/3 rounded bg-primary-foreground/40" />
              <div className="h-1 w-1/2 rounded bg-primary-foreground/40" />
            </>
          )}
        </div>
        {!compact && (
          <div className="flex gap-1">
            <div className="h-1 w-4 rounded bg-primary-foreground/90" />
            <div className="h-1 w-1.5 rounded bg-primary-foreground/40" />
            <div className="h-1 w-1.5 rounded bg-primary-foreground/40" />
          </div>
        )}
      </div>
    </div>
  );
}

function FormBody({ dense = false }: { dense?: boolean }) {
  return (
    <div
      className={`flex min-h-0 flex-col justify-center ${dense ? "gap-1.5 p-2.5" : "gap-2 p-3"}`}
    >
      <div className="space-y-1">
        <div className="h-2.5 w-2/3 rounded bg-foreground/80" />
        <div className="h-1.5 w-1/2 rounded bg-muted-foreground/50" />
      </div>

      <div className="mt-1 space-y-1.5">
        <Field label="60%" />
        <Field label="45%" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-sm border border-foreground/60" />
          <div className="h-1 w-8 rounded bg-muted-foreground/50" />
        </div>
        <div className="h-1 w-10 rounded bg-primary/80" />
      </div>

      <div className="mt-1 h-4 rounded-md bg-primary" />

      <div className="flex items-center gap-1.5">
        <div className="h-px flex-1 bg-border" />
        <div className="h-1 w-6 rounded bg-muted-foreground/40" />
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <div className="h-4 rounded-md border border-border bg-background" />
        <div className="h-4 rounded-md border border-border bg-background" />
      </div>

      <div className="mt-1 flex items-center justify-center gap-1">
        <div className="h-1 w-10 rounded bg-muted-foreground/40" />
        <div className="h-1 w-6 rounded bg-primary/80" />
      </div>
    </div>
  );
}

function LoginApp({ pattern }: { pattern: Pattern }) {
  if (pattern === "split") {
    return (
      <div className="login-app login-app--split grid h-full w-full overflow-hidden rounded-lg bg-card">
        <div className="login-hero hidden">
          <Hero />
        </div>
        <FormBody />
        <style>{`
          .login-app--split { grid-template-columns: 1fr; grid-template-rows: 1fr; }
          .login-app--split .login-hero { display: none; }
          @container (min-width: 520px) {
            .login-app--split { grid-template-columns: 1fr 1fr; }
            .login-app--split .login-hero { display: block !important; }
          }
          @container (min-width: 780px) {
            .login-app--split { grid-template-columns: 1.3fr 1fr; }
          }
        `}</style>
      </div>
    );
  }

  if (pattern === "overlay") {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-card">
        <div className="absolute inset-0">
          <Hero />
        </div>
        <div className="relative grid h-full w-full place-items-center p-3">
          <div
            className="w-full max-w-[70cqw] rounded-xl border border-border/40 shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: "color-mix(in oklab, var(--card) 82%, transparent)",
            }}
          >
            <FormBody dense />
          </div>
        </div>
      </div>
    );
  }

  if (pattern === "sheet") {
    return (
      <div className="grid h-full w-full overflow-hidden rounded-lg bg-primary [grid-template-rows:38%_1fr]">
        <Hero compact />
        <div className="-mt-4 overflow-hidden rounded-t-2xl bg-card shadow-[0_-8px_24px_-12px_rgb(0_0_0/.4)]">
          <FormBody dense />
        </div>
      </div>
    );
  }

  // centered
  return (
    <div className="grid h-full w-full place-items-center overflow-hidden rounded-lg bg-muted p-2">
      <div className="w-full max-w-[min(92cqw,340px)] rounded-xl border bg-card shadow-[0_10px_30px_-12px_rgb(0_0_0/.35)]">
        <FormBody />
      </div>
    </div>
  );
}

function Field({ label }: { label: string }) {
  return (
    <div className="space-y-1">
      <div className="h-1 rounded bg-muted-foreground/50" style={{ width: label }} />
      <div className="h-4 rounded-md border border-border bg-muted/40" />
    </div>
  );
}
