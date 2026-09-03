import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileText, Image as ImageIcon, Paperclip, UploadCloud, X } from "lucide-react";
import { CopyLinkButton, seedPatterns, useDemoSearch } from "@/lib/demo-permalink";

export const Route = createFileRoute("/uploaders")({
  head: () => ({
    meta: [
      { title: "File Uploaders — Modern CSS Demos" },
      {
        name: "description",
        content:
          "Drag-and-drop zones, upload queues, thumbnail grids, and mobile attach sheets — one uploader reshaped per device with container queries.",
      },
      { property: "og:title", content: "File Uploaders — Modern CSS Demos" },
      {
        property: "og:description",
        content:
          "Per-device file uploader patterns: desktop dropzone, upload list, gallery grid, iPad split picker, and mobile attach sheet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UploadersDemo,
});

type Device = "desktop" | "ipad" | "mobile";
type Pattern = "dropzone" | "list" | "gallery" | "split" | "attach" | "tiles";

const DEVICES: { id: Device; label: string; hint: string }[] = [
  { id: "desktop", label: "Desktop", hint: "16:10" },
  { id: "ipad", label: "iPad", hint: "4:3" },
  { id: "mobile", label: "Mobile", hint: "9:19.5" },
];

const PATTERNS: Record<Device, { id: Pattern; label: string; desc: string }[]> = {
  desktop: [
    { id: "dropzone", label: "Large dropzone", desc: "Drag & drop hero with browse fallback" },
    { id: "list", label: "Upload queue rows", desc: "Table-like rows with progress" },
    { id: "gallery", label: "Thumbnail gallery", desc: "auto-fill grid of previews" },
  ],
  ipad: [
    { id: "split", label: "Split dropzone + queue", desc: "Two-pane picker and list" },
    { id: "gallery", label: "Thumbnail gallery", desc: "Larger tap targets in a grid" },
  ],
  mobile: [
    { id: "attach", label: "Attach button + list", desc: "Compact sheet-style rows" },
    { id: "tiles", label: "Two-up tiles", desc: "Square previews with remove" },
  ],
};

const CSS_BY_PATTERN: Record<Pattern, string> = {
  dropzone: `/* Large drag & drop hero */
.uploader[data-pattern="dropzone"] {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 0.5rem;
}

.dropzone {
  display: grid;
  place-content: center;
  border: 2px dashed hsl(var(--border));
  border-radius: 0.75rem;
  transition: border-color .2s ease, background-color .2s ease;
}

.dropzone[data-dragging="true"] {
  border-color: var(--primary);
  background: color-mix(in oklab, var(--primary) 8%, transparent);
}`,
  list: `/* Upload queue rows */
.uploader[data-pattern="list"] .file-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 6rem auto;
  align-items: center;
  gap: 0.5rem;
}

.progress {
  block-size: 0.35rem;
  border-radius: 999px;
  background: hsl(var(--muted));
}

.progress > span {
  display: block;
  block-size: 100%;
  border-radius: inherit;
  background: var(--primary);
  transition: inline-size .4s ease;
}`,
  gallery: `/* Thumbnail gallery */
.uploader[data-pattern="gallery"] .files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr));
  gap: 0.4rem;
}

.uploader[data-pattern="gallery"] .file-row {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}`,
  split: `/* Split dropzone + queue (iPad) */
.uploader[data-pattern="split"] {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

@container (min-width: 420px) {
  .uploader[data-pattern="split"] {
    grid-template-columns: 0.9fr 1.1fr;
    align-items: start;
  }
}`,
  attach: `/* Mobile attach button + list */
.uploader[data-pattern="attach"] {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5rem;
}

.attach-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 2.75rem; /* thumb-friendly */
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-foreground);
}`,
  tiles: `/* Two-up mobile tiles */
.uploader[data-pattern="tiles"] .files {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
}

.uploader[data-pattern="tiles"] .file-row {
  aspect-ratio: 1;
  position: relative;
  display: grid;
  place-items: center;
  overflow: clip;
}`,
};

type UploadFile = {
  id: string;
  name: string;
  size: string;
  kind: "image" | "doc";
  progress: number;
};

const INITIAL_FILES: UploadFile[] = [
  { id: "f1", name: "brand-hero.png", size: "2.4 MB", kind: "image", progress: 100 },
  { id: "f2", name: "spec-sheet.pdf", size: "812 KB", kind: "doc", progress: 100 },
  { id: "f3", name: "product-shot-03.jpg", size: "1.9 MB", kind: "image", progress: 64 },
  { id: "f4", name: "notes.txt", size: "12 KB", kind: "doc", progress: 28 },
];

let nextId = 5;

function UploadersDemo() {
  const initial = useDemoSearch();
  const [device, setDevice] = useState<Device>(
    initial.device && initial.device in PATTERNS ? (initial.device as Device) : "mobile",
  );
  const [patterns, setPatterns] = useState<Record<Device, Pattern>>(() =>
    seedPatterns<Device, Pattern>(PATTERNS, initial, {
      desktop: "dropzone",
      ipad: "split",
      mobile: "attach",
    }),
  );
  const [files, setFiles] = useState<UploadFile[]>(INITIAL_FILES);
  const [dragging, setDragging] = useState(false);

  const pattern = patterns[device];
  const options = PATTERNS[device];

  const addFile = () => {
    const id = `f${nextId++}`;
    const isImage = Math.random() > 0.5;
    setFiles((prev) => [
      ...prev,
      {
        id,
        name: isImage ? `upload-${id}.jpg` : `upload-${id}.pdf`,
        size: `${(Math.random() * 3 + 0.2).toFixed(1)} MB`,
        kind: isImage ? "image" : "doc",
        progress: 0,
      },
    ]);
    let progress = 0;
    const timer = window.setInterval(() => {
      progress = Math.min(100, progress + 20);
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress } : f)),
      );
      if (progress >= 100) window.clearInterval(timer);
    }, 350);
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const showDropzone = pattern === "dropzone" || pattern === "split";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl md:max-w-5xl xl:max-w-6xl px-5 pb-24 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Live Demo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            File uploaders, per device.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A drag-and-drop hero on desktop, a split picker on iPad, and a
            thumb-friendly attach sheet on mobile — reshaped with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@container</code>{" "}
            queries and <code className="rounded bg-muted px-1.5 py-0.5 text-xs">auto-fill</code> grids.
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
                className="uploader h-full w-full overflow-auto p-2"
              >
                {showDropzone && (
                  <div
                    className="dropzone p-3 text-center"
                    data-dragging={dragging}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      addFile();
                    }}
                  >
                    <UploadCloud className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-1.5 text-[10px] font-semibold">
                      Drag files here
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      PNG, JPG or PDF · up to 10 MB
                    </p>
                    <button
                      type="button"
                      onClick={addFile}
                      className="mt-2 rounded-lg border border-border bg-card px-2 py-1 text-[9px] font-semibold transition hover:bg-accent"
                    >
                      Browse files
                    </button>
                  </div>
                )}

                {pattern === "attach" && (
                  <button
                    type="button"
                    onClick={addFile}
                    className="attach-button px-3 text-[10px] font-semibold"
                  >
                    <Paperclip className="h-3 w-3" />
                    Attach a file
                  </button>
                )}

                {pattern === "tiles" && (
                  <button
                    type="button"
                    onClick={addFile}
                    className="mb-2 w-full rounded-xl border border-dashed border-border py-2 text-[10px] font-semibold text-muted-foreground transition hover:bg-accent"
                  >
                    + Add photo
                  </button>
                )}

                {(pattern === "list" || pattern === "gallery") && (
                  <button
                    type="button"
                    onClick={addFile}
                    className="mb-2 inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[9px] font-semibold text-primary-foreground"
                  >
                    <UploadCloud className="h-3 w-3" />
                    Upload
                  </button>
                )}

                <div className="files mt-1 grid gap-1.5">
                  {files.map((file) => {
                    const Icon = file.kind === "image" ? ImageIcon : FileText;
                    const done = file.progress >= 100;
                    const compact = pattern === "gallery" || pattern === "tiles";
                    return (
                      <div
                        key={file.id}
                        className="file-row rounded-lg border bg-card p-1.5"
                      >
                        {compact ? (
                          <>
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="absolute inset-x-1 bottom-1 truncate text-center text-[7px] text-muted-foreground">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              aria-label={`Remove ${file.name}`}
                              onClick={() => removeFile(file.id)}
                              className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-foreground/70 text-background"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                            {!done && (
                              <span className="absolute inset-x-1 top-1 progress">
                                <span style={{ inlineSize: `${file.progress}%` }} />
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="min-w-0">
                              <span className="block truncate text-[9px] font-semibold">
                                {file.name}
                              </span>
                              <span className="block text-[8px] text-muted-foreground">
                                {file.size}
                              </span>
                            </span>
                            <span className="progress">
                              <span style={{ inlineSize: `${file.progress}%` }} />
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              {done ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <span className="text-[8px] text-muted-foreground">
                                  {file.progress}%
                                </span>
                              )}
                              <button
                                type="button"
                                aria-label={`Remove ${file.name}`}
                                onClick={() => removeFile(file.id)}
                                className="grid h-4 w-4 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
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
                uploader-{pattern}.css
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
              <li>• auto-fill minmax grids</li>
              <li>• aspect-ratio tiles</li>
              <li>• color-mix() drag state</li>
              <li>• Logical properties</li>
              <li>• Semantic tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`
        .uploader {
          container-type: inline-size;
          display: grid;
          align-content: start;
          gap: 0.5rem;
        }

        .dropzone {
          display: grid;
          place-content: center;
          border: 2px dashed hsl(var(--border));
          border-radius: 0.75rem;
          transition: border-color .2s ease, background-color .2s ease;
        }

        .dropzone[data-dragging="true"] {
          border-color: var(--primary);
          background: color-mix(in oklab, var(--primary) 10%, transparent);
        }

        .progress {
          display: block;
          block-size: 0.3rem;
          border-radius: 999px;
          background: hsl(var(--muted));
          overflow: hidden;
        }

        .progress > span {
          display: block;
          block-size: 100%;
          border-radius: inherit;
          background: var(--primary);
          transition: inline-size .4s ease;
        }

        .uploader[data-pattern="dropzone"] {
          grid-template-rows: auto 1fr;
        }

        .uploader[data-pattern="list"] .file-row,
        .uploader[data-pattern="dropzone"] .file-row,
        .uploader[data-pattern="split"] .file-row,
        .uploader[data-pattern="attach"] .file-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.4rem;
        }

        .uploader[data-pattern="list"] .file-row,
        .uploader[data-pattern="dropzone"] .file-row,
        .uploader[data-pattern="split"] .file-row {
          grid-template-columns: auto minmax(0, 1fr) 4rem auto;
        }

        .uploader[data-pattern="attach"] .file-row .progress {
          display: none;
        }

        .uploader[data-pattern="gallery"] .files,
        .uploader[data-pattern="tiles"] .files {
          gap: 0.4rem;
        }

        .uploader[data-pattern="gallery"] .files {
          grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
        }

        .uploader[data-pattern="tiles"] .files {
          grid-template-columns: repeat(2, 1fr);
        }

        .uploader[data-pattern="gallery"] .file-row,
        .uploader[data-pattern="tiles"] .file-row {
          position: relative;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          overflow: clip;
        }

        .uploader[data-pattern="split"] {
          grid-template-columns: 1fr;
        }

        @container (min-width: 420px) {
          .uploader[data-pattern="split"] {
            grid-template-columns: 0.9fr 1.1fr;
            align-items: start;
          }
        }

        @container (min-width: 620px) {
          .uploader[data-pattern="gallery"] .files {
            grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
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
