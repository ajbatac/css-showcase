# CSS Showcase

A collection of live CSS demos. Every page pairs a working example with the CSS that drives it, so you can watch a pattern behave and read the code behind it without leaving the page.

The site is mobile-first. Demos are sized for phone screens first and scale up on desktop, and a toggle switches between light and dark themes.

## What's inside

37 demos grouped into seven categories: layout, forms, navigation, feedback, overlays, data display, and utilities. The full list lives in the app sidebar, and `/demos` is an index page for all of them.

The home page is the flagship demo: a device switcher. A skeleton app reshapes itself between desktop, iPad, and mobile views using container queries, `aspect-ratio`, and custom properties, with no JavaScript driving the layout.

Each demo page shows the example first and the CSS for the selected pattern below it in a code panel.

## Running locally

You need Node.js 20.19 or newer (Bun 1.1+ also works; the repo ships a `bun.lock`).

```sh
git clone https://github.com/ajbatac/css-showcase.git
cd css-showcase
npm install
npm run dev
```

The dev server URL is printed in the terminal.

For a production build and a running server:

```sh
npm run build
npm run preview
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

- `src/routes/` one file per demo, mounted through TanStack file-based routing
- `src/components/patterns/` the demo implementations the routes render
- `src/components/ui/` UI primitives built on Radix UI and Tailwind CSS
- `src/components/app-sidebar.tsx` the demo registry (`DEMOS` array) and the sidebar
- `src/styles.css` theme tokens for light and dark mode

## Adding a demo

1. Create a route file in `src/routes/`, for example `toggles.tsx`.
2. Build the demo in `src/components/patterns/` or inline in the route.
3. Register it in the `DEMOS` array in `src/components/app-sidebar.tsx` with a category, icon, and path.
4. Run `npm run dev` and check it in the sidebar.

## Tech stack

TanStack Start with server-side rendering, TanStack Router, React 19, Tailwind CSS v4, Radix UI primitives, Vite, and Nitro for the server build. TypeScript throughout.

## Contributing

Issues and pull requests are welcome. Run `npm run lint` before opening a pull request.
