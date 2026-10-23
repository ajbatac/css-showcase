import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Delete, ShieldCheck } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/otp-input")({
  head: () => ({
    meta: [
      { title: "OTP & Verification Codes — CSS Showcase" },
      {
        name: "description",
        content:
          "A one-time-code field that auto-advances, backspaces between cells, and splits pasted codes — six plain inputs, no library.",
      },
      { property: "og:title", content: "OTP & Verification Codes — CSS Showcase" },
      {
        property: "og:description",
        content: "Auto-advancing verification code cells built from six plain inputs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OtpDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "six-digit" | "grouped" | "big-cells";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "six-digit", label: "6-digit row", desc: "Auto-advance, backspace, paste split" },
    { id: "grouped", label: "Grouped 3 + 3", desc: "Two clusters with a divider" },
  ],
  ipad: [{ id: "six-digit", label: "6-digit row", desc: "Auto-advance, backspace, paste split" }],
  mobile: [{ id: "big-cells", label: "Large code cells", desc: "Extra-tall touch targets" }],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "six-digit": `/* 6-digit code row */
.otp-row { display: flex; gap: 0.5rem; }

.otp-row input {
  inline-size: 2.9rem;
  block-size: 3.4rem;
  text-align: center;
  font-size: 1.35rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  background: var(--card);
  caret-color: var(--primary);
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
}

.otp-row input:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 22%, transparent);
}

/* data-filled replaces the UA caret visual once a digit landed */
.otp-row input[data-filled="true"] {
  border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
}

@media (prefers-reduced-motion: no-preference) {
  .otp-row input[data-filled="true"] { animation: cell-pop 0.15s ease; }
}

@keyframes cell-pop {
  50% { scale: 1.06; }
}`,
  grouped: `/* Grouped 3 + 3 */
.otp-grouped { display: flex; align-items: center; gap: 0.6rem; }

.otp-grouped .otp-cluster { display: flex; gap: 0.45rem; }

/* Same cell, restated for the grouped layout */
.otp-grouped input {
  inline-size: 2.7rem;
  block-size: 3.2rem;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  caret-color: var(--primary);
}

.otp-grouped input:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 22%, transparent);
}

.otp-grouped .otp-divider {
  inline-size: 1px;
  block-size: 2.4rem;
  background: var(--border);
}`,
  "big-cells": `/* Large code cells for touch */
.otp-big { display: flex; gap: 0.45rem; }

.otp-big input {
  inline-size: 2.6rem;
  block-size: 4rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  background: var(--card);
  caret-color: var(--primary);
}

.otp-big input:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 22%, transparent);
}

.otp-big input[data-filled="true"] {
  border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
  background: color-mix(in srgb, var(--primary) 6%, var(--card));
}`,
};

function CodeCells({
  count,
  clusterSize,
  cellClass,
  idPrefix,
}: {
  count: number;
  clusterSize?: number;
  cellClass: string;
  idPrefix: string;
}) {
  const [digits, setDigits] = useState<string[]>(() => Array.from({ length: count }, () => ""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const write = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < count - 1) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < count - 1) refs.current[index + 1]?.focus();
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, count);
    if (!pasted) return;
    event.preventDefault();
    setDigits(Array.from({ length: count }, (_, i) => pasted[i] ?? ""));
    refs.current[Math.min(pasted.length, count - 1)]?.focus();
  };

  const cells = Array.from({ length: count }, (_, i) => (
    <input
      key={i}
      ref={(el) => {
        refs.current[i] = el;
      }}
      id={`${idPrefix}-${i}`}
      className={cellClass}
      type="text"
      inputMode="numeric"
      autoComplete={i === 0 ? "one-time-code" : "off"}
      maxLength={1}
      value={digits[i]}
      data-filled={digits[i] ? "true" : "false"}
      aria-label={`Digit ${i + 1} of ${count}`}
      onChange={(e) => write(i, e.target.value)}
      onKeyDown={(e) => onKeyDown(i, e)}
      onPaste={onPaste}
    />
  ));

  if (!clusterSize)
    return <div className={cellClass.includes("big") ? "otp-big" : "otp-row"}>{cells}</div>;

  return (
    <div className="otp-grouped">
      <div className="otp-cluster">{cells.slice(0, clusterSize)}</div>
      <span className="otp-divider" aria-hidden="true" />
      <div className="otp-cluster">{cells.slice(clusterSize)}</div>
    </div>
  );
}

function OtpDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "six-digit",
      ipad: "six-digit",
      mobile: "big-cells",
    }),
  );
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const renderDemo = () => {
    if (pattern === "six-digit") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold">Enter the 6-digit code</p>
          <CodeCells count={6} cellClass="otp-cell" idPrefix="otp-six" />
          <p className="max-w-56 text-center text-[11px] text-muted-foreground">
            Type a digit to advance, backspace to go back — or paste the whole code anywhere.
          </p>
        </div>
      );
    }
    if (pattern === "grouped") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
          <p className="text-xs font-semibold">Access code</p>
          <CodeCells
            count={6}
            clusterSize={3}
            cellClass="otp-cell-grouped"
            idPrefix="otp-grouped"
          />
          <p className="text-[11px] text-muted-foreground">
            Same behavior — the divider is decorative.
          </p>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
        <p className="text-xs font-semibold">Verification code</p>
        <CodeCells count={6} cellClass="otp-cell-big" idPrefix="otp-big" />
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Delete className="h-3.5 w-3.5" /> roomy cells — thumb-friendly.
        </p>
      </div>
    );
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-16 md:pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Six boxes, zero friction.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A one-time-code field that auto-advances, backspaces between cells, and splits pasted
            codes — six plain inputs with <code>autocomplete="one-time-code"</code>, no library.
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
            <DeviceFrame device={device}>{renderDemo()}</DeviceFrame>
          </div>

          <DeviceTabs value={device} onChange={setDevice} />

          <div className="border-t bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {device} design patterns
              </p>
              <CopyLinkButton device={device} pattern={pattern} />
            </div>
            <PatternList
              options={options}
              value={pattern}
              onChange={(p) => setPatterns((prev) => ({ ...prev, [device]: p }))}
            />
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">otp-{pattern}.css</span>
              <CopyButton getText={() => CSS_BY_PATTERN[pattern]} />
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
              <li>• inputMode="numeric"</li>
              <li>• autocomplete="one-time-code"</li>
              <li>• caret-color</li>
              <li>• data-filled state</li>
              <li>• prefers-reduced-motion</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .otp-row { display: flex; gap: 0.5rem; justify-content: center; }
        .otp-big {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 0.4rem;
          max-inline-size: 22rem;
          inline-size: 100%;
          margin-inline: auto;
        }
        .otp-row input,
        .otp-grouped input,
        .otp-big input {
          text-align: center;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          border: 1px solid var(--border);
          border-radius: 0.8rem;
          background: var(--card);
          caret-color: var(--primary);
          transition: border-color 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
        }
        .otp-row input {
          inline-size: 2.9rem;
          block-size: 3.4rem;
          font-size: 1.35rem;
        }
        .otp-grouped { display: flex; align-items: center; gap: 0.6rem; }
        .otp-grouped .otp-cluster { display: flex; gap: 0.45rem; }
        .otp-grouped input {
          inline-size: 2.7rem;
          block-size: 3.2rem;
          font-size: 1.3rem;
          border-radius: 0.75rem;
        }
        .otp-grouped .otp-divider {
          inline-size: 1px;
          block-size: 2.4rem;
          background: var(--border);
        }
        .otp-big input {
          inline-size: 100%;
          block-size: 3rem;
          font-size: 1.25rem;
          border-radius: 0.7rem;
        }
        .otp-row input:focus-visible,
        .otp-grouped input:focus-visible,
        .otp-big input:focus-visible {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 22%, transparent);
        }
        .otp-row input[data-filled="true"],
        .otp-grouped input[data-filled="true"],
        .otp-big input[data-filled="true"] {
          border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
        }
        .otp-big input[data-filled="true"] {
          background: color-mix(in srgb, var(--primary) 6%, var(--card));
        }
        @media (prefers-reduced-motion: no-preference) {
          .otp-row input[data-filled="true"],
          .otp-grouped input[data-filled="true"],
          .otp-big input[data-filled="true"] {
            animation: cell-pop 0.15s ease;
          }
        }
        @keyframes cell-pop {
          50% { scale: 1.06; }
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
