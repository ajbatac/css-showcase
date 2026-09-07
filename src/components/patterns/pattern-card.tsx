import * as React from "react";

export type PatternCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  /** Stacks on narrow containers, goes side-by-side once the container is wide enough. */
  orientation?: "auto" | "vertical" | "horizontal";
  className?: string;
};

/** Container-query card: reflows on its own width, not the viewport's. */
export function PatternCard({
  title,
  description,
  eyebrow,
  media,
  footer,
  orientation = "auto",
  className = "",
}: PatternCardProps) {
  const layout =
    orientation === "horizontal"
      ? "flex-row items-center"
      : orientation === "vertical"
        ? "flex-col"
        : "flex-col @[26rem]:flex-row @[26rem]:items-center";

  return (
    <article
      className={`@container overflow-hidden rounded-2xl border bg-card shadow-sm ${className}`}
    >
      <div className={`flex gap-4 p-4 ${layout}`}>
        {media && (
          <div className="grid aspect-video w-full shrink-0 place-items-center overflow-hidden rounded-xl bg-muted @[26rem]:aspect-square @[26rem]:w-28">
            {media}
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h3 className="mt-1 truncate text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {footer && <div className="border-t bg-muted/30 px-4 py-3">{footer}</div>}
    </article>
  );
}
