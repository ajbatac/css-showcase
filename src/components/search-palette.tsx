import { useEffect, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CATEGORY_ORDER, DEMOS, DEMO_DESCRIPTIONS } from "@/lib/demos";

const RECENT_KEY = "recent-demos";
const RECENT_LIMIT = 5;

const BROWSE_LINKS = [
  { path: "/demos", label: "All demos", hint: "Library" },
  { path: "/components", label: "Reusable components", hint: "Library" },
  { path: "/changelog", label: "Changelog", hint: "Updates" },
];

function readRecent(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeRecent(paths: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(paths));
  } catch {
    // private mode: recents just won't persist
  }
}

/**
 * ⌘K / Ctrl+K command palette: fuzzy search across every demo (by name,
 * category, or description), the recently visited demos, and key pages.
 * Owned by __root; open state is passed in so header/mobile triggers share it.
 */
export function SearchPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  // Track visited demo pages for the "Recent" group.
  useEffect(() => {
    if (!DEMOS.some((d) => d.path === pathname)) return;
    setRecent((prev) => {
      const next = [pathname, ...prev.filter((p) => p !== pathname)].slice(0, RECENT_LIMIT);
      writeRecent(next);
      return next;
    });
  }, [pathname]);

  // Global shortcuts: ⌘K / Ctrl+K toggles, "/" opens when not typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const typing =
          target &&
          (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (typing) return;
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    onOpenChange(false);
    router.navigate({ href: path });
  };

  const recentDemos = recent
    .map((path) => DEMOS.find((d) => d.path === path))
    .filter((d): d is (typeof DEMOS)[number] => Boolean(d))
    .slice(0, RECENT_LIMIT);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <Command
          filter={(value, search, keywords) => {
            // Strict ranked matching — cmdk's default fuzzy is far too loose
            // ("tooltip" matched "Dividers"). Higher scores sort first.
            const q = search.trim().toLowerCase();
            if (!q) return 1;
            const words = q.split(/\s+/);
            let best = 0;
            for (const haystack of [value, ...(keywords ?? [])]) {
              const h = haystack.toLowerCase();
              if (!h) continue;
              if (h.startsWith(q)) best = Math.max(best, 1);
              else if (h.includes(q)) best = Math.max(best, 0.7);
              else if (words.length > 1 && words.every((w) => h.includes(w)))
                best = Math.max(best, 0.4);
            }
            return best;
          }}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput placeholder="Search demos, categories, pages…" />
          <CommandList>
            <CommandEmpty>No matches found.</CommandEmpty>
            {recentDemos.length > 0 && (
              <CommandGroup heading="Recent">
                {recentDemos.map((demo) => (
                  <CommandItem
                    key={`recent-${demo.slug}`}
                    value={demo.path}
                    keywords={[demo.name, demo.short, demo.category]}
                    onSelect={() => go(demo.path)}
                  >
                    <demo.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{demo.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {CATEGORY_ORDER.map((category) => {
              const items = DEMOS.filter((d) => d.category === category);
              if (items.length === 0) return null;
              return (
                <CommandGroup key={category} heading={category}>
                  {items.map((demo) => (
                    <CommandItem
                      key={demo.slug}
                      value={demo.path}
                      keywords={[
                        demo.name,
                        demo.short,
                        demo.category,
                        DEMO_DESCRIPTIONS[demo.slug] ?? "",
                      ]}
                      onSelect={() => go(demo.path)}
                    >
                      <demo.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{demo.name}</span>
                      <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {demo.short}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
            <CommandGroup heading="Browse">
              {BROWSE_LINKS.map((link) => (
                <CommandItem key={link.path} value={link.path} onSelect={() => go(link.path)}>
                  <span className="truncate">{link.label}</span>
                  <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {link.hint}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
