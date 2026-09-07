import * as React from "react";

export type PatternTab = {
  id: string;
  label: string;
  disabled?: boolean;
  content: React.ReactNode;
};

export type PatternTabsProps = {
  tabs: PatternTab[];
  defaultTabId?: string;
  variant?: "underline" | "pills";
  className?: string;
};

/** Keyboard-navigable tabs: Arrow keys, Home/End, roving tabindex, scroll-snap overflow. */
export function PatternTabs({
  tabs,
  defaultTabId,
  variant = "underline",
  className = "",
}: PatternTabsProps) {
  const enabled = tabs.filter((t) => !t.disabled);
  const [active, setActive] = React.useState(defaultTabId ?? enabled[0]?.id ?? tabs[0]?.id ?? "");
  const listRef = React.useRef<HTMLDivElement>(null);

  const focusTab = (id: string) => {
    setActive(id);
    const el = listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${id}"]`);
    el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = enabled.findIndex((t) => t.id === active);
    if (index === -1) return;
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: enabled.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const clamped = (next + enabled.length) % enabled.length;
    const target = enabled[clamped];
    if (target) focusTab(target.id);
  };

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        onKeyDown={onKeyDown}
        className={`flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          variant === "underline" ? "border-b border-border" : ""
        }`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const base =
            "min-h-11 shrink-0 snap-start px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40";
          const style =
            variant === "pills"
              ? isActive
                ? "rounded-xl bg-primary text-primary-foreground"
                : "rounded-xl text-muted-foreground hover:bg-accent"
              : isActive
                ? "-mb-px border-b-2 border-primary text-foreground"
                : "-mb-px border-b-2 border-transparent text-muted-foreground hover:text-foreground";
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-tab-id={tab.id}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => setActive(tab.id)}
              className={`${base} ${style}`}
            >
              <span className="block max-w-[10rem] truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          hidden={tab.id !== active}
          className="pt-4 text-sm text-foreground"
        >
          {tab.id === active && tab.content}
        </div>
      ))}
    </div>
  );
}
