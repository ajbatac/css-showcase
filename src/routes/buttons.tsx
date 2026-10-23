import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronDown,
  Trash2,
  Plus,
  Star,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { CopyButton } from "@/components/copy-button";

export const Route = createFileRoute("/buttons")({
  head: () => ({
    meta: [
      { title: "Buttons — CSS Showcase" },
      {
        name: "description",
        content:
          "Button patterns from inline action rows to split buttons, segmented toolbars, stacked full-width mobile buttons, and sticky action bars.",
      },
      { property: "og:title", content: "Buttons — CSS Showcase" },
      {
        property: "og:description",
        content:
          "One button system reshaped per device with hover/active transitions, loading spinners, and disabled states.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ButtonsDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "row" | "split" | "toolbar" | "stacked-full" | "sticky-bar";

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "row", label: "Inline row", desc: "Primary/secondary/ghost/destructive" },
    { id: "split", label: "Split button", desc: "Action + dropdown + icons" },
    { id: "toolbar", label: "Segmented toolbar", desc: "Grouped button bar" },
  ],
  ipad: [
    { id: "row", label: "Inline row", desc: "Primary/secondary/ghost/destructive" },
    { id: "toolbar", label: "Segmented toolbar", desc: "Grouped button bar" },
  ],
  mobile: [
    { id: "stacked-full", label: "Stacked full-width", desc: "Primary/secondary" },
    { id: "sticky-bar", label: "Sticky action bar", desc: "Bottom-anchored" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  row: `/* Inline row */
.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn {
  transition: background-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
  split: `/* Split button */
.split-btn {
  display: inline-flex;
}

.split-btn .btn-main {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.split-btn .btn-caret {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 1px solid color-mix(in srgb, var(--primary-foreground) 30%, transparent);
}`,
  toolbar: `/* Segmented toolbar */
.segmented {
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  overflow: clip;
}

.segmented .btn {
  border-radius: 0;
  border-right: 1px solid var(--border);
}

.segmented .btn:last-child {
  border-right: 0;
}

.segmented .btn[aria-pressed="true"] {
  background: var(--accent);
}`,
  "stacked-full": `/* Full-width stacked */
.btn-stack {
  display: grid;
  gap: 0.5rem;
}

.btn-stack .btn {
  width: 100%;
  min-height: 44px;
}`,
  "sticky-bar": `/* Sticky bottom action bar */
.sticky-bar {
  position: sticky;
  bottom: 0;
  display: grid;
  grid-auto-flow: column;
  gap: 0.5rem;
  padding: 0.6rem;
  border-top: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 95%, transparent);
  backdrop-filter: blur(6px);
}`,
};

function ButtonsDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "row",
      ipad: "toolbar",
      mobile: "stacked-full",
    }),
  );
  const [loading, setLoading] = useState(false);
  const [aligned, setAligned] = useState<"left" | "center" | "right">("left");

  const pattern = patterns[device];
  useDemoUrlSync(device, pattern);
  const options = PATTERNS[device];

  const runLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1500);
  };

  const renderButtons = () => {
    if (pattern === "row") {
      return (
        <div className="btn-row">
          <button className="btn btn-primary btn-sm">Primary</button>
          <button className="btn btn-secondary btn-sm">Secondary</button>
          <button className="btn btn-ghost btn-sm">Ghost</button>
          <button className="btn btn-destructive btn-sm">Destructive</button>
          <button className="btn btn-primary btn-sm" onClick={runLoading} disabled={loading}>
            {loading && <Loader2 className="h-3 w-3 animate-spin" />} Loading
          </button>
          <button className="btn btn-primary btn-sm" disabled>
            Disabled
          </button>
        </div>
      );
    }
    if (pattern === "split") {
      return (
        <div className="flex flex-wrap items-center gap-3">
          <div className="split-btn">
            <button className="btn btn-primary btn-sm btn-main">
              <Plus className="h-3 w-3" /> New
            </button>
            <button className="btn btn-primary btn-sm btn-caret" aria-label="More options">
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <button className="btn btn-icon" aria-label="Favorite">
            <Star className="h-3.5 w-3.5" />
          </button>
          <button className="btn btn-icon btn-icon-destructive" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }
    if (pattern === "toolbar") {
      return (
        <div className="segmented">
          <button
            className="btn btn-sm"
            aria-pressed={aligned === "left"}
            onClick={() => setAligned("left")}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>
          <button
            className="btn btn-sm"
            aria-pressed={aligned === "center"}
            onClick={() => setAligned("center")}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>
          <button
            className="btn btn-sm"
            aria-pressed={aligned === "right"}
            onClick={() => setAligned("right")}
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }
    if (pattern === "stacked-full") {
      return (
        <div className="btn-stack">
          <button className="btn btn-primary" onClick={runLoading} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Continue
          </button>
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary" disabled>
            Disabled
          </button>
        </div>
      );
    }
    return (
      <div className="sticky-bar">
        <button className="btn btn-secondary">Back</button>
        <button className="btn btn-primary" onClick={runLoading} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Confirm
        </button>
      </div>
    );
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-16 md:pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Buttons that reshape.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            One button system that becomes an inline action row on desktop, a segmented toolbar on
            iPad, and full-width stacked or sticky bars on mobile — with hover, active, loading, and
            disabled states.
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
              <div className="button-demo flex h-full w-full flex-col overflow-auto p-3">
                <div className="flex-1">{renderButtons()}</div>
              </div>
            </DeviceFrame>
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
              <span className="text-xs font-semibold text-muted-foreground">
                button-{pattern}.css
              </span>
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
              <li>• Hover/active transitions</li>
              <li>• aria-pressed segmented state</li>
              <li>• Sticky positioning</li>
              <li>• backdrop-filter blur</li>
              <li>• CSS custom properties</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          border-radius: 0.55rem;
          font-weight: 600;
          font-size: 0.78rem;
          padding: 0.5rem 0.9rem;
          border: 1px solid transparent;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
        }

        .btn:active {
          transform: scale(0.96);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-sm {
          padding: 0.35rem 0.65rem;
          font-size: 0.72rem;
        }

        .btn-primary {
          background: var(--primary);
          color: var(--primary-foreground);
        }

        .btn-primary:hover:not(:disabled) {
          background: color-mix(in srgb, var(--primary) 90%, transparent);
        }

        .btn-secondary {
          background: var(--secondary);
          color: var(--secondary-foreground);
          border-color: var(--border);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--accent);
        }

        .btn-ghost {
          background: transparent;
          color: var(--foreground);
        }

        .btn-ghost:hover:not(:disabled) {
          background: var(--accent);
        }

        .btn-destructive {
          background: var(--destructive);
          color: var(--destructive-foreground);
        }

        .btn-destructive:hover:not(:disabled) {
          background: color-mix(in srgb, var(--destructive) 90%, transparent);
        }

        .btn-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .btn-icon {
          display: inline-flex;
          height: 2rem;
          width: 2rem;
          align-items: center;
          justify-content: center;
          border-radius: 0.55rem;
          background: var(--secondary);
          color: var(--secondary-foreground);
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .btn-icon:hover {
          background: var(--accent);
        }

        .btn-icon:active {
          transform: scale(0.92);
        }

        .btn-icon-destructive {
          color: var(--destructive);
        }

        .split-btn {
          display: inline-flex;
        }

        .split-btn .btn-main {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .split-btn .btn-caret {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: 1px solid color-mix(in srgb, var(--primary-foreground) 30%, transparent);
        }

        .segmented {
          display: inline-flex;
          border: 1px solid var(--border);
          border-radius: 0.6rem;
          overflow: clip;
        }

        .segmented .btn {
          border-radius: 0;
          border-right: 1px solid var(--border);
          background: var(--card);
          color: var(--foreground);
        }

        .segmented .btn:last-child {
          border-right: 0;
        }

        .segmented .btn[aria-pressed="true"] {
          background: var(--accent);
        }

        .btn-stack {
          display: grid;
          gap: 0.5rem;
        }

        .btn-stack .btn {
          width: 100%;
          min-height: 44px;
          font-size: 0.85rem;
        }

        .sticky-bar {
          position: sticky;
          bottom: 0;
          display: grid;
          grid-auto-flow: column;
          gap: 0.5rem;
          padding: 0.5rem;
          border-top: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 95%, transparent);
          backdrop-filter: blur(6px);
          border-radius: 0.75rem;
        }

        .sticky-bar .btn {
          min-height: 40px;
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
