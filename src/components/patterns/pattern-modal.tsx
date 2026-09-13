import * as React from "react";

export type PatternModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  /** "sheet" slides up from the bottom on small screens, "dialog" always centers. */
  variant?: "responsive" | "dialog" | "sheet";
};

/** Accessible modal: bottom sheet on mobile, centered dialog on larger screens. Escape closes. */
export function PatternModal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  variant = "responsive",
}: PatternModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sheet = "w-full rounded-t-3xl";
  const dialog = "w-full max-w-md rounded-3xl";
  const shape =
    variant === "sheet"
      ? sheet
      : variant === "dialog"
        ? dialog
        : `${sheet} sm:${"max-w-md"} sm:rounded-3xl`;
  const align =
    variant === "sheet"
      ? "items-end"
      : variant === "dialog"
        ? "items-center justify-center"
        : "items-end sm:items-center sm:justify-center";

  return (
    <div className={`fixed inset-0 z-50 flex ${align} bg-foreground/40 p-0 sm:p-6`}>
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative border bg-card p-5 shadow-xl outline-none ${shape}`}
      >
        <h2 id={titleId} className="text-base font-semibold text-foreground">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        {children && <div className="mt-4 text-sm text-foreground">{children}</div>}
        {footer && (
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
