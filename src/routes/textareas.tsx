import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bold, Italic, List, Send } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { seedPatterns, useDemoSearch } from "@/lib/demo-state";

export const Route = createFileRoute("/textareas")({
  head: () => ({
    meta: [
      { title: "Textareas — CSS Showcase" },
      {
        name: "description",
        content:
          "Textarea patterns from auto-growing composers to fixed resizable boxes and bottom-anchored chat inputs, with a live character counter.",
      },
      { property: "og:title", content: "Textareas — CSS Showcase" },
      {
        property: "og:description",
        content:
          "Auto-grow, fixed-height, toolbar, and chat-composer textareas — one component reshaped per device with grid tricks and CSS resize.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TextareasDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "auto-grow" | "fixed" | "toolbar" | "compact" | "sheet-composer";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "auto-grow", label: "Auto-grow", desc: "Grid replicated-value trick" },
    { id: "fixed", label: "Fixed height", desc: "Resize handle enabled" },
    { id: "toolbar", label: "Toolbar", desc: "Formatting header" },
  ],
  ipad: [
    { id: "auto-grow", label: "Auto-grow", desc: "Grid replicated-value trick" },
    { id: "fixed", label: "Fixed height", desc: "Resize handle enabled" },
  ],
  mobile: [
    { id: "compact", label: "Compact composer", desc: "3-row textarea" },
    { id: "sheet-composer", label: "Sheet composer", desc: "Bottom-anchored chat bar" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  "auto-grow": `/* Auto-grow via grid replicated-value trick */
.grow-wrap {
  display: grid;
}

.grow-wrap::after {
  content: attr(data-value) " ";
  white-space: pre-wrap;
  visibility: hidden;
}

.grow-wrap textarea,
.grow-wrap::after {
  grid-area: 1 / 1 / 2 / 2;
  padding: 0.6rem;
  font: inherit;
}

.grow-wrap textarea {
  resize: none;
  overflow: hidden;
}`,
  fixed: `/* Fixed height with resize handle */
.textarea-fixed {
  height: 6rem;
  resize: vertical;
  min-height: 4rem;
  max-height: 12rem;
}`,
  toolbar: `/* Toolbar header */
.editor {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  overflow: clip;
}

.editor-toolbar {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.4);
  padding: 0.4rem;
}

.editor textarea {
  border: none;
  border-radius: 0;
}`,
  compact: `/* Compact 3-row composer */
.textarea-compact {
  rows: 3;
  min-height: unset;
  height: auto;
  font-size: 0.85rem;
}`,
  "sheet-composer": `/* Bottom-anchored chat composer */
.composer {
  position: sticky;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--card));
}

.composer textarea {
  resize: none;
  max-height: 6rem;
}`,
};

function TextareasDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "auto-grow",
      ipad: "fixed",
      mobile: "sheet-composer",
    }),
  );
  const maxLength = 140;
  const [value, setValue] = useState("CSS Showcase lets a textarea grow with content.");

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const renderTextarea = () => {
    const shared = {
      maxLength,
      value,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value),
    };

    if (pattern === "auto-grow") {
      return (
        <div className="grow-wrap" data-value={value}>
          <textarea {...shared} placeholder="Type to see it grow..." />
        </div>
      );
    }
    if (pattern === "toolbar") {
      return (
        <div className="editor">
          <div className="editor-toolbar">
            <button type="button" className="toolbar-btn">
              <Bold className="h-3 w-3" />
            </button>
            <button type="button" className="toolbar-btn">
              <Italic className="h-3 w-3" />
            </button>
            <button type="button" className="toolbar-btn">
              <List className="h-3 w-3" />
            </button>
          </div>
          <textarea {...shared} placeholder="Write something formatted..." />
        </div>
      );
    }
    if (pattern === "fixed") {
      return (
        <textarea {...shared} className="textarea-fixed" placeholder="Drag the corner to resize." />
      );
    }
    if (pattern === "compact") {
      return (
        <textarea {...shared} className="textarea-compact" rows={3} placeholder="Quick note..." />
      );
    }
    return (
      <div className="composer">
        <textarea {...shared} rows={1} placeholder="Message..." />
        <button type="button" className="send-btn" aria-label="Send">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Textareas that flex.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            One composer that auto-grows with a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">grid replicated-value</code>{" "}
            trick, gets a resize handle on desktop, and anchors to the bottom on mobile.
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
              <div className="textarea-demo flex h-full w-full flex-col overflow-auto p-3">
                <div className="flex-1">{renderTextarea()}</div>
                <div className="char-counter">
                  {value.length} / {maxLength}
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
                textarea-{pattern}.css
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
              <li>• Grid replicated-value autosize</li>
              <li>• resize: vertical</li>
              <li>• Sticky positioning</li>
              <li>• attr() content</li>
              <li>• CSS custom properties</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .textarea-demo textarea {
          width: 100%;
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.78rem;
          padding: 0.5rem;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .textarea-demo textarea:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.25);
        }

        .char-counter {
          margin-top: 0.4rem;
          text-align: right;
          font-size: 0.6rem;
          color: hsl(var(--muted-foreground));
        }

        .grow-wrap {
          display: grid;
        }

        .grow-wrap::after {
          content: attr(data-value) " ";
          white-space: pre-wrap;
          visibility: hidden;
        }

        .grow-wrap textarea,
        .grow-wrap::after {
          grid-area: 1 / 1 / 2 / 2;
          padding: 0.5rem;
          font: inherit;
          font-size: 0.78rem;
        }

        .grow-wrap textarea {
          resize: none;
          overflow: hidden;
          min-height: 2.5rem;
        }

        .textarea-fixed {
          height: 6rem;
          resize: vertical;
          min-height: 4rem;
          max-height: 10rem;
        }

        .editor {
          display: grid;
          grid-template-rows: auto 1fr;
          border: 1px solid hsl(var(--border));
          border-radius: 0.6rem;
          overflow: clip;
        }

        .editor-toolbar {
          display: flex;
          gap: 0.25rem;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--muted) / 0.4);
          padding: 0.35rem;
        }

        .toolbar-btn {
          display: inline-flex;
          height: 1.35rem;
          width: 1.35rem;
          align-items: center;
          justify-content: center;
          border-radius: 0.3rem;
          color: hsl(var(--muted-foreground));
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .toolbar-btn:hover {
          background: hsl(var(--accent));
          color: hsl(var(--foreground));
        }

        .editor textarea {
          border: none;
          border-radius: 0;
          min-height: 4rem;
        }

        .editor textarea:focus {
          box-shadow: none;
        }

        .textarea-compact {
          min-height: unset;
          font-size: 0.78rem;
        }

        .composer {
          position: sticky;
          bottom: 0;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 0.4rem;
          padding: 0.4rem;
          border-top: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          border-radius: 0.75rem;
        }

        .composer textarea {
          resize: none;
          max-height: 4rem;
          border-radius: 999px;
        }

        .send-btn {
          display: inline-flex;
          height: 2rem;
          width: 2rem;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .send-btn:hover {
          opacity: 0.9;
        }

        .send-btn:active {
          transform: scale(0.92);
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
