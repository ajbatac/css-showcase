import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login-screens")({
  head: () => ({
    meta: [
      { title: "Login Screens — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Responsive login screens that reshape for desktop, iPad, and mobile using container queries and CSS grid.",
      },
      { property: "og:title", content: "Login Screens — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One login component, three device shapes. Powered by container-type, aspect-ratio, and CSS grid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreens,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.login {
  container-type: inline-size;
  display: grid;
  grid-template-columns: 1fr;      /* mobile: stacked */
  height: 100%;
}

/* iPad and up: hero image beside the form */
@container (min-width: 520px) {
  .login { grid-template-columns: 1fr 1fr; }
}

/* Desktop: give the hero more room */
@container (min-width: 780px) {
  .login { grid-template-columns: 1.3fr 1fr; }
}

.login__hero  { display: none; }
@container (min-width: 520px) {
  .login__hero { display: grid; }
}

.login__form-field {
  display: grid;
  gap: .35rem;
}`;

function LoginScreens() {
  const [device, setDevice] = useState<Device>("mobile");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One login. Three device shapes.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A single login screen that goes from full-bleed mobile to split-hero desktop using{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">container-type</code> and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">grid-template-columns</code>.
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
              <span className="text-xs font-semibold text-muted-foreground">login.css</span>
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
              <li>• Responsive grid</li>
              <li>• aspect-ratio frames</li>
              <li>• Custom properties</li>
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
      <LoginApp />
    </div>
  );
}

function LoginApp() {
  return (
    <div className="login-app grid h-full w-full overflow-hidden rounded-lg bg-card">
      {/* Hero panel — hidden on mobile via container query */}
      <div className="login-hero relative hidden overflow-hidden bg-primary p-3 text-primary-foreground">
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
            <div className="mt-2 h-1 w-2/3 rounded bg-primary-foreground/40" />
            <div className="h-1 w-1/2 rounded bg-primary-foreground/40" />
          </div>
          <div className="flex gap-1">
            <div className="h-1 w-4 rounded bg-primary-foreground/90" />
            <div className="h-1 w-1.5 rounded bg-primary-foreground/40" />
            <div className="h-1 w-1.5 rounded bg-primary-foreground/40" />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex min-h-0 flex-col justify-center gap-2 p-3">
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

      <style>{`
        .login-app { grid-template-columns: 1fr; grid-template-rows: 1fr; }
        .login-hero { display: none; }
        @container (min-width: 520px) {
          .login-app { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr; }
          .login-hero { display: flex !important; }
        }
        @container (min-width: 780px) {
          .login-app { grid-template-columns: 1.3fr 1fr; }
        }
      `}</style>
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
