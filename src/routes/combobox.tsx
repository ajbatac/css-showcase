import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronsUpDown, CornerDownLeft } from "lucide-react";
import { CopyLinkButton } from "@/lib/demo-permalink";
import { CopyButton } from "@/components/copy-button";
import { DeviceTabs, PatternList } from "@/components/patterns/pattern-switcher";
import { seedPatterns, useDemoSearch, useDemoUrlSync } from "@/lib/demo-state";

export const Route = createFileRoute("/combobox")({
  head: () => ({
    meta: [
      { title: "Combobox & Autocomplete — CSS Showcase" },
      {
        name: "description",
        content:
          "The native datalist combobox beside a custom suggestion list with highlighted matches and listbox semantics.",
      },
      { property: "og:title", content: "Combobox & Autocomplete — CSS Showcase" },
      {
        property: "og:description",
        content: "Type ahead with a datalist or a styled custom listbox — autocomplete two ways.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComboboxDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "datalist" | "suggestions" | "touch-suggest";

const FRAMEWORKS = [
  "React",
  "Vue",
  "Svelte",
  "SolidJS",
  "Angular",
  "Astro",
  "Next.js",
  "Nuxt",
  "Remix",
  "Qwik",
  "Alpine.js",
  "Preact",
  "Lit",
  "Ember",
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "datalist", label: "Native datalist", desc: "input list= + datalist options" },
    {
      id: "suggestions",
      label: "Custom suggestions",
      desc: "Filtered listbox with highlighted matches",
    },
  ],
  ipad: [
    { id: "datalist", label: "Native datalist", desc: "input list= + datalist options" },
    {
      id: "suggestions",
      label: "Custom suggestions",
      desc: "Filtered listbox with highlighted matches",
    },
  ],
  mobile: [
    { id: "touch-suggest", label: "Touch suggestions", desc: "Full-width rows, big targets" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  datalist: `/* Native datalist combobox */
.datalist-field {
  display: grid;
  gap: 0.4rem;
  max-inline-size: 20rem;
}

.datalist-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted-foreground);
}

.datalist-field .combo-shell {
  position: relative;
}

.datalist-field input {
  inline-size: 100%;
  block-size: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0 2.5rem 0 0.9rem;
  font-weight: 500;
}

.datalist-field input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
}

/* The indicator is decorative — the UA renders the popup */
.datalist-field .combo-shell > svg {
  position: absolute;
  inset-inline-end: 0.8rem;
  inset-block-start: 50%;
  translate: 0 -50%;
  color: var(--muted-foreground);
  pointer-events: none;
}

/* The popup itself is UA-drawn — teach that, don't fight it */`,
  suggestions: `/* Custom suggestion listbox */
.combo { position: relative; max-inline-size: 22rem; }

.combo input {
  inline-size: 100%;
  block-size: 2.75rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  padding: 0 0.9rem;
  font-weight: 500;
}

.combo input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
}

.combo [role="listbox"] {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 6px);
  z-index: 10;
  display: grid;
  max-block-size: 13rem;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--popover);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--foreground) 14%, transparent);
  padding: 0.3rem;
}

.combo [role="option"] {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: start;
  border-radius: 0.5rem;
  padding: 0.55rem 0.7rem;
  font-size: 0.82rem;
  transition: background-color 0.1s ease;
}

.combo [role="option"]:hover { background: var(--accent); }

.combo mark {
  background: color-mix(in srgb, var(--primary) 22%, transparent);
  color: inherit;
  border-radius: 0.2rem;
  padding: 0 1px;
}

.combo .combo-empty {
  padding: 0.7rem;
  font-size: 0.8rem;
  color: var(--muted-foreground);
}`,
  "touch-suggest": `/* Touch suggestions */
.touch-combo {
  display: grid;
  gap: 0.6rem;
}

.touch-combo input {
  block-size: 3.25rem;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  background: var(--card);
  padding: 0 1rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.touch-combo [role="listbox"] {
  display: grid;
  gap: 0.4rem;
  max-block-size: 16rem;
  overflow: auto;
}

.touch-combo [role="option"] {
  min-block-size: 3rem;
  display: flex;
  align-items: center;
  text-align: start;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  background: var(--card);
  padding: 0 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.1s ease, border-color 0.1s ease;
}

.touch-combo [role="option"]:hover {
  background: var(--accent);
  border-color: var(--ring);
}

.touch-combo mark {
  background: color-mix(in srgb, var(--primary) 22%, transparent);
  color: inherit;
  border-radius: 0.2rem;
}`,
};

function highlight(text: string, query: string) {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

function ComboboxDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "datalist",
      ipad: "datalist",
      mobile: "touch-suggest",
    }),
  );
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState("");
  useDemoUrlSync(device, patterns[device]);

  const pattern = patterns[device];
  const options = PATTERNS[device];
  const matches = FRAMEWORKS.filter((f) => f.toLowerCase().includes(query.toLowerCase()));

  const renderDemo = () => {
    if (pattern === "datalist") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto p-4">
          <div className="datalist-field">
            <label htmlFor="framework-datalist">Framework</label>
            <div className="combo-shell">
              <input
                id="framework-datalist"
                list="framework-options"
                placeholder="Start typing…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ChevronsUpDown className="h-4 w-4" />
            </div>
            <datalist id="framework-options">
              {FRAMEWORKS.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>
          <p className="max-w-56 text-center text-[11px] text-muted-foreground">
            The suggestion popup is UA-drawn — the list attribute is all it takes.
          </p>
        </div>
      );
    }
    const listId = "framework-listbox";
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto p-4">
        <div className={pattern === "suggestions" ? "combo" : "touch-combo"}>
          <input
            role="combobox"
            aria-expanded={matches.length > 0}
            aria-controls={listId}
            aria-label="Framework"
            placeholder={pattern === "suggestions" ? "Start typing…" : "Search frameworks…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {matches.length > 0 ? (
            <div role="listbox" id={listId} aria-label="Frameworks">
              {matches.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="option"
                  aria-selected={picked === f}
                  onClick={() => {
                    setPicked(f);
                    setQuery(f);
                  }}
                >
                  <span>{highlight(f, query)}</span>
                  {picked === f && <CornerDownLeft className="ml-auto h-3 w-3 text-primary" />}
                </button>
              ))}
            </div>
          ) : (
            <p
              className={
                pattern === "suggestions" ? "combo-empty" : "text-xs text-muted-foreground"
              }
            >
              No framework matches “{query}”.
            </p>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {picked ? (
            <>
              Picked: <strong>{picked}</strong>
            </>
          ) : (
            "Matches highlight as you type."
          )}
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
            Type ahead, pick fast.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            The native datalist combobox beside a custom suggestion list with highlighted matches —
            autocomplete, two ways, no dependency.
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
              <span className="text-xs font-semibold text-muted-foreground">
                combobox-{pattern}.css
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
              <li>• datalist + list attribute</li>
              <li>• role=listbox / option</li>
              <li>• aria-expanded / aria-controls</li>
              <li>• color-mix() highlight</li>
              <li>• position: absolute popover</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .datalist-field { display: grid; gap: 0.4rem; max-inline-size: 20rem; }
        .datalist-field label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .datalist-field .combo-shell { position: relative; }
        .datalist-field input {
          inline-size: 100%;
          block-size: 2.75rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--card);
          padding: 0 2.5rem 0 0.9rem;
          font-weight: 500;
        }
        .datalist-field input:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
        }
        .datalist-field .combo-shell > svg {
          position: absolute;
          inset-inline-end: 0.8rem;
          inset-block-start: 50%;
          translate: 0 -50%;
          color: var(--muted-foreground);
          pointer-events: none;
        }

        .combo { position: relative; max-inline-size: 22rem; inline-size: 100%; }
        .combo input {
          inline-size: 100%;
          block-size: 2.75rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--card);
          padding: 0 0.9rem;
          font-weight: 500;
        }
        .combo input:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
        }
        .combo [role="listbox"] {
          position: absolute;
          inset-inline: 0;
          inset-block-start: calc(100% + 6px);
          z-index: 10;
          display: grid;
          max-block-size: 13rem;
          overflow: auto;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--popover);
          color: var(--popover-foreground);
          box-shadow: 0 12px 32px color-mix(in srgb, var(--foreground) 14%, transparent);
          padding: 0.3rem;
        }
        .combo [role="option"] {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-align: start;
          border-radius: 0.5rem;
          padding: 0.55rem 0.7rem;
          font-size: 0.82rem;
          transition: background-color 0.1s ease;
        }
        .combo [role="option"]:hover { background: var(--accent); }
        .combo mark,
        .touch-combo mark {
          background: color-mix(in srgb, var(--primary) 22%, transparent);
          color: inherit;
          border-radius: 0.2rem;
          padding: 0 1px;
        }
        .combo .combo-empty {
          padding: 0.7rem;
          font-size: 0.8rem;
          color: var(--muted-foreground);
        }

        .touch-combo { display: grid; gap: 0.6rem; inline-size: 100%; }
        .touch-combo input {
          block-size: 3.25rem;
          border: 1px solid var(--border);
          border-radius: 0.9rem;
          background: var(--card);
          padding: 0 1rem;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .touch-combo input:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--ring) 50%, transparent);
        }
        .touch-combo [role="listbox"] {
          display: grid;
          gap: 0.4rem;
          max-block-size: 15rem;
          overflow: auto;
        }
        .touch-combo [role="option"] {
          min-block-size: 3rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-align: start;
          border: 1px solid var(--border);
          border-radius: 0.9rem;
          background: var(--card);
          padding: 0 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background-color 0.1s ease, border-color 0.1s ease;
        }
        .touch-combo [role="option"]:hover {
          background: var(--accent);
          border-color: var(--ring);
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
