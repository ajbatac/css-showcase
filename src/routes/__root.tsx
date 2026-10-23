import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Github, Search } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { SendToLLM } from "@/components/send-to-llm";
import { SearchPalette } from "@/components/search-palette";
import { ShareCardSection } from "@/components/share-card";
import { NotFoundPage } from "@/components/not-found";
import { SITE_URL } from "@/lib/seo";
import appCss from "../styles.css?url";

/**
 * Applies the stored/system theme before first paint so dark-mode users never
 * see a light flash. Must stay inline in <head>; keep in sync with ThemeToggle.
 */
const THEME_INIT_SCRIPT = `(function(){try{var e=localStorage.getItem("theme");var d=e==="dark"||(e===null&&window.matchMedia("(prefers-color-scheme: dark)").matches);var c=document.documentElement.classList;d?c.add("dark"):c.remove("dark")}catch(e){}})();`;

function SearchButton({ onClick, compact = false }: { onClick: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search demos"
      aria-keyshortcuts="Control+k Meta+k"
      className={`inline-flex items-center gap-2 border border-border bg-background/80 font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-foreground ${
        compact
          ? "h-9 w-9 justify-center rounded-full"
          : "h-9 rounded-full px-3 text-xs justify-center"
      }`}
    >
      <Search className="h-4 w-4" />
      {!compact && (
        <span className="hidden sm:inline">
          Search
          <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
            ⌘K
          </kbd>
        </span>
      )}
    </button>
  );
}

function GitHubLink() {
  return (
    <a
      href="https://github.com/ajbatac/css-showcase"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="CSS Showcase on GitHub"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent"
    >
      <Github className="h-4 w-4" />
    </a>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ location }) => {
    // Canonical path straight from the router location — during SSR this is
    // derived from the request URL, and it needs no server-only import
    // (importing "@tanstack/react-start/server" here trips vite's
    // import-protection in dev and breaks client hydration).
    return { pathname: location.pathname };
  },
  head: ({ loaderData }) => {
    const canonical = `${SITE_URL}${loaderData?.pathname ?? ""}`;
    const ogImage = `${SITE_URL}/og-2.png`;
    const description = "Live CSS demos with the code for each example.";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "CSS Showcase" },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
        { name: "theme-color", content: "#0f1014", media: "(prefers-color-scheme: dark)" },
        { property: "og:site_name", content: "CSS Showcase" },
        { property: "og:title", content: "CSS Showcase" },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: ogImage },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1678" },
        { property: "og:image:height", content: "937" },
        { property: "og:image:alt", content: "CSS Showcase logo on a demo interface" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "CSS Showcase" },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: canonical },
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "CSS Showcase changelog",
          href: `${SITE_URL}/changelog/rss`,
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", sizes: "32x32", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
        { rel: "icon", type: "image/png", sizes: "128x128", href: "/favicon-128x128.png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512x512.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md"
      >
        Skip to content
      </a>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen w-full">
          {/* Sidebar hides on mobile via shadcn's built-in md: breakpoint */}
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="hidden h-20 items-center gap-2 bg-background/60 px-3 backdrop-blur md:flex">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-1.5">
                <SearchButton onClick={() => setSearchOpen(true)} />
                <SendToLLM />
                <ThemeToggle />
                <GitHubLink />
              </div>
            </header>
            <hr className="hidden border-t border-border md:block" />
            <div className="fixed right-3 top-3 z-50 flex items-center gap-1.5 md:hidden">
              <SidebarTrigger className="h-9 w-9 rounded-full border border-border bg-background/80 shadow-sm backdrop-blur" />
              <SearchButton onClick={() => setSearchOpen(true)} compact />
              <SendToLLM />
              <ThemeToggle />
              <GitHubLink />
            </div>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
            <ShareCardSection />
            <footer className="mt-auto">
              <hr className="border-t border-border" />
              <div className="mx-auto max-w-3xl px-5 py-4 md:max-w-5xl xl:max-w-6xl">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>CSS Showcase · live demos with the code</span>
                  <a
                    href="https://github.com/ajbatac/css-showcase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" />
                    ajbatac/css-showcase
                  </a>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/70">
                    Support our other projects:
                  </span>
                  <a
                    href="https://launch-wizard.techhive.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    Launch Wizard
                  </a>
                  <span className="inline-flex items-center gap-1.5">
                    by
                    <a
                      href="https://ajbatac.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-foreground"
                    >
                      Allan Batac
                    </a>
                  </span>
                </div>
                <nav
                  aria-label="Legal"
                  className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
                >
                  <span className="font-medium text-foreground/70">Legal:</span>
                  <Link to="/terms" className="transition-colors hover:text-foreground">
                    Terms
                  </Link>
                  <Link to="/privacy" className="transition-colors hover:text-foreground">
                    Privacy
                  </Link>
                  <Link to="/dmca" className="transition-colors hover:text-foreground">
                    DMCA
                  </Link>
                  <Link to="/cookies" className="transition-colors hover:text-foreground">
                    Cookies
                  </Link>
                  <Link to="/disclaimer" className="transition-colors hover:text-foreground">
                    Disclaimer
                  </Link>
                  <Link to="/ugc-disclaimer" className="transition-colors hover:text-foreground">
                    UGC
                  </Link>
                </nav>
              </div>
            </footer>
          </div>
        </div>
      </SidebarProvider>
      <Toaster position="top-center" />
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </QueryClientProvider>
  );
}
