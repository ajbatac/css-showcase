# AGENTS.md

CSS Showcase — an open-source library of live CSS demos (https://css.techhive.net). Every demo page pairs a working interactive example with the CSS that drives it, and reshapes itself across desktop / iPad / mobile viewports. TanStack Start (SSR) + React 19 + Tailwind CSS v4 + Vite 8 + Nitro 3 (beta).

## Commands

Bun is the package manager (`bun.lock`, CI uses bun). npm also works.

```sh
bun install          # install dependencies
bun run dev          # dev server (URL printed in terminal)
bun run build        # production build → .output/ (node-server preset)
bun run preview      # serve the node build: node .output/server/index.mjs
bun run build:cf     # Cloudflare Workers module preset build
CF_PAGES=1 bun run build   # Cloudflare Pages preset build → dist/
bun run lint         # eslint (8 benign react-refresh warnings from shadcn-style exports are expected)
bun run format       # prettier --write .
```

There is no test framework; CI (`.github/workflows/ci.yml`) runs lint plus all three build presets. All three builds must pass before a change is done.

Prettier: 100 printWidth, double quotes, semicolons, trailing commas. TypeScript is strict with `@/*` aliased to `src/*`.

## Architecture

- `src/routes/` — TanStack Router **file-based routing**. One `.tsx` file per route. `routeTree.gen.ts` is auto-generated: never edit it. Do not create Next.js-style `src/pages/` or `app/layout.tsx`; the only root layout is `src/routes/__root.tsx` (app shell: sidebar, header with Send to LLM / theme toggle / GitHub, footer, legal nav, head/meta with canonical URL). See `src/routes/README.md`.
- `src/lib/demos.ts` — the demo registry (single source of truth). Drives the sidebar (`app-sidebar.tsx`), the `/demos` index, and the Send to LLM feature. 37 demos, each with slug/name/path/lucide icon/category.
- `src/routes/<slug>.tsx` — demo implementations. Each route file holds its patterns, a `CSS_BY_PATTERN` map for the code panel, a scoped `<style>` block, and a local `DeviceFrame`. The device/pattern switchers and copy buttons are shared components (below), imported per route.
- `src/components/patterns/pattern-*.tsx` — shared, reusable pattern components (button, card, modal, switch, …) built on design tokens. `pattern-switcher.tsx` exports `DeviceTabs` and `PatternList` — the radiogroup-semantics switchers every demo uses (arrow keys, roving tabindex). Use them; do **not** hand-roll new `role="tab"` switchers.
- `src/components/copy-button.tsx` — `CopyButton` with toast feedback. Never write a bare `navigator.clipboard?.writeText(...)` handler; it fails silently.
- `src/components/search-palette.tsx` — the ⌘K / Ctrl+K / `/` command palette (recent demos + all demos + browse links, strict ranked filter). Open state lives in `__root.tsx`; triggers render in the desktop header and the mobile cluster.
- `src/components/share-card.tsx` — the per-demo 2048×2048 share-image section (mounted in `__root.tsx` after `<Outlet />`, renders only on demo pages). Rasterizes a 1024px card with **html2canvas-pro** at scale 2; the device snapshot is a live clone of the page's `[data-device]` frame. Copy per demo lives in `src/lib/demo-share.ts` (extracted from route JSX — regenerate/keep in sync when editing a demo's h1, subtitle, or feature list). Gotchas baked in: vanilla html2canvas throws on this design system's oklch tokens (must use `-pro`), html2canvas collapses spaces in flex-row text nodes (multi-word labels use word-per-span with flex gap), and the capture node must stay rendered offscreen (`position: fixed; left: -12000px`), never `display: none`.
- `src/components/ui/` — shadcn/ui components (Radix primitives). Rarely modified.
- `src/lib/demos.ts` — the demo registry (`DEMOS`, `CATEGORY_ORDER`, `DEMO_DESCRIPTIONS`). Drives the sidebar, `/demos`, the search palette, and Send to LLM.
- `src/lib/demo-state.ts` — `useDemoSearch()` / `seedPatterns()` / `useDemoUrlSync()`: demos read `?device=&pattern=` loosely from the URL (deliberately not route `validateSearch`), and `useDemoUrlSync(device, pattern)` writes changes back to the address bar (replace, not push). `src/lib/demo-permalink.tsx` has the `CopyLinkButton`.
- `src/server.ts` — custom SSR server entry wrapping TanStack Start's server-entry; normalizes h3-swallowed 500s into the HTML error page. Wired via `server: { entry: "server" }` in `vite.config.ts`.
- `src/lib/seo.ts` — `SITE_URL` canonical origin. Public assets in `public/` include `robots.txt`, `sitemap.xml`, `llms.txt`, and the static RSS feed `public/changelog/rss` (its `application/rss+xml` content-type comes from nitro `routeRules` in `vite.config.ts`).
- Legal pages (`terms`, `privacy`, `dmca`, `cookies`, `disclaimer`, `ugc-disclaimer`) all render through `src/components/legal-page.tsx`.
- 404: splat route `src/routes/$.tsx` throws `notFound()`, rendered by the root `notFoundComponent` so the real 404 status code is kept.
- Theme: an inline blocking script in `__root.tsx` (`THEME_INIT_SCRIPT`) applies the stored/system theme before first paint; `ThemeToggle` reads the result back and persists to localStorage **only on explicit click**. If you touch one, keep the other in sync.
- Security headers (CSP, X-Frame-Options, Referrer-Policy, etc.) come from the nitro `routeRules` `"/**"` entry in `vite.config.ts` and apply to all three build presets.

## Adding a new demo

1. Create `src/routes/<slug>.tsx` following an existing demo (e.g. `buttons.tsx`): `createFileRoute` with a `head()` function (title `"<Name> — CSS Showcase"`, description, og:title/og:description/og:type, twitter:card), then the component.
2. Register it in `src/lib/demos.ts` (`DEMOS` array: slug, name, short, path, lucide icon, status, category) and add a one-liner to `DEMO_DESCRIPTIONS`. The sidebar, `/demos`, and the ⌘K palette pick it up automatically.
3. Anatomy of a demo page: header → featured demo card (`DeviceFrame` with `aspectRatio` per device) → `<DeviceTabs value={device} onChange={setDevice} />` → `<PatternList options={options} value={pattern} onChange={…} />` + `CopyLinkButton` → CSS code panel with `<CopyButton getText={() => CSS_BY_PATTERN[pattern]} />` → "CSS features used" list.
4. Seed device/pattern state from the URL via `useDemoSearch()` + `seedPatterns()`, then call `useDemoUrlSync(device, pattern)` so the address bar follows selections.
5. Demo CSS lives in a `<style>` block inside the route and must reference the semantic tokens **directly** — `var(--primary)`, `color-mix(in srgb, var(--border) 30%, transparent)` — never `hsl(var(--primary))`: the tokens are oklch and `hsl(oklch(...))` is invalid CSS that silently computes to transparent (this bug shipped on 12 routes before being caught). JS is for state only — the site's premise is pure modern CSS (flex, grid, container queries, aspect-ratio, custom properties, sticky, backdrop-filter).
6. Accessibility is a stated project value: semantic HTML, keyboard navigation (radiogroup switchers give you arrows for free), labelled form controls, visible focus states. Mobile-first — and remember the mobile cluster + sidebar sheet are the only mobile nav.
7. Update the public changelog (`src/routes/changelog.tsx`, non-technical wording) and `CHANGELOG.md` (internal technical record) when shipping user-visible changes.

## Gotchas

- **HMR / Fast Refresh**: route and component files must export only components/Routes. Mixing in non-component exports (like a data registry) breaks Fast Refresh — that is why the demo registry lives in `src/lib/demos.ts` instead of `app-sidebar.tsx`.
- **`@tanstack/react-start/server` must never appear in the client module graph** — vite's import-protection denies it with `behavior: "error"` even inside `if (import.meta.env.SSR)` guards and even from `.server.ts` modules, which kills client hydration in dev (a full-screen vite error overlay; production builds tree-shake it and look fine). The root loader gets the canonical path from `location.pathname` instead. Don't reintroduce a `getRequest()` import.
- **vite.config.ts**: `nitro()` returns an *array* of plugins and must be spread conditionally inside `command === "build"`; an object spread of it silently yields a dead plugin. Preset resolution is `NITRO_PRESET ?? (CF_PAGES ? "cloudflare-pages" : "node-server")`.
- `vite dev` regenerates `.tanstack/tmp/` on route changes; it's already in the watch-ignore list — don't remove that.
- Two lockfiles exist (`bun.lock` and `package-lock.json`); prefer bun to keep `bun.lock` authoritative for CI's `--frozen-lockfile`.
- cmdk's default fuzzy filter is far too loose for the palette ("tooltip" matched "Dividers"); the palette passes a strict ranked `filter` — keep it if you touch search.
