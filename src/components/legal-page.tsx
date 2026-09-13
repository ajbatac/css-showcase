import type { ReactNode } from "react";

export const LEGAL_UPDATED = "September 13, 2026";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:max-w-5xl xl:max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {LEGAL_UPDATED}</p>
        </header>
        <div className="max-w-2xl space-y-8 text-sm leading-relaxed">{children}</div>
      </div>
    </main>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold">{heading}</h2>
      <div className="mt-2 space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
