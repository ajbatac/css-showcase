import * as React from "react";

export type PatternTooltipProps = {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
};

const SIDES: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

/** Tooltip that opens on hover, focus and tap, and closes on Escape. */
export function PatternTooltip({ content, side = "top", children, className = "" }: PatternTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
studio-ignore
    >
      <span aria-describedby={open ? id : undefined} onClick={() => setOpen((v) => !v)}>
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`absolute z-30 w-max max-w-[14rem] rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium leading-snug text-foreground shadow-lg ${SIDES[side]}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
