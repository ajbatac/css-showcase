import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import html2canvas from "html2canvas-pro";
import { ClipboardCopy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DEMOS } from "@/lib/demos";
import { DEMO_SHARE } from "@/lib/demo-share";
import { SITE_URL } from "@/lib/seo";

/*
 * Share card: a 1024x1024 composition rasterized by html2canvas-pro at scale 2
 * into a 2048x2048 PNG. Everything except the device snapshot uses flat hex
 * colors (no oklch vars, no gradients) so the card is stable under capture;
 * the snapshot is a live clone of the page's DeviceFrame, scaled to fit.
 * html2canvas-pro is required — vanilla html2canvas throws on the oklch
 * tokens this design system uses.
 */

const CARD_SIZE = 1024;
const FIELD = "#171a00";
const BAND = "#202410";
const CHIP = "#2b2f16";
const INK = "#f0eddc";
const INK_SOFT = "rgba(240, 237, 220, 0.72)";
const INK_FAINT = "rgba(240, 237, 220, 0.55)";
const ACCENT = "#c98f88";

function ShareCard({
  h1,
  sub,
  features,
  path,
  slotRef,
}: {
  h1: string;
  sub: string;
  features: string[];
  path: string;
  slotRef: React.RefObject<HTMLDivElement | null>;
}) {
  const urlPath = path === "/" ? "" : path;
  // Content caps keep the snapshot band at a usable size even when a demo's
  // copy is long (the card is a fixed 1024x1024 flex column — an uncapped
  // 4-line subtitle plus 3 chip rows once squeezed the band to 25px).
  const h1Size = h1.length > 42 ? 54 : 72;
  const subText = sub.length > 140 ? `${sub.slice(0, 137).trimEnd()}…` : sub;
  const chips = features.slice(0, 6);
  return (
    <div className="sc-card" role="presentation">
      <header className="sc-brandrow">
        <div className="sc-brand">
          <img src="/logo.png" alt="" width={60} height={60} />
          <span className="sc-wordmark">
            <span>CSS</span>
            <span>Showcase</span>
          </span>
        </div>
        <span className="sc-siteurl">css.techhive.net</span>
      </header>

      <h1 className="sc-h1" style={{ fontSize: h1Size }}>
        {h1}
      </h1>
      <p className="sc-sub">{subText}</p>

      <div className="sc-band">
        <div className="sc-slot" ref={slotRef} />
      </div>

      <p className="sc-featureslabel">CSS features used</p>
      <ul className="sc-chips">
        {chips.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <footer className="sc-footer">
        <span className="sc-dot" />
        {/* html2canvas collapses whitespace in flex-row text nodes, so each
            word is its own span spaced by the flex gap. */}
        <span className="sc-footerlabel">
          {["Live", "demo", "with", "the", "code"].map((w) => (
            <span key={w}>{w}</span>
          ))}
        </span>
        <span className="sc-path">
          {SITE_URL.replace("https://", "")}
          {urlPath}
        </span>
      </footer>

      <style>{`
        .sc-card {
          width: ${CARD_SIZE}px;
          height: ${CARD_SIZE}px;
          background: ${FIELD};
          color: ${INK};
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          padding: 64px 72px 56px;
          position: relative;
          overflow: hidden;
        }
        .sc-brandrow {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sc-brand {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .sc-brand img {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: block;
        }
        .sc-wordmark {
          font-size: 33px;
          font-weight: 700;
          letter-spacing: -0.01em;
          display: flex;
          gap: 0.28em;
        }
        .sc-siteurl {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 21px;
          color: ${INK_FAINT};
        }
        .sc-h1 {
          line-height: 1.04;
          font-weight: 700;
          letter-spacing: -0.025em;
          margin: 40px 0 0;
          max-width: 20ch;
        }
        .sc-sub {
          font-size: 25px;
          line-height: 1.42;
          color: ${INK_SOFT};
          margin: 18px 0 0;
          max-width: 52ch;
        }
        .sc-band {
          flex: 1 1 0;
          min-height: 316px;
          background: ${BAND};
          margin: 40px -72px 0;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sc-slot {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sc-slot > div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sc-featureslabel {
          margin: 32px 0 0;
          font-size: 19px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: ${INK_FAINT};
        }
        .sc-chips {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 18px 0 0;
          padding: 0;
        }
        .sc-chips li {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 20px;
          color: #dfe3e9;
          background: ${CHIP};
          border-radius: 999px;
          padding: 9px 19px;
          white-space: nowrap;
        }
        .sc-footer {
          margin-top: auto;
          padding-top: 30px;
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 22px;
          color: ${INK_SOFT};
        }
        .sc-dot {
          width: 11px;
          height: 11px;
          border-radius: 999px;
          background: ${ACCENT};
          display: inline-block;
        }
        .sc-footerlabel {
          display: flex;
          gap: 0.34em;
        }
        .sc-path {
          margin-left: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 21px;
          color: ${ACCENT};
        }
      `}</style>
    </div>
  );
}

/** Clone the live DeviceFrame into a slot, scaled to fit the slot's box. */
function cloneDeviceFrameInto(slot: HTMLElement) {
  const frame = document.querySelector<HTMLElement>("main [data-device]");
  slot.replaceChildren();
  if (!frame) return null;

  const frameW = frame.offsetWidth;
  const frameH = frame.offsetHeight;
  if (!frameW || !frameH) return null;

  const scale = Math.min(slot.clientWidth / frameW, slot.clientHeight / frameH);
  const wrap = document.createElement("div");
  wrap.style.width = `${Math.round(frameW * scale)}px`;
  wrap.style.height = `${Math.round(frameH * scale)}px`;

  const clone = frame.cloneNode(true) as HTMLElement;
  clone.style.width = `${frameW}px`;
  clone.style.height = `${frameH}px`;
  clone.style.maxWidth = "none";
  clone.style.transform = `scale(${scale})`;
  clone.style.transformOrigin = "center center";
  clone.style.transition = "none";
  wrap.appendChild(clone);
  slot.appendChild(wrap);
  return frame.dataset.device ?? "";
}

export function ShareCardSection() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const demo = DEMOS.find((d) => d.path === pathname);
  const meta = demo ? DEMO_SHARE[demo.slug] : undefined;

  const previewSlot = useRef<HTMLDivElement>(null);
  const previewBox = useRef<HTMLDivElement>(null);
  const captureSlot = useRef<HTMLDivElement>(null);
  const captureCard = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState("current");
  const [busy, setBusy] = useState<"download" | "copy" | null>(null);
  const [previewScale, setPreviewScale] = useState(0);

  // Fit-to-box scale for the on-page preview. Computed in JS (a number) —
  // scale(calc(100cqw / 1024)) is invalid CSS and silently drops the transform.
  useEffect(() => {
    const box = previewBox.current;
    if (!box) return;
    const update = () => setPreviewScale(box.clientWidth / CARD_SIZE);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, [demo]);

  // Keep the preview clone fresh: re-clone whenever the demo frame changes
  // (device switch, pattern switch, in-demo interactions — debounced).
  useEffect(() => {
    if (!demo || !meta) return;
    let timer = 0;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (previewSlot.current) {
          const d = cloneDeviceFrameInto(previewSlot.current);
          if (d) setDevice(d);
        }
      }, 200);
    };
    refresh();
    const frame = document.querySelector("main [data-device]");
    if (frame) {
      const observer = new MutationObserver(refresh);
      observer.observe(frame, { attributes: true, childList: true, subtree: true });
      return () => {
        observer.disconnect();
        window.clearTimeout(timer);
      };
    }
  }, [demo, meta, pathname]);

  const render = useCallback(async () => {
    const card = captureCard.current;
    const slot = captureSlot.current;
    if (!card || !slot) throw new Error("card not ready");
    cloneDeviceFrameInto(slot);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    return html2canvas(card, {
      scale: 2048 / CARD_SIZE,
      backgroundColor: FIELD,
      useCORS: true,
      logging: false,
    });
  }, []);

  const download = async () => {
    if (busy || !demo) return;
    setBusy("download");
    try {
      const canvas = await render();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("encode failed");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `css-showcase-${demo.slug}-2048.png`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success("Share card downloaded", {
        description: "2048×2048 PNG — ready for social posts and docs.",
      });
    } catch {
      toast.error("Couldn't render the card", {
        description: "Try again, or use Copy image instead.",
      });
    } finally {
      setBusy(null);
    }
  };

  const copyImage = async () => {
    if (busy || !demo) return;
    setBusy("copy");
    try {
      const canvas = await render();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("encode failed");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Image copied", { description: "Paste it anywhere." });
    } catch {
      toast.error("Couldn't copy the image", {
        description: "Your browser may block image clipboard — use Download instead.",
      });
    } finally {
      setBusy(null);
    }
  };

  if (!demo || !meta) return null;

  return (
    <>
      <section
        aria-labelledby="share-title"
        className="mx-auto w-full max-w-3xl px-5 pb-20 md:max-w-5xl xl:max-w-6xl"
      >
        <hr className="border-t border-border" />
        <div className="pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Share
          </p>
          <h2 id="share-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Share this demo as a 1:1 image
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A 2048×2048 PNG with the live {device} view, the title, and the CSS features — for
            social posts, docs, and READMEs.
          </p>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="sc-preview" aria-hidden="true" ref={previewBox}>
              <div
                className="sc-preview-scale"
                style={{
                  transform: `scale(${previewScale})`,
                  opacity: previewScale > 0 ? 1 : 0,
                }}
              >
                <ShareCard
                  h1={meta.h1}
                  sub={meta.sub}
                  features={meta.features}
                  path={demo.path}
                  slotRef={previewSlot}
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
              <button
                type="button"
                onClick={download}
                disabled={busy !== null}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90 disabled:opacity-60"
              >
                {busy === "download" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download 2048×2048 PNG
              </button>
              <button
                type="button"
                onClick={copyImage}
                disabled={busy !== null}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent disabled:opacity-60"
              >
                {busy === "copy" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ClipboardCopy className="h-4 w-4" />
                )}
                Copy image
              </button>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                The snapshot follows the device selected on the page — switch between desktop, iPad,
                and mobile above and the card updates.
              </p>
            </div>
          </div>
        </div>

        <style>{`
          .sc-preview {
            width: min(344px, 100%);
            aspect-ratio: 1;
            overflow: hidden;
            border-radius: 18px;
            flex-shrink: 0;
            box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
          }
          .sc-preview-scale {
            width: ${CARD_SIZE}px;
            transform-origin: 0 0;
            transition: opacity 0.2s ease;
          }
          .sc-offscreen {
            position: fixed;
            left: -12000px;
            top: 0;
            pointer-events: none;
          }
        `}</style>
      </section>

      {/* Offscreen capture source at natural 1024px size (must stay rendered
          for html2canvas; scaled transforms on the element itself are unsafe). */}
      <div className="sc-offscreen" aria-hidden="true">
        <div ref={captureCard}>
          <ShareCard
            h1={meta.h1}
            sub={meta.sub}
            features={meta.features}
            path={demo.path}
            slotRef={captureSlot}
          />
        </div>
      </div>
    </>
  );
}
