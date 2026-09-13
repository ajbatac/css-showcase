<div align="center">

<img src="public/logo.png" width="112" alt="CSS Showcase logo" />

# CSS Showcase

**Live CSS demos with the code for each example.**

[![Stars](https://img.shields.io/github/stars/ajbatac/css-showcase?style=for-the-badge&logo=github)](https://github.com/ajbatac/css-showcase/stargazers)
[![Forks](https://img.shields.io/github/forks/ajbatac/css-showcase?style=for-the-badge&logo=github)](https://github.com/ajbatac/css-showcase/forks)
[![Issues](https://img.shields.io/github/issues/ajbatac/css-showcase?style=for-the-badge&logo=githubissues)](https://github.com/ajbatac/css-showcase/issues)
[![Last commit](https://img.shields.io/github/last-commit/ajbatac/css-showcase?style=for-the-badge&logo=git&color=blue)](https://github.com/ajbatac/css-showcase/commits/main)
[![CI](https://img.shields.io/github/actions/workflow/status/ajbatac/css-showcase/ci.yml?style=for-the-badge&label=CI)](https://github.com/ajbatac/css-showcase/actions/workflows/ci.yml)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1-FFBF00?style=for-the-badge&logo=tanstack&logoColor=black)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Nitro](https://img.shields.io/badge/Nitro-3-20B2AA?style=for-the-badge)](https://nitro.build/)

<img src="docs/screenshot.png" alt="CSS Showcase running the device switcher demo" width="880" />

</div>

---

A collection of live CSS demos. Every page pairs a working example with the CSS that drives it, so you can watch a pattern behave and read the code behind it without leaving the page. Mobile-first, dark mode included.

## What's inside

- **37 demos** across seven categories: layout, forms, navigation, feedback, overlays, data display, and utilities
- **The device switcher** (home page): a skeleton app that reshapes itself between desktop, iPad, and mobile using container queries, `aspect-ratio`, and custom properties, with no JavaScript driving the layout
- **Code beside every demo**: the example first, the CSS for the selected pattern right below it
- **Light and dark themes** with a toggle, driven by CSS custom properties

## Quick start

```sh
git clone https://github.com/ajbatac/css-showcase.git
cd css-showcase
bun install        # or: npm install
bun run dev        # or: npm run dev
```

The dev server URL is printed in the terminal.

For a production build and a running server:

```sh
bun run build
bun run preview
```

The build lands in `.output`. The server listens on port 3000 by default; set `PORT` to change it.

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server with HMR       |
| `npm run build`     | Production build into `.output`     |
| `npm run build:dev` | Development-mode build              |
| `npm run preview`   | Run the built server from `.output` |
| `npm run lint`      | ESLint over the repo                |
| `npm run format`    | Prettier over the repo              |

## Project layout

| Path                       | Contents                                                       |
| -------------------------- | -------------------------------------------------------------- |
| `src/routes/`              | One file per demo, mounted through TanStack file-based routing |
| `src/components/patterns/` | The demo implementations the routes render                     |
| `src/components/ui/`       | UI primitives built on Radix UI and Tailwind CSS               |
| `src/lib/demos.ts`         | The demo registry: slugs, icons, paths, categories             |
| `src/styles.css`           | Theme tokens for light and dark mode                           |

## Adding a demo

1. Register it in the `DEMOS` array in `src/lib/demos.ts` with a category, icon, and path.
2. Create a route file in `src/routes/`, for example `toggles.tsx`.
3. Build the demo in `src/components/patterns/` or inline in the route.
4. Run `bun run dev` and check it in the sidebar.

## Tech stack

TanStack Start with server-side rendering, TanStack Router, React 19, Tailwind CSS v4, Radix UI primitives, Vite, and Nitro for the server build. TypeScript throughout.

## Deploy

**Cloudflare Pages** (recommended): connect the repository in the Cloudflare dashboard with these settings:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

The build detects Cloudflare's `CF_PAGES` environment and produces a Pages artifact (`_worker.js` plus static assets) in `dist`.

**Cloudflare Workers** as an alternative: `npm run deploy:cf` builds and deploys in one command after a one-time `npx wrangler login`.

Any other Node host works with the standard build: `npm run build` produces a server in `.output` that `npm run preview` runs.

## Contributing

Issues and pull requests are welcome. Run `npm run lint` before opening a pull request.

---

<div align="center">

**CSS Showcase** · live demos with the code · [ajbatac/css-showcase](https://github.com/ajbatac/css-showcase)

**Support our other projects:** [Launch Wizard](https://launch-wizard.techhive.net/) · by [Allan Batac](https://ajbatac.com)

[Terms](https://css.techhive.net/terms) · [Privacy](https://css.techhive.net/privacy) · [DMCA](https://css.techhive.net/dmca) · [Cookies](https://css.techhive.net/cookies) · [Disclaimer](https://css.techhive.net/disclaimer) · [UGC](https://css.techhive.net/ugc-disclaimer)

</div>
