import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, AlertCircle } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/inputs")({
  head: () => ({
    meta: [
      { title: "Text Inputs — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Text input patterns from floating labels to large touch-friendly fields, built with pure CSS peer selectors and no JavaScript label logic.",
      },
      { property: "og:title", content: "Text Inputs — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Floating labels, stacked forms, inline grids, and touch-optimized mobile inputs — one component, several CSS-driven shapes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InputsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "floating" | "stacked" | "inline" | "stacked-large" | "underline";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "floating", label: "Floating label", desc: ":placeholder-shown + peer" },
    { id: "stacked", label: "Stacked label", desc: "Label above input" },
    { id: "inline", label: "Inline label", desc: "Label left, input right" },
  ],
  ipad: [
    { id: "stacked", label: "Stacked label", desc: "Label above input" },
    { id: "floating", label: "Floating label", desc: ":placeholder-shown + peer" },
  ],
  mobile: [
    { id: "stacked-large", label: "Large touch fields", desc: "44px tall inputs" },
    { id: "underline", label: "Underline only", desc: "Minimal chrome" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  floating: `/* Floating label */
.field[data-pattern="floating"] {
  position: relative;
}

.field[data-pattern="floating"] input {
  padding: 1.25rem 0.75rem 0.5rem;
}

.field[data-pattern="floating"] label {
  position: absolute;
  left: 0.75rem;
  top: 0.9rem;
  transition: transform 0.15s ease, font-size 0.15s ease, color 0.15s ease;
  transform-origin: left top;
  pointer-events: none;
}

.field[data-pattern="floating"] input:not(:placeholder-shown) + label,
.field[data-pattern="floating"] input:focus + label {
  transform: translateY(-0.55rem) scale(0.75);
  color: hsl(var(--primary));
}`,
  stacked: `/* Stacked label */
.field[data-pattern="stacked"] {
  display: grid;
  gap: 0.35rem;
}

.field[data-pattern="stacked"] label {
  font-weight: 600;
  font-size: 0.75rem;
}`,
  inline: `/* Inline label */
.field[data-pattern="inline"] {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 0.75rem;
}

.field[data-pattern="inline"] label {
  font-weight: 600;
  font-size: 0.75rem;
  text-align: right;
}`,
  "stacked-large": `/* Large touch fields */
.field[data-pattern="stacked-large"] input {
  min-height: 44px;
  font-size: 1rem;
  border-radius: 0.75rem;
  padding-inline: 1rem;
}

.field[data-pattern="stacked-large"] label {
  font-size: 0.8rem;
  font-weight: 600;
}`,
  underline: `/* Underline only */
.field[data-pattern="underline"] input {
  border: none;
  border-bottom: 2px solid hsl(var(--border));
  border-radius: 0;
  padding-inline: 0.1rem;
  background: transparent;
  transition: border-color 0.2s ease;
}

.field[data-pattern="underline"] input:focus {
  border-color: hsl(var(--primary));
  outline: none;
}`,
};

function InputsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "floating",
      ipad: "stacked",
      mobile: "stacked-large",
    }),
  );

  const pattern = patterns[device];
  const options = PATTERNS[device];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Inputs that adapt.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            One field component that floats its label with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              :placeholder-shown
            </code>{" "}
            on desktop and grows into large touch targets on mobile.
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
                className="input-demo h-full w-full overflow-auto p-3"
              >
                <div className="field" data-pattern={pattern}>
                  {pattern === "floating" ? (
                    <>
                      <input id="name" placeholder=" " defaultValue="" />
                      <label htmlFor="name">Full name</label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="name">Full name</label>
                      <input id="name" placeholder="Jane Doe" />
                    </>
                  )}
                </div>

                <div className="field mt-3" data-pattern={pattern}>
                  {pattern === "floating" ? (
                    <>
                      <div className="icon-wrap">
                        <Mail className="icon" />
                        <input id="email" placeholder=" " type="email" />
                        <label htmlFor="email">Email</label>
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor="email">Email</label>
                      <div className="icon-wrap">
                        <Mail className="icon" />
                        <input id="email" placeholder="you@example.com" type="email" />
                      </div>
                    </>
                  )}
                </div>

                <div className="field mt-3" data-pattern={pattern}>
                  {pattern === "floating" ? (
                    <>
                      <input id="pw" placeholder=" " type="password" defaultValue="a" data-invalid="true" />
                      <label htmlFor="pw">Password</label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="pw">Password</label>
                      <input id="pw" placeholder="••••••" type="password" defaultValue="a" data-invalid="true" />
                    </>
                  )}
                  <span className="invalid-msg">
                    <AlertCircle className="h-2.5 w-2.5" /> Must be at least 8 characters
                  </span>
                </div>
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
                input-{pattern}.css
              </span>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(CSS_BY_PATTERN[pattern])
                }
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
              <li>• :placeholder-shown</li>
              <li>• Peer-style label transforms</li>
              <li>• Focus-visible rings</li>
              <li>• data-invalid styling</li>
              <li>• CSS custom properties</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .input-demo {
          display: grid;
          align-content: start;
        }

        .field input {
          width: 100%;
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.8rem;
          padding: 0.5rem 0.65rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .field input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.25);
        }

        .field input[data-invalid="true"] {
          border-color: hsl(var(--destructive));
        }

        .field input[data-invalid="true"]:focus {
          box-shadow: 0 0 0 3px hsl(var(--destructive) / 0.25);
        }

        .field label {
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
        }

        .invalid-msg {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
          font-size: 0.6rem;
          color: hsl(var(--destructive));
        }

        .icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .icon-wrap .icon {
          position: absolute;
          left: 0.6rem;
          height: 0.8rem;
          width: 0.8rem;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }

        .icon-wrap input {
          padding-left: 1.85rem;
        }

        /* Floating label */
        .field[data-pattern="floating"] {
          position: relative;
        }

        .field[data-pattern="floating"] input {
          padding: 1.15rem 0.65rem 0.4rem;
        }

        .field[data-pattern="floating"] .icon-wrap input {
          padding-left: 1.85rem;
        }

        .field[data-pattern="floating"] label {
          position: absolute;
          left: 0.65rem;
          top: 0.75rem;
          transition: transform 0.15s ease, font-size 0.15s ease, color 0.15s ease;
          transform-origin: left top;
          pointer-events: none;
        }

        .field[data-pattern="floating"] .icon-wrap label {
          left: 1.85rem;
        }

        .field[data-pattern="floating"] input:not(:placeholder-shown) + label,
        .field[data-pattern="floating"] input:focus + label,
        .field[data-pattern="floating"] .icon-wrap input:not(:placeholder-shown) ~ label,
        .field[data-pattern="floating"] .icon-wrap input:focus ~ label {
          transform: translateY(-0.5rem) scale(0.72);
          color: hsl(var(--primary));
        }

        /* Stacked label */
        .field[data-pattern="stacked"] {
          display: grid;
          gap: 0.3rem;
        }

        .field[data-pattern="stacked"] label {
          font-weight: 600;
        }

        /* Inline label */
        .field[data-pattern="inline"] {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          align-items: center;
          gap: 0.6rem;
        }

        .field[data-pattern="inline"] label {
          font-weight: 600;
          text-align: right;
        }

        /* Large touch fields */
        .field[data-pattern="stacked-large"] {
          display: grid;
          gap: 0.35rem;
        }

        .field[data-pattern="stacked-large"] input {
          min-height: 44px;
          font-size: 0.9rem;
          border-radius: 0.65rem;
        }

        .field[data-pattern="stacked-large"] label {
          font-weight: 600;
        }

        /* Underline only */
        .field[data-pattern="underline"] {
          display: grid;
          gap: 0.3rem;
        }

        .field[data-pattern="underline"] input {
          border: none;
          border-bottom: 2px solid hsl(var(--border));
          border-radius: 0;
          background: transparent;
          padding-inline: 0.1rem;
        }

        .field[data-pattern="underline"] input:focus {
          border-color: hsl(var(--primary));
          box-shadow: none;
        }

        .field[data-pattern="underline"] label {
          font-weight: 600;
        }
      `}</style>
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
      <div className="h-full w-full overflow-hidden rounded-lg bg-card">
        {children}
      </div>
    </div>
  );
}
