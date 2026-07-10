import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, HelpCircle, X } from "lucide-react";

export const Route = createFileRoute("/modals")({
  head: () => ({
    meta: [
      { title: "Modals — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Confirm, cancel, and dismiss modal flows reshaped for desktop, iPad, and mobile with container queries.",
      },
      { property: "og:title", content: "Modals — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Three modal flows — confirm, cancel, dismiss — across device shapes using container-type and CSS grid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModalsDemo,
});

type Device = "desktop" | "ipad" | "mobile";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const CSS_CODE = `.modal-scrim {
  position: absolute; inset: 0;
  display: grid;
  place-items: end center;         /* mobile: bottom sheet */
  background: rgb(0 0 0 / .45);
  container-type: inline-size;
}

.modal {
  width: 100%;
  border-radius: 1rem 1rem 0 0;    /* mobile sheet corners */
  padding: 1rem;
  animation: sheet-in .25s ease both;
}

/* iPad and up: centered dialog */
@container (min-width: 520px) {
  .modal-scrim { place-items: center; }
  .modal {
    max-width: 22rem;
    border-radius: 1rem;
  }
}

.modal[data-flow="confirm"] { --accent: var(--primary); }
.modal[data-flow="cancel"]  { --accent: var(--destructive); }
.modal[data-flow="dismiss"] { --accent: var(--muted-foreground); }

@keyframes sheet-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}`;

type Flow = "confirm" | "cancel" | "dismiss";

const FLOWS: {
  id: Flow;
  label: string;
  title: string;
  body: string;
  primary: string;
  secondary: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  ring: string;
  btn: string;
}[] = [
  {
    id: "confirm",
    label: "Confirm",
    title: "Publish changes?",
    body: "Your updates will be visible to all teammates immediately.",
    primary: "Publish",
    secondary: "Not yet",
    icon: HelpCircle,
    tone: "text-primary",
    ring: "border-primary/40 bg-primary/10",
    btn: "bg-primary text-primary-foreground",
  },
  {
    id: "cancel",
    label: "Cancel",
    title: "Discard draft?",
    body: "You'll lose everything you typed in the last few minutes.",
    primary: "Discard",
    secondary: "Keep editing",
    icon: AlertTriangle,
    tone: "text-red-600 dark:text-red-400",
    ring: "border-red-500/40 bg-red-500/10",
    btn: "bg-red-600 text-white",
  },
  {
    id: "dismiss",
    label: "Dismiss",
    title: "You're all caught up",
    body: "No new activity since your last visit. Come back later.",
    primary: "Got it",
    secondary: "",
    icon: X,
    tone: "text-muted-foreground",
    ring: "border-border bg-muted/60",
    btn: "bg-foreground text-background",
  },
];

function ModalsDemo() {
  const [device, setDevice] = useState<Device>("mobile");
  const [flow, setFlow] = useState<Flow>("confirm");
  const [open, setOpen] = useState(true);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One modal. Three flows. Two shapes.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Confirm, cancel, and dismiss modals that slide up as a sheet on mobile and center as a
            dialog on larger devices using{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">container-type</code> and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data-flow</code>.
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
              {device} · {flow}
            </span>
          </div>

          <div className="relative bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-8">
            <DeviceFrame device={device} flow={flow} open={open} onClose={() => setOpen(false)} />
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
              Flow
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FLOWS.map((f) => {
                const on = flow === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFlow(f.id);
                      setOpen(true);
                    }}
                    className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition ${
                      on ? `${f.ring} ${f.tone}` : "border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <f.icon className="h-3.5 w-3.5" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
            {!open && (
              <button
                onClick={() => setOpen(true)}
                className="mt-2 w-full rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:bg-accent"
              >
                Re-open modal
              </button>
            )}
          </div>

          <div className="border-t">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">modal.css</span>
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
              <li>• data-* flow variants</li>
              <li>• Bottom-sheet → dialog</li>
              <li>• Keyframe entrance</li>
              <li>• Semantic tokens</li>
              <li>• Grid place-items</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeviceFrame({
  device,
  flow,
  open,
  onClose,
}: {
  device: Device;
  flow: Flow;
  open: boolean;
  onClose: () => void;
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
      <ModalApp flow={flow} open={open} onClose={onClose} />
    </div>
  );
}

function ModalApp({
  flow,
  open,
  onClose,
}: {
  flow: Flow;
  open: boolean;
  onClose: () => void;
}) {
  const f = FLOWS.find((x) => x.id === flow)!;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
      {/* Fake app chrome */}
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-2 py-1.5">
        <div className="h-2 w-2 rounded-full bg-foreground/30" />
        <div className="h-1.5 w-12 rounded bg-foreground/40" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="h-2 w-1/2 rounded bg-foreground/60" />
        <div className="h-1.5 w-full rounded bg-muted-foreground/30" />
        <div className="h-1.5 w-5/6 rounded bg-muted-foreground/30" />
        <div className="h-1.5 w-2/3 rounded bg-muted-foreground/30" />
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded bg-muted" />
          <div className="h-8 rounded bg-muted" />
        </div>
      </div>

      {open && (
        <div
          className="modal-scrim absolute inset-0 grid bg-black/45"
          style={{ containerType: "inline-size" }}
          onClick={onClose}
        >
          <div
            data-flow={flow}
            onClick={(e) => e.stopPropagation()}
            className={`modal w-full border p-2 shadow-xl ${f.ring}`}
            style={{ animation: "sheet-in .25s ease both" }}
          >
            <div className="mb-1 flex items-start gap-1.5">
              <f.icon className={`mt-0.5 h-3 w-3 shrink-0 ${f.tone}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[9px] font-semibold leading-tight">{f.title}</div>
                <div className="mt-0.5 text-[7px] leading-tight opacity-70">{f.body}</div>
              </div>
              <button
                onClick={onClose}
                aria-label="Dismiss"
                className="text-[10px] leading-none opacity-50 hover:opacity-100"
              >
                ×
              </button>
            </div>
            <div className="mt-1.5 flex justify-end gap-1">
              {f.secondary && (
                <button
                  onClick={onClose}
                  className="rounded px-1.5 py-0.5 text-[7px] font-medium text-muted-foreground hover:bg-muted"
                >
                  {f.secondary}
                </button>
              )}
              <button
                onClick={onClose}
                className={`rounded px-1.5 py-0.5 text-[7px] font-semibold ${f.btn}`}
              >
                {f.primary}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sheet-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .modal-scrim { place-items: end center; }
        .modal { border-radius: .6rem .6rem 0 0; }
        @container (min-width: 520px) {
          .modal-scrim { place-items: center; }
          .modal { max-width: 70%; border-radius: .6rem; }
        }
      `}</style>
    </div>
  );
}
