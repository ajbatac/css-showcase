import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "server" },
    }),
    // nitro() returns an array of plugins, so it can only be spread conditionally.
    // Preset resolution: NITRO_PRESET wins; Cloudflare Pages sets CF_PAGES during
    // its build and nitro's cloudflare-pages preset is used there; locally we
    // default to node-server (run with `npm run preview`).
    ...(command === "build"
      ? [
          nitro({
            preset:
              process.env.NITRO_PRESET ??
              (process.env.CF_PAGES ? "cloudflare-pages" : "node-server"),
            cloudflare: { nodeCompat: true, deployConfig: true },
            routeRules: {
              "/changelog/rss": {
                headers: { "content-type": "application/rss+xml; charset=utf-8" },
              },
            },
          }),
        ]
      : []),
    viteReact(),
  ],
  css: { transformer: "lightningcss" },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  server: {
    watch: {
      // the TanStack router plugin regenerates this dir on every route change
      ignored: ["**/.tanstack/tmp/**"],
    },
  },
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
