import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, Image, Inbox, Mail } from "lucide-react";
import { toast } from "sonner";

import { PatternAlert } from "@/components/patterns/pattern-alert";
import { PatternBadge } from "@/components/patterns/pattern-badge";
import { PatternButton } from "@/components/patterns/pattern-button";
import { PatternCard } from "@/components/patterns/pattern-card";
import { PatternEmptyState } from "@/components/patterns/pattern-empty-state";
import { PatternInput } from "@/components/patterns/pattern-input";
import { PatternSkeleton } from "@/components/patterns/pattern-skeleton";
import { PatternTabs } from "@/components/patterns/pattern-tabs";

import alertSource from "@/components/patterns/pattern-alert.tsx?raw";
import badgeSource from "@/components/patterns/pattern-badge.tsx?raw";
import buttonSource from "@/components/patterns/pattern-button.tsx?raw";
import cardSource from "@/components/patterns/pattern-card.tsx?raw";
import emptySource from "@/components/patterns/pattern-empty-state.tsx?raw";
import inputSource from "@/components/patterns/pattern-input.tsx?raw";
import skeletonSource from "@/components/patterns/pattern-skeleton.tsx?raw";
import tabsSource from "@/components/patterns/pattern-tabs.tsx?raw";

export const Route = createFileRoute("/components")({
  head: () => ({
    meta: [
      { title: "Reusable Components — Modern CSS Pattern Library" },
      {
        name: "description",
        content:
          "Drop-in React components extracted from the demos: buttons, inputs, cards, tabs, alerts, badges, empty states and skeleton loaders.",
      },
      { property: "og:title", content: "Reusable Components — Modern CSS Pattern Library" },
      {
        property: "og:description",
        content:
          "Copy the full source of each self-contained, token-driven component and paste it straight into your own project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComponentsPage,
});

type Entry = {
  id: string;
  name: string;
  file: string;
  description: string;
  source: string;
  preview: React.ReactNode;
};

function ComponentsPage() {
  const [alertOpen, setAlertOpen] = useState(true);

  const entries: Entry[] = [
    {
      id: "button",
      name: "PatternButton",
      file: "src/components/patterns/pattern-button.tsx",
      description:
        "Four variants, three sizes, loading spinner, 44px minimum tap target on mobile.",
      source: buttonSource,
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <PatternButton>Primary</PatternButton>
          <PatternButton variant="secondary">Secondary</PatternButton>
          <PatternButton variant="ghost" size="sm">
            Ghost
          </PatternButton>
          <PatternButton variant="destructive" size="sm">
            Delete
          </PatternButton>
          <PatternButton loading>Saving</PatternButton>
        </div>
      ),
    },
    {
      id: "input",
      name: "PatternInput",
      file: "src/components/patterns/pattern-input.tsx",
      description: "Labelled field with hint text, error state, leading icon and wired-up a11y ids.",
      source: inputSource,
      preview: (
        <div className="grid gap-4 sm:grid-cols-2">
          <PatternInput
            label="Email"
            placeholder="you@studio.com"
            hint="We only email about releases."
            icon={<Mail className="h-4 w-4" />}
          />
          <PatternInput label="Workspace" defaultValue="my studio" error="Name is already taken." />
        </div>
      ),
    },
    {
      id: "card",
      name: "PatternCard",
      file: "src/components/patterns/pattern-card.tsx",
      description:
        "Container-query card: stacks in narrow slots, goes side-by-side when its own box is wide.",
      source: cardSource,
      preview: (
        <PatternCard
          eyebrow="Case study"
          title="Container queries in production"
          description="The card reflows on its own width, so the same component works in a sidebar and a full-width grid."
          media={<Image className="h-6 w-6 text-muted-foreground" />}
          footer={
            <div className="flex items-center justify-between">
              <PatternBadge tone="success" dot>
                Shipped
              </PatternBadge>
              <PatternButton size="sm" variant="ghost">
                Read
              </PatternButton>
            </div>
          }
        />
      ),
    },
    {
      id: "tabs",
      name: "PatternTabs",
      file: "src/components/patterns/pattern-tabs.tsx",
      description:
        "Roving tabindex, Arrow/Home/End keys, disabled tabs skipped, scroll-snap overflow.",
      source: tabsSource,
      preview: (
        <PatternTabs
          variant="pills"
          tabs={[
            { id: "overview", label: "Overview", content: "Panels swap without layout shift." },
            { id: "activity", label: "Activity", content: "Arrow keys move focus between tabs." },
            { id: "billing", label: "Billing", disabled: true, content: "Disabled." },
            { id: "long", label: "A very long tab label that truncates", content: "Truncated." },
          ]}
        />
      ),
    },
    {
      id: "alert",
      name: "PatternAlert",
      file: "src/components/patterns/pattern-alert.tsx",
      description: "Four tones, optional dismiss button, polite live region for screen readers.",
      source: alertSource,
      preview: (
        <div className="space-y-2">
          <PatternAlert tone="success" title="Changes saved">
            Your layout is live for everyone on the team.
          </PatternAlert>
          {alertOpen ? (
            <PatternAlert tone="warning" title="Trial ends soon" onDismiss={() => setAlertOpen(false)}>
              Add a payment method to keep your projects.
            </PatternAlert>
          ) : (
            <PatternButton size="sm" variant="secondary" onClick={() => setAlertOpen(true)}>
              Show dismissible alert
            </PatternButton>
          )}
        </div>
      ),
    },
    {
      id: "badge",
      name: "PatternBadge",
      file: "src/components/patterns/pattern-badge.tsx",
      description: "Status pills, dot indicators and count badges that clamp at 99+.",
      source: badgeSource,
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <PatternBadge>Draft</PatternBadge>
          <PatternBadge tone="success" dot>
            Live
          </PatternBadge>
          <PatternBadge tone="warning" dot>
            Review
          </PatternBadge>
          <PatternBadge tone="danger">Failed</PatternBadge>
          <PatternBadge tone="info" count={7} />
          <PatternBadge tone="info" count={128} />
        </div>
      ),
    },
    {
      id: "empty-state",
      name: "PatternEmptyState",
      file: "src/components/patterns/pattern-empty-state.tsx",
      description: "Centered hero placeholder plus a compact inline row for tight spaces.",
      source: emptySource,
      preview: (
        <div className="space-y-3">
          <PatternEmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No uploads yet"
            description="Drop a file here or pick one from your device to get started."
            action={<PatternButton size="sm">Upload a file</PatternButton>}
          />
          <PatternEmptyState
            layout="inline"
            icon={<Inbox className="h-4 w-4" />}
            title="Nothing in this folder"
            description="Move an item here to see it listed."
            action={
              <PatternButton size="sm" variant="ghost">
                Browse
              </PatternButton>
            }
          />
        </div>
      ),
    },
    {
      id: "skeleton",
      name: "PatternSkeleton",
      file: "src/components/patterns/pattern-skeleton.tsx",
      description: "Shimmer placeholders in line, block, circle, card and table-row shapes.",
      source: skeletonSource,
      preview: (
        <div className="grid gap-4 sm:grid-cols-2">
          <PatternSkeleton lines={4} />
          <PatternSkeleton variant="card" />
          <PatternSkeleton variant="table" lines={3} className="sm:col-span-2" />
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Modern CSS · Components
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Reusable components
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Each piece is a single self-contained file with no dependencies beyond React and
            Tailwind, styled with semantic tokens so it inherits your light and dark themes. Copy the
            full source and drop it into your project.
          </p>
        </header>

        <nav aria-label="Components" className="mb-10 flex flex-wrap gap-2">
          {entries.map((entry) => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold transition hover:bg-accent"
            >
              {entry.name}
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {entries.map((entry) => (
            <ComponentSection key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ComponentSection({ entry }: { entry: Entry }) {
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(entry.source);
      setCopied(true);
      toast.success(`${entry.name} copied`, { description: entry.file });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy the component");
    }
  };

  return (
    <section
      id={entry.id}
      className="scroll-mt-6 overflow-hidden rounded-3xl border bg-card shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{entry.name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{entry.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSource((v) => !v)}
            className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            {showSource ? "Hide code" : "View code"}
          </button>
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy the full source of ${entry.name}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy component"}
          </button>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,var(--muted)_0%,var(--background)_100%)] px-4 py-6">
        {entry.preview}
      </div>

      <div className="border-t">
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
          <span className="truncate text-xs font-semibold text-muted-foreground">{entry.file}</span>
          <span className="shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">
            {entry.source.split("\n").length} lines
          </span>
        </div>
        {showSource && (
          <pre className="max-h-96 overflow-auto bg-card px-4 py-4 text-[11px] leading-relaxed sm:text-xs">
            <code>{entry.source}</code>
          </pre>
        )}
      </div>
    </section>
  );
}
