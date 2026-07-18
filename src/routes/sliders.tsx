import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/sliders")({
  head: () => ({
    meta: [
      { title: "Sliders — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Range sliders, dual-thumb ranges, and stepped controls morphed for mobile, iPad, and desktop using container queries.",
      },
      { property: "og:title", content: "Sliders — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "One slider component reshaped for mobile, iPad, and desktop with CSS container queries and custom range styling.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SlidersDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.slider-app {
  container-type: inline-size;
}

.slider-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* iPad: two columns */
@container (min-width: 420px) {
  .slider-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: three columns */
@container (min-width: 680px) {
  .slider-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Custom range styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.375rem;
  border-radius: 999px;
  background: hsl(var(--muted));
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: hsl(var(--primary));
  border: 2px solid hsl(var(--background));
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}`;

function SlidersDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [volume, setVolume] = useState<number>(65);
  const [brightness, setBrightness] = useState<number>(40);
  const [range, setRange] = useState<[number, number]>([20, 75]);
  const [step, setStep] = useState<number>(2);

  const min = range[0];
  const max = range[1];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Sliders & range inputs.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Single-thumb sliders, dual-thumb ranges, and stepped controls — all styled
            with CSS and reshaped for mobile, iPad, and desktop with container queries.
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
            <DeviceFrame device={device}>
              <div className="slider-app h-full w-full overflow-auto p-3">
                <div className="slider-grid">
                  {/* Volume slider */}
                  <div className="slider-card">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Volume
                      </label>
                      <span className="text-[10px] font-bold tabular-nums">{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="slider-input"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume}%, hsl(var(--muted)) ${volume}%, hsl(var(--muted)) 100%)`,
                      }}
                    />
                  </div>

                  {/* Brightness slider */}
                  <div className="slider-card">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Brightness
                      </label>
                      <span className="text-[10px] font-bold tabular-nums">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="slider-input"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${brightness}%, hsl(var(--muted)) ${brightness}%, hsl(var(--muted)) 100%)`,
                      }}
                    />
                  </div>

                  {/* Stepped rating */}
                  <div className="slider-card">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Rating
                      </label>
                      <span className="text-[10px] font-bold tabular-nums">{step} / 5</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={step}
                      onChange={(e) => setStep(Number(e.target.value))}
                      className="slider-input slider-stepped"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((step - 1) / 4) * 100}%, hsl(var(--muted)) ${((step - 1) / 4) * 100}%, hsl(var(--muted)) 100%)`,
                      }}
                    />
                    <div className="mt-1 flex justify-between px-0.5 text-[8px] text-muted-foreground">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>

                  {/* Dual-thumb range */}
                  <div className="slider-card col-span-full">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Price range
                      </label>
                      <span className="text-[10px] font-bold tabular-nums">
                        ${min} — ${max}
                      </span>
                    </div>
                    <div className="range-dual relative h-5">
                      <div className="range-track absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
                      <div
                        className="range-fill absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
                        style={{
                          left: `${min}%`,
                          right: `${100 - max}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={min}
                        onChange={(e) => {
                          const value = Math.min(Number(e.target.value), max - 5);
                          setRange([value, max]);
                        }}
                        className="range-thumb range-thumb-left absolute inset-0 w-full"
                      />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={max}
                        onChange={(e) => {
                          const value = Math.max(Number(e.target.value), min + 5);
                          setRange([min, value]);
                        }}
                        className="range-thumb range-thumb-right absolute inset-0 w-full"
                      />
                    </div>
                  </div>
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

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">sliders.css</span>
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
              <li>• CSS Grid responsive columns</li>
              <li>• Custom range styling</li>
              <li>• Linear-gradient progress fill</li>
              <li>• Dual-thumb range input</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .slider-app {
          container-type: inline-size;
          position: relative;
        }

        .slider-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
          align-content: start;
        }

        .slider-card {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
        }

        .slider-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 0.375rem;
          border-radius: 999px;
          outline: none;
        }

        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.1s ease;
        }

        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider-input::-moz-range-thumb {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
        }

        .slider-stepped {
          --step-count: 4;
        }

        /* Dual-thumb range */
        .range-dual {
          position: relative;
        }

        .range-track,
        .range-fill {
          pointer-events: none;
        }

        .range-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: auto;
        }

        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
          margin-top: -0.25rem;
        }

        .range-thumb::-moz-range-thumb {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
        }

        @container (min-width: 420px) {
          .slider-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .slider-card.col-span-full {
            grid-column: 1 / -1;
          }
        }

        @container (min-width: 680px) {
          .slider-grid {
            grid-template-columns: repeat(3, 1fr);
          }
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
