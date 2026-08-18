import { useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";

export type DemoSearch = { device?: string; pattern?: string };

/** Reads ?device=&pattern= from the current location without per-route validation. */
export function useDemoSearch(): DemoSearch {
  const search = useRouterState({ select: (s) => s.location.search }) as
    | Record<string, unknown>
    | undefined;
  return {
    device: typeof search?.device === "string" ? search.device : undefined,
    pattern: typeof search?.pattern === "string" ? search.pattern : undefined,
  };
}

/** Applies a shared ?device=&pattern= pair onto a demo's default pattern map. */
export function seedPatterns<D extends string, P extends string>(
  patternsByDevice: Record<D, { id: P }[]>,
  initial: DemoSearch,
  defaults: Record<D, P>,
): Record<D, P> {
  const device = initial.device as D | undefined;
  const pattern = initial.pattern as P | undefined;
  if (
    device &&
    pattern &&
    patternsByDevice[device]?.some((option) => option.id === pattern)
  ) {
    return { ...defaults, [device]: pattern } as Record<D, P>;
  }
  return defaults;
}

export function CopyLinkButton({
  device,
  pattern,
}: {
  device: string;
  pattern: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}?device=${encodeURIComponent(
      device,
    )}&pattern=${encodeURIComponent(pattern)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied", { description: `${device} · ${pattern}` });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy link to the ${device} ${pattern} pattern`}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-[10px] font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3 w-3 text-primary" />
      ) : (
        <Link2 className="h-3 w-3" />
      )}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
