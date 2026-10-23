# Changelog (internal)

Technical record of changes. The public-facing version lives at `/changelog` (src/routes/changelog.tsx) and stays non-technical.


## v0.3 — October 23, 2026

Release checkpoint: 44 demos, ⌘K palette + URL state, 2048px share cards, Manila Sunrise rebrand, security headers, full a11y/mobile repair pass. Net −2,600 lines via deduplication. Footer version bumped to v0.3 (links to /changelog).

### Added

- **Eight new form demos** (36 → 44), all in the Forms category, closing the gaps found in the form-element audit:
  - `/numbers` — Number Inputs & Steppers: stepper rows, currency/unit affixes, restyled native spin buttons, touch steppers, cart quantity rows (`appearance: textfield`, `::-webkit-inner-spin-button`).
  - `/color-pickers` — Color Pickers: swatch grid with `aria-pressed`, native `input[type=color]` reskinned via `::-webkit-color-swatch(-wrapper)` + `::-moz-color-swatch`, live hex readout, checkerboard preview card.
  - `/combobox` — Combobox & Autocomplete: native `datalist` (with the "popup is UA-drawn" teaching note) and a custom filtered listbox with `role=listbox/option`, `aria-expanded/controls`, `<mark>` match highlighting.
  - `/fieldsets` — Fieldsets & Legends: classic floating legend, radio group fieldset (legend as accessible name) with `:has(input:checked)` cards, `fieldset:disabled` one-attribute group disabling, stacked mobile sections.
  - `/meters` — Meters & Gauges: native `<meter>` with low/high/optimum range coloring, `::-webkit-meter-*` score gauge + `::-moz-meter-bar`, segmented data-attribute gauge, storage rows.
  - `/outputs` — Output & Live Results: `<output for=…>` with live invoice totals, km→mi converter, slider readout, tip calculator; `key`-retriggered pop animation + `aria-live`.
  - `/time-pickers` — Time Pickers: restyled `input[type=time]` with `::-webkit-calendar-picker-indicator` (dark-mode `filter: invert`), `step=900` minute snapping, midnight-safe duration readout, from/to touch row.
  - `/otp-input` — OTP & Verification Codes: hand-rolled six-cell code input (auto-advance, backspace navigation, arrow keys, paste distribution, `autocomplete="one-time-code"`, `inputMode=numeric`, `data-filled` cells, reduced-motion-gated pop) — no dependency.
- Registry (`demos.ts`: DEMOS + DEMO_DESCRIPTIONS + 8 lucide icons), share metadata (`demo-share.ts`), sitemap.xml (+8 URLs), llms.txt and README counts (44).
- **Per-demo 2048×2048 share cards.** Every demo page now has a "Share this demo as a 1:1 image" section (mounted in `__root.tsx` after `<Outlet />`, demo pages only) with a live scaled preview, Download PNG, and Copy image. The card composes brand row (logo + wordmark + css.techhive.net), the demo h1 + subtitle, a **live clone of the page's DeviceFrame** (follows the device/pattern selected on the page — desktop, iPad, or mobile), the "CSS features used" chips, and a footer with the canonical URL. Implementation: `src/components/share-card.tsx` + `src/lib/demo-share.ts` (per-demo copy extracted from route JSX, 36 entries).
  - **Dependency: `html2canvas-pro`** (not vanilla `html2canvas` — verified: vanilla throws `unsupported color function "oklch"` on this design system; the `-pro` fork handles oklch and color-mix). Capture renders the offscreen 1024px card at scale 2.
  - Capture gotchas handled: html2canvas collapses whitespace in flex-row text nodes (multi-word labels render as word-per-span with flex gap); the capture source must stay rendered (offscreen fixed, not display:none); snapshot clone re-renders fresh at capture time so the PNG always matches the live device/pattern.
- **⌘K / Ctrl+K / `/` command palette** (`src/components/search-palette.tsx`, cmdk): searches all demos by name/category/description with a strict ranked filter (cmdk's default fuzzy matched "tooltip"→"Dividers"), shows 5 recent demos (localStorage), and Browse links. Triggers in the desktop header and mobile cluster; open state in `__root.tsx`.
- **Live URL state**: `useDemoUrlSync(device, pattern)` in `src/lib/demo-state.ts` writes `?device=&pattern=` on every selection change (replace), so refresh/back/forward preserve demo state. Wired into 33 pattern routes + index/flex (grid already had its own).
- **Security headers** via nitro `routeRules "/**"` (applies to all three presets, verified live on the node build): CSP (`default-src 'self'`, inline script/style allowed for the theme script + demo `<style>` blocks, `frame-ancestors 'none'`), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy. `form-action 'self'` — loosen before adding a CodePen POST export.
- **Skip-to-content link** (first focusable element in the root) + `id="main-content"` on every route's `<main>` + `<nav aria-label="Demo library">` landmark wrapping the sidebar groups.

### Fixed

- **time-pickers (mobile device): the "To" time input was clipped** — two native `input[type=time]` fields side by side need ~290px (the UA slots are ~134px each in 12-hour locales) but the 260px frame gives 236px; the second field lost its AM/PM tail and picker icon. The From/to pattern now stacks vertically on the phone frame, and the pattern copy teaches the math.
- **Mobile pages: floating action cluster overlapped the page header.** The cluster grew to five buttons (sidebar + search added in v0.3) and sat on top of the eyebrow/h1 text on phones. All 48 pages now use `pt-16 md:pt-10` so content starts below the cluster; desktop is unchanged.
- **OTP demo (mobile device): only 4 of 6 code cells fit** in the 220px frame — fixed-width cells overflowed. The big-cells layout is now a fluid 6-column grid, and the wrapper-class detection bug (`startsWith("otp-big")` vs the actual `otp-cell-big` class) that prevented the grid from applying is fixed.
- **Share card: empty snapshot band on demos with long copy** (reported on /selects and /checkboxes). The 1024px card is a fixed flex column; an uncapped 2-line h1 + 4-line subtitle + 3 chip rows squeezed the snapshot band to 25px, so the device clone scaled to a sliver. Fix: guaranteed band min-height (316px), subtitle truncated at 140 chars with an ellipsis, chips capped at 6, h1 steps down to 54px above 42 chars.
- **Share card: on-page preview was cropped** — the fit-to-box transform used `scale(calc(100cqw / 1024))`, which is invalid CSS (scale() needs a number, not a length) and silently dropped the transform, clipping the 1024px card inside the 344px preview box. The scale is now computed in JS from a ResizeObserver.
- **Pre-existing: `hsl(var(--token))` computed to transparent** on 12 routes (~200 declarations in demo `<style>` blocks: buttons, inputs, textareas, sliders, checkboxes, switches, accordions, tabs, search, dividers, uploaders, form-validation). The tokens are oklch, so `hsl(oklch(...))` is invalid CSS — every such fill/border/text color has been silently transparent since the oklch migration. Replaced with direct `var(--x)` references and `color-mix(in srgb, var(--x) N%, transparent)` for alpha variants.
- **Mobile navigation was unreachable.** `SidebarTrigger` only rendered inside the `hidden md:flex` desktop header, so below 768px there was no way to open the nav sheet (only Cmd/Ctrl+B, impossible on touch); the sheet's close button was also CSS-hidden (`[&>button]:hidden`). Added a trigger to the fixed mobile cluster and un-hid the close button.
- **`vite dev` was hard-broken**: `[import-protection] Import denied in client environment` for the SSR-guarded `@tanstack/react-start/server` dynamic import in `__root.tsx` killed client hydration (full-screen vite overlay, zero interactivity; ~8k error lines per dev session; production unaffected). Root cause: import-protection denies the specifier anywhere in the client graph — `import.meta.env.SSR` guards and `.server.ts` modules do NOT save you (verified both). Fix: the root loader reads `location.pathname` (router-core; server-derived during SSR) — no server import at all. Canonical/og:url unchanged.
- **Theme flash + preference freeze**: dark class was applied post-hydration (FOUC on every load for dark users) and the toggle wrote localStorage on first mount, freezing the system preference forever. Now a blocking inline script (`THEME_INIT_SCRIPT` in `__root.tsx`) applies the theme pre-paint; `ThemeToggle` persists only on explicit clicks.
- **36 silent copy buttons**: CSS-panel copies used bare `navigator.clipboard?.writeText(...)` — no catch, no feedback, unhandled rejections. All replaced with the shared `CopyButton` (toast + Copied! state + failure toast).
- **69 fake tablists**: every demo's device/pattern switchers declared `role="tab"` without arrow keys/aria-controls/tabpanel. Replaced by shared `DeviceTabs`/`PatternList` (`src/components/patterns/pattern-switcher.tsx`) with radiogroup semantics (roving tabindex, arrows, Home/End). `sliders.tsx` rating radiogroup got arrow keys; its sliders got associated labels/aria-labels.
- **Cookies/llms.txt/README accuracy**: cookies page claimed "does not set cookies" while `ui/sidebar.tsx` sets `sidebar_state`; README/llms.txt said "37 demos" (registry has 36; Send-to-LLM prompt made dynamic). Copy now discloses the functional cookie.

### Changed

- **Rebranded to the "Manila Sunrise" palette** (user-supplied: `#9E7C88 #9B5A56 #874300 #443100 #171A00`).
  - Light mode: `--primary` (brand ink) is now `#171A00` (deep olive-black); neutrals warmed to ivory (`#FDFCF7` background, warm card/borders); ring is terracotta `#9B5A56`.
  - Dark mode: surfaces built from `#171A00` (background `#171A00`, card `#202410`, accents `#262A14`–`#2B2F16`); primary inverts to warm cream `#EFEC D9` with `#171A00` as primary-foreground (a literal `#171A00` primary on a `#171A00` field would be invisible — the ink/ground relationship inverts, as before).
  - Charts carry the five palette colors in light mode and lifted versions in dark mode for contrast.
  - Share card hexes follow the brand (field `#171A00`, terracotta accent `#C98F88` replacing teal); `theme-color` metas updated.
  - WCAG audit: all 15 critical fg/bg pairs pass (4.5:1 text, 3:1 large/UI) — computed, not eyeballed.
  - Known follow-up: the violet logo/favicon are assets and still pre-date the palette.
- **Mobile device frame widened 220px → 260px across all 45 demos.** The 220px frame cramped dense content (six OTP cells were 22px wide with 20px digits); at 9:19.5 the extra width makes the frame taller too. Still responsive — `w-full` shrinks it below 260px on narrow viewports (verified at 320px). OTP big-cells proportionally restored to 3.5rem tall with 1.5rem digits.
- Demo routes now import `DeviceTabs`/`PatternList`/`CopyButton` instead of carrying copy-pasted switcher/copy markup (36 routes, −2.7k lines). `DEMO_DESCRIPTIONS` moved from `routes/demos.tsx` to `lib/demos.ts` (powers `/demos` + palette).
- `theme-toggle.tsx` rewritten (reads painted class, persists on click only).
- AGENTS.md updated for the new anatomy + the import-protection gotcha.

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
