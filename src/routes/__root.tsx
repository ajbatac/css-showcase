import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Github } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { SendToLLM } from "@/components/send-to-llm";
import appCss from "../styles.css?url";

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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CSS Showcase" },
      { name: "description", content: "Live CSS demos with the code for each example." },
      { property: "og:title", content: "CSS Showcase" },
      { property: "og:description", content: "Live CSS demos with the code for each example." },
      { property: "og:type", content: "website" },
    ],
    links: [
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
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
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

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen w-full">
          {/* Sidebar hides on mobile via shadcn's built-in md: breakpoint */}
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="hidden h-20 items-center gap-2 bg-background/60 px-3 backdrop-blur md:flex">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-1.5">
                <SendToLLM />
                <ThemeToggle />
                <GitHubLink />
              </div>
            </header>
            <hr className="hidden border-t border-border md:block" />
            <div className="fixed right-3 top-3 z-50 flex items-center gap-1.5 md:hidden">
              <SendToLLM />
              <ThemeToggle />
              <GitHubLink />
            </div>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
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
    </QueryClientProvider>
  );
}
