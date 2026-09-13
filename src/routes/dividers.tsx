import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch } from "@/lib/demo-state";

export const Route = createFileRoute("/dividers")({
  head: () => ({
    meta: [
      { title: "Dividers — CSS Showcase" },
      {
        name: "description",
        content:
          "Divider and separator patterns — hairlines, labelled separators, vertical rules, inset list dividers, and spacer blocks — for mobile, iPad, and desktop.",
      },
      { property: "og:title", content: "Dividers — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Separator styles using hr, flexbox pseudo-line labels, gradient fades, and vertical rules.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DividersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "hairline" | "labelled" | "vertical" | "inset" | "spaced";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "hairline", label: "Hairline rule", desc: "1px line between sections" },
    { id: "labelled", label: "Labelled divider", desc: "Text centered in a fading line" },
    { id: "vertical", label: "Vertical dividers", desc: "Rules between inline columns" },
  ],
  ipad: [
    { id: "hairline", label: "Hairline rule", desc: "1px line between sections" },
    { id: "labelled", label: "Labelled divider", desc: "Text centered in a fading line" },
  ],
  mobile: [
    { id: "inset", label: "Inset list dividers", desc: "Dividers indented past a leading icon" },
    { id: "spaced", label: "Spacer blocks", desc: "Thick blocks separating groups" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  hairline: `/* Hairline rule between sections */
.divider[data-pattern="hairline"] {
  border: 0;
  border-top: 1px solid hsl(var(--border));
  margin-block: 0.75rem;
}`,
  labelled: `/* Labelled divider with fading lines */
.divider-labelled {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: hsl(var(--muted-foreground));
  font-size: 0.65rem;
}

.divider-labelled::before,
.divider-labelled::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    hsl(var(--border)) 30%,
    hsl(var(--border)) 70%,
    transparent
  );
}`,
  vertical: `/* Vertical dividers between inline columns */
.divider-vertical-row {
  display: flex;
  align-items: stretch;
}

.divider-vertical-row > .rule {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(
    180deg,
    transparent,
    hsl(var(--border)) 20%,
    hsl(var(--border)) 80%,
    transparent
  );
}`,
  inset: `/* Inset list dividers */
.divider-inset-list .row {
  border-bottom: 1px solid hsl(var(--border));
}

.divider-inset-list .row:last-child {
  border-bottom: 0;
}

.divider-inset-list .row .content {
  margin-inline-start: 2rem; /* inset past the leading icon */
}`,
  spaced: `/* Thick spacer blocks between groups */
.divider-spacer {
  height: 0.75rem;
  background: hsl(var(--muted) / 0.5);
  border-radius: 0.25rem;
  margin-block: 0.5rem;
}`,
};

function DividersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "hairline",
      ipad: "hairline",
      mobile: "inset",
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
            Dividers that fade.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Separators ranging from a plain{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">hr</code> hairline to
            gradient-faded labelled rules, vertical column dividers, and inset list separators.
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
                className="dividers-demo h-full w-full overflow-auto p-3 text-[9px] text-muted-foreground"
              >
                {pattern === "hairline" && (
                  <>
                    <p className="text-foreground">Section one content goes here.</p>
                    <hr className="divider" data-pattern="hairline" />
                    <p className="text-foreground">Section two follows after the rule.</p>
                    <hr className="divider" data-pattern="hairline" />
                    <p className="text-foreground">A final section wraps things up.</p>
                  </>
                )}
                {pattern === "labelled" && (
                  <>
                    <p className="text-foreground">Recent activity</p>
                    <div className="divider-labelled my-2">OR</div>
                    <p className="text-foreground">Continue with email</p>
                    <div className="divider-labelled my-2">March 2024</div>
                    <p className="text-foreground">Archived items below</p>
                  </>
                )}
                {pattern === "vertical" && (
                  <div className="divider-vertical-row h-full">
                    <div className="flex flex-1 flex-col items-center justify-center gap-1">
                      <span className="text-sm font-bold text-foreground">128</span>
                      <span>Posts</span>
                    </div>
                    <div className="rule" />
                    <div className="flex flex-1 flex-col items-center justify-center gap-1">
                      <span className="text-sm font-bold text-foreground">1.2k</span>
                      <span>Followers</span>
                    </div>
                    <div className="rule" />
                    <div className="flex flex-1 flex-col items-center justify-center gap-1">
                      <span className="text-sm font-bold text-foreground">312</span>
                      <span>Following</span>
                    </div>
                  </div>
                )}
                {pattern === "inset" && (
                  <div className="divider-inset-list">
                    {["Notifications", "Privacy", "Appearance", "Account"].map((label) => (
                      <div key={label} className="row flex items-center gap-2 py-2">
                        <span className="h-4 w-4 shrink-0 rounded-full bg-muted" />
                        <span className="content text-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {pattern === "spaced" && (
                  <>
                    <p className="text-foreground">Group A: today's tasks</p>
                    <div className="divider-spacer" />
                    <p className="text-foreground">Group B: upcoming tasks</p>
                    <div className="divider-spacer" />
                    <p className="text-foreground">Group C: completed tasks</p>
                  </>
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
                divider-{pattern}.css
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
              <li>• ::before / ::after pseudo-lines</li>
              <li>• linear-gradient fades</li>
              <li>• flexbox align-self: stretch</li>
              <li>• border-bottom lists</li>
              <li>• margin-inline-start inset</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .divider[data-pattern="hairline"] {
          border: 0;
          border-top: 1px solid hsl(var(--border));
          margin-block: 0.75rem;
        }

        .divider-labelled {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: hsl(var(--muted-foreground));
        }

        .divider-labelled::before,
        .divider-labelled::after {
          content: "";
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            hsl(var(--border)) 30%,
            hsl(var(--border)) 70%,
            transparent
          );
        }

        .divider-vertical-row {
          display: flex;
          align-items: stretch;
        }

        .divider-vertical-row > .rule {
          width: 1px;
          align-self: stretch;
          background: linear-gradient(
            180deg,
            transparent,
            hsl(var(--border)) 20%,
            hsl(var(--border)) 80%,
            transparent
          );
        }

        .divider-inset-list .row {
          border-bottom: 1px solid hsl(var(--border));
        }

        .divider-inset-list .row:last-child {
          border-bottom: 0;
        }

        .divider-spacer {
          height: 0.75rem;
          background: hsl(var(--muted) / 0.5);
          border-radius: 0.25rem;
          margin-block: 0.5rem;
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
