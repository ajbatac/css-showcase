# Changelog (internal)

Technical record of changes. The public-facing version lives at `/changelog` (src/routes/changelog.tsx) and stays non-technical.

## v0.2 — September 13, 2026

### Brand

- Renamed the app from "Modern CSS" to "CSS Showcase" across all 37 route files, the sidebar, and all meta/OG strings (`src/routes/*.tsx`, `src/components/app-sidebar.tsx`).
- Removed the lucide `Sparkles` icon from the brand chrome entirely.
- Added the full favicon set in `public/` (`favicon.svg`, `favicon.ico`, `favicon-16/32/48/128`, `apple-touch-icon.png`, `android-chrome-192/512`) and updated `public/site.webmanifest` (name "CSS Showcase", theme `#ffffff`). Links wired in `src/routes/__root.tsx` `head()`.
- Logo `public/logo.png` in the sidebar header: 64px (`h-16 w-16 rounded-xl`), drops to 32px in the collapsed icon rail, wrapped in a home `<Link to="/">`. Brand row is `h-20` and matches the content header height so the two `<hr>` rules sit at the same y-coordinate (`src/components/app-sidebar.tsx`, `src/routes/__root.tsx`).
- OG image `public/og-2.png` (1678x937) with full OG/Twitter meta: `og:image:type/width/height/alt`, `twitter:card summary_large_image`, `og:site_name`, dual `theme-color` with `prefers-color-scheme`, `robots index,follow`.
- Canonical domain handling: `src/lib/seo.ts` exports `SITE_URL = "https://css.techhive.net"`. The root loader captures the request pathname server-side:

  ```ts
  const { getRequest } = await import("@tanstack/react-start/server");
  const req = getRequest();
  if (req) pathname = new URL(req.url).pathname;
  ```

  `head()` then emits `<link rel="canonical" href={`${SITE_URL}${pathname}`}>` plus `og:url` per page. Dynamic import inside `import.meta.env.SSR` is tree-shaken from the client bundle.

### Open-source preparation

- Removed all Lovable identifiers: deleted `src/lib/lovable-error-reporting.ts` (+ its call in `__root.tsx`), `.lovable/`, `AGENTS.md`, the `@lovable.dev/vite-tanstack-config` dependency, and `author: Lovable` / `twitter:@Lovable` meta.
- Replaced the Lovable vite wrapper with a standard config (`vite.config.ts`): `@tailwindcss/vite`, `vite-tsconfig-paths`, `tanstackStart` (importProtection + `server: { entry: "server" }`), `nitro` from `nitro/vite`, `@vitejs/plugin-react`, `css.transformer: lightningcss`, `@` alias, react dedupe list. Key gotcha: `nitro()` returns an array of plugins, so it must be spread conditionally:

  ```ts
  ...(command === "build" ? [nitro({ preset: ... })] : []),
  ```

  An object spread of the array silently produces a dead plugin and only the client builds.

- Preset resolution: `process.env.NITRO_PRESET ?? (process.env.CF_PAGES ? "cloudflare-pages" : "node-server")`. Cloudflare Pages builds land in `dist/` (`_worker.js`, assets, `_routes.json`, `_headers`); Node builds land in `.output/` and `npm run preview` runs `node .output/server/index.mjs` (the previous `vite preview` script was broken and expected `dist/server/server.js`).
- Added `routeRules` header so `/changelog/rss` serves `application/rss+xml` on every preset.
- `package.json` renamed to `css-showcase` with a description; `bunfig.toml` trimmed to `saveTextLockfile`.
- CI in `.github/workflows/ci.yml`: bun install, lint, node build, Cloudflare Pages build (`CF_PAGES=1`), Cloudflare Workers build (`build:cf`).
- Repo formatted with Prettier (`.prettierignore` extended with `.agents`, `public`); ESLint reports 0 errors (8 benign `react-refresh` warnings from shadcn-style variant exports).

### HMR fix

- Symptoms: stale reloads, "keep restarting". Causes found: duplicate vite dev processes fighting over `.tanstack` generated files, a stale server across `vite.config.ts` changes, and React Fast Refresh rejecting `app-sidebar.tsx` ("CATEGORY_ORDER export is incompatible").
- Fix: extracted the demo registry to `src/lib/demos.ts` (`DemoCategory`, `Demo`, `CATEGORY_ORDER`, `DEMOS`, 37 entries with their lucide icon imports). `app-sidebar.tsx` now exports only the component; `src/routes/demos.tsx` imports from the new module. Verified via headless Chrome that sidebar edits hot-swap with no invalidate and no state loss.
- `vite.config.ts` also gained `optimizeDeps.include` (react family) to prevent dep-optimization reload storms, and `server.watch.ignored` for `**/.tanstack/tmp/**`.

### Features

- Send to LLM CTA (`src/components/send-to-llm.tsx`): primary pill in the top bar and mobile cluster on every page. Looks up the current route in `DEMOS`, builds a detailed prompt with `raw.githubusercontent.com` source links and adaptation instructions (or a site-clone prompt fallback), copies via `navigator.clipboard`, confirms with a sonner toast.
- 404 page (`src/components/not-found.tsx` + splat `src/routes/$.tsx` throwing `notFound()`, rendered via root `notFoundComponent`): keeps a real 404 status code. Giant 4-0-4 with a spinning loading-ring zero, floating CSS property chips on pure-CSS keyframes, `prefers-reduced-motion` respected, decorative chips `aria-hidden`, center-a-div easter egg, Back to home link.
- GitHub link (lucide `Github`) in the top bar and mobile cluster, styled to match the theme toggle.
- Global footer (`mt-auto` in the content column): `hr` rule, brand line, "Support our other projects:" with Launch Wizard (https://launch-wizard.techhive.net/) by Allan Batac (https://ajbatac.com), and a Legal nav with six pages.
- Legal pages `src/routes/{terms,privacy,dmca,cookies,disclaimer,ugc-disclaimer}.tsx` built on a shared `src/components/legal-page.tsx`. Static date "September 13, 2026" everywhere; no dynamic dates.
- Public `/changelog` page (`src/routes/changelog.tsx`), RSS feed at `/changelog/rss` (`public/changelog/rss`, extensionless so the URL is exact), `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml`.

### SEO files

- `public/robots.txt`: allow all, sitemap pointer to `https://css.techhive.net/sitemap.xml`.
- `public/sitemap.xml`: 45 URLs (home, /demos, /components, 37 demo routes, 6 legal pages, /changelog), lastmod 2026-09-13.
- `public/llms.txt`: site summary with canonical links (home, demos, changelog, RSS, GitHub, legal).
- RSS autodiscovery `<link rel="alternate" type="application/rss+xml">` added to the root `head()`.

### Bug fixes

- `npm run preview` fixed (see Open-source preparation).
- Removed the duplicate "CSS Showcase · Live demos" text from the top bar (brand lives in the sidebar only).
- Sidebar header rule and content header rule now align at the same height (both `h-20` rows above their `<hr>`).
