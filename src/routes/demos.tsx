import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORY_ORDER, DEMOS } from "@/lib/demos";

export const Route = createFileRoute("/demos")({
  head: () => ({
    meta: [
      { title: "All Demos — CSS Showcase" },
      {
        name: "description",
        content:
          "Browse every modern CSS demo by category: layout, forms, navigation, feedback, overlays, data display and utilities.",
      },
      { property: "og:title", content: "All Demos — CSS Showcase" },
      {
        property: "og:description",
        content:
          "One page index of every device-switcher demo, grouped by category with a short description each.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemosIndex,
});

const DESCRIPTIONS: Record<string, string> = {
  "device-switcher":
    "Morph a skeleton app between desktop, iPad and mobile with container queries.",
  "login-screens": "Centered, half/half and hero-overlay sign-in layouts per device.",
  toasts: "Success, error, warning and info notifications anchored per device.",
  modals: "Confirm, cancel and dismiss flows as sheets or centered dialogs.",
  navigation: "Hamburger drawer on small screens, horizontal menu on desktop.",
  dropdowns: "Bottom sheets, anchored popovers and compact menus.",
  flex: "Interactive Flexbox playground for direction, alignment, wrap and gap.",
  grid: "Grid templates and auto-placement presets with gap and track controls.",
  accordions: "Animated expand/collapse panels using grid-template-rows.",
  checkboxes: "Checkbox lists, select-all with indeterminate state, toggles.",
  selects: "Single select plus chip-based multi-select in sheets and popovers.",
  radios: "Classic lists, segmented controls and selectable cards.",
  sliders: "Volume, stepped rating and dual-thumb range inputs.",
  tabs: "Keyboard-navigable tabs with disabled items and overflow handling.",
  uploaders: "Dropzones, upload queues and gallery pickers with progress.",
  loaders: "Skeletons, spinners, shimmer feeds, blurred images and table rows.",
  datepicker: "Popover, inline and bottom-sheet calendars with range selection.",
  cards: "Content, media and stat card layouts that reflow per device.",
  containers: "Page shells, max-width wrappers and fluid padding scales.",
  dividers: "Horizontal, vertical and labelled separators.",
  inputs: "Text fields with labels, hints, icons and error states.",
  textareas: "Auto-growing and fixed multi-line inputs with counters.",
  buttons: "Variants, sizes, icon buttons and loading states.",
  switches: "Toggles and switch rows for settings screens.",
  search: "Search fields with suggestions, clearing and filters.",
  "form-validation": "Inline, summary and on-blur validation messaging.",
  breadcrumbs: "Full trails, collapsed middles and back-link fallbacks.",
  pagination: "Numbered pages, load-more and compact prev/next controls.",
  alerts: "Inline alert cards and page banners, dismissible.",
  progress: "Linear bars, rings and multi-step progress indicators.",
  tooltips: "Hover, focus and long-press hints with smart placement.",
  drawers: "Side and bottom drawers with overlay and focus handling.",
  tables: "Sortable, sticky-header tables that collapse into cards.",
  lists: "Simple, media and grouped lists with actions.",
  badges: "Status pills, counts and dot indicators.",
  "empty-states": "Centered heroes, no-results and offline placeholders.",
};

function DemosIndex() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CSS Showcase · Library
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">All demos</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {DEMOS.length} interactive demos, grouped by category. Every page has a device switcher,
            per-device design patterns, a CSS snippet and a shareable link.
          </p>
        </header>

        <nav aria-label="Categories" className="mb-10 flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold transition hover:bg-accent"
            >
              {category}
              <span className="ml-1.5 text-muted-foreground">
                {DEMOS.filter((d) => d.category === category).length}
              </span>
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {CATEGORY_ORDER.map((category) => {
            const items = DEMOS.filter((d) => d.category === category);
            if (items.length === 0) return null;
            return (
              <section
                key={category}
                id={category.toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-6"
              >
                <h2 className="mb-4 text-lg font-semibold tracking-tight">{category}</h2>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((demo) => (
                    <li key={demo.slug}>
                      <Link
                        to={demo.path}
                        className="group flex h-full gap-3 rounded-2xl border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow-md"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <demo.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold group-hover:text-primary">
                            {demo.name}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {DESCRIPTIONS[demo.slug] ?? "Interactive device-switcher demo."}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
