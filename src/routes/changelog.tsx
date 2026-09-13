import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PlusCircle, Wrench, Zap, Rss } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — CSS Showcase" },
      {
        name: "description",
        content:
          "What's new in CSS Showcase. New features, fixes, and improvements, release by release.",
      },
      { property: "og:title", content: "Changelog — CSS Showcase" },
      {
        property: "og:description",
        content:
          "What's new in CSS Showcase. New features, fixes, and improvements, release by release.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ChangelogPage,
});

const NEW_ITEMS = [
  "A new name and look: the site is now CSS Showcase, with our own logo, matching icons, and rich previews when a page is shared.",
  'A "Send to LLM" button that copies ready-made instructions, so an AI assistant can rebuild any demo inside your own project.',
  "A playful not-found page built from pure CSS, complete with a spinning zero, floating CSS properties, and a free lesson in centering things.",
  "Plain-language legal pages: Terms, Privacy, DMCA, Cookies, Disclaimer, and User Content, all linked in the footer.",
  "This changelog page, plus an RSS feed you can subscribe to and follow along.",
  "Quick access to our GitHub from the top corner, and a spot in the footer highlighting our other projects.",
];

const FIXED_ITEMS = [
  "Live reload now works properly: pages update instantly while being edited instead of needing a restart.",
  "The line above the page content and the line under the sidebar header now sit at exactly the same height.",
  "The command for previewing the finished site locally works again.",
  "Removed the duplicate site name that used to appear twice at the top of the page.",
];

const IMPROVED_ITEMS = [
  "A deep clean for open source: internal tooling was removed and automated quality checks now run on every change.",
  "Better directions for search engines and social networks, including our official web address.",
  "A plain-text guide so AI assistants can understand the site and its content.",
  "One-command deployment on Cloudflare Pages.",
];

const SECTIONS = [
  {
    label: "New",
    icon: PlusCircle,
    className: "text-primary",
    items: NEW_ITEMS,
  },
  {
    label: "Fixed",
    icon: Wrench,
    className: "text-emerald-600 dark:text-emerald-400",
    items: FIXED_ITEMS,
  },
  {
    label: "Improved",
    icon: Zap,
    className: "text-amber-600 dark:text-amber-400",
    items: IMPROVED_ITEMS,
  },
];

function ChangelogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Changelog</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              New features, fixes, and improvements, release by release.
            </p>
          </div>
          <a
            href={`${SITE_URL}/changelog/rss`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
          >
            <Rss className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Subscribe to this feed
          </a>
        </header>

        <div className="max-w-2xl space-y-6">
          <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                v0.2
              </span>
              <time className="text-xs text-muted-foreground" dateTime="2026-09-13">
                September 13, 2026
              </time>
            </div>

            <div className="mt-6 space-y-8">
              {SECTIONS.map((section) => (
                <section key={section.label}>
                  <h2 className="flex items-center gap-2 text-base font-semibold">
                    <section.icon className={`h-4 w-4 ${section.className}`} aria-hidden="true" />
                    {section.label}
                  </h2>
                  <ul className="mt-3 space-y-2.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-accent active:translate-y-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
