import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const CHIPS: { text: string; style: React.CSSProperties; className?: string }[] = [
  { text: "!important", style: { left: "6%", top: "16%" }, className: "rotate-6" },
  { text: "z-index: 9999", style: { left: "76%", top: "10%" }, className: "-rotate-6" },
  { text: "margin: 0 auto", style: { left: "12%", top: "74%" }, className: "-rotate-3" },
  { text: "display: flex", style: { left: "80%", top: "64%" }, className: "rotate-12" },
  { text: "position: fixed", style: { left: "4%", top: "44%" }, className: "rotate-3" },
  { text: "overflow: hidden", style: { left: "86%", top: "38%" }, className: "-rotate-12" },
  { text: "align-items: center", style: { left: "28%", top: "6%" }, className: "-rotate-6" },
  {
    text: "transform: translate(-50%, -50%)",
    style: { left: "58%", top: "88%" },
    className: "rotate-2",
  },
  { text: "min-height: 100vh", style: { left: "36%", top: "90%" }, className: "-rotate-2" },
  { text: "@media print", style: { left: "64%", top: "4%" }, className: "rotate-6" },
];

const KEYFRAMES = `
@keyframes nf-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes nf-spin {
  to { transform: rotate(360deg); }
}
@keyframes nf-wiggle {
  0%, 88%, 100% { transform: rotate(-2deg); }
  91% { transform: rotate(2deg); }
  94% { transform: rotate(-2deg); }
  97% { transform: rotate(1deg); }
}
@media (prefers-reduced-motion: reduce) {
  .nf-chip, .nf-zero, .nf-badge { animation: none !important; }
}
`;

export function NotFoundPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center overflow-hidden bg-background px-5 py-16 text-foreground">
      <style>{KEYFRAMES}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        {CHIPS.map((chip, i) => (
          <span
            key={chip.text}
            className={`nf-chip absolute font-mono text-[10px] text-muted-foreground/50 sm:text-xs ${chip.className ?? ""}`}
            style={{
              ...chip.style,
              animation: `nf-bob ${6 + (i % 4)}s ease-in-out ${i * 0.7}s infinite`,
            }}
          >
            {chip.text}
          </span>
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-6 text-center">
        <span className="nf-badge rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground shadow-sm">
          error 404 · selector matches nothing
        </span>

        <h1
          className="flex items-center justify-center font-black leading-none tracking-tighter text-foreground"
          style={{ fontSize: "clamp(6rem, 24vw, 15rem)" }}
          aria-label="404"
        >
          <span>4</span>
          <span
            aria-hidden="true"
            className="nf-zero mx-[0.06em] inline-block rounded-full border-[0.075em] border-foreground border-t-transparent"
            style={{ width: "0.62em", height: "0.62em", animation: "nf-spin 7s linear infinite" }}
          />
          <span style={{ WebkitTextStroke: "0.045em currentColor", color: "transparent" }}>4</span>
        </h1>

        <div className="space-y-2">
          <p className="text-xl font-bold tracking-tight sm:text-2xl">
            Nothing matches this selector.
          </p>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            The page may have been moved, deleted, or it's hiding behind a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">z-index: -1</code>{" "}
            where nobody can find it.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <div className="mt-4 max-w-md rotate-[0.5deg] rounded-2xl border bg-card p-4 text-left shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            a freebie from the library
          </p>
          <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-foreground sm:text-sm">
            <code>{`.center-any-div {
  display: grid;
  place-items: center;
}`}</code>
          </pre>
          <p className="mt-2 text-xs text-muted-foreground">
            This card is centered by that exact code. Now you can center anything, including
            yourself.
          </p>
        </div>
      </div>
    </main>
  );
}
