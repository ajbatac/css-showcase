import { useEffect, useRef } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

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
  if (device && pattern && patternsByDevice[device]?.some((option) => option.id === pattern)) {
    return { ...defaults, [device]: pattern } as Record<D, P>;
  }
  return defaults;
}

/**
 * Keeps ?device=&pattern= in the address bar in sync with the demo's current
 * selection (replace, not a history entry), so refresh, back/forward, and
 * copied links all preserve the exact demo state.
 */
export function useDemoUrlSync(device: string, pattern?: string) {
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Build the href from the live query string (not the typed search schema)
    // so demos without validateSearch still preserve any foreign params.
    const params = new URLSearchParams(window.location.search);
    params.set("device", device);
    if (pattern) params.set("pattern", pattern);
    else params.delete("pattern");
    router.navigate({
      href: `${window.location.pathname}?${params.toString()}`,
      replace: true,
    });
  }, [device, pattern, router]);
}
