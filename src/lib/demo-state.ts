import { useRouterState } from "@tanstack/react-router";

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
