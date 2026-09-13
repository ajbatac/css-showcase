import { useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Check } from "lucide-react";
import { toast } from "sonner";
import { DEMOS, type Demo } from "@/lib/demos";

const REPO = "https://github.com/ajbatac/css-showcase";

function buildDemoPrompt(demo: Demo, origin: string): string {
  const routeFile = `src/routes/${demo.slug}.tsx`;
  return `You are helping me adopt a UI pattern from CSS Showcase, an open-source library of live CSS demos (${REPO}), into my own project.

Pattern: ${demo.name}
Category: ${demo.category}
Live demo: ${origin}${demo.path}
Source file: ${REPO}/blob/main/${routeFile}
Raw source: https://raw.githubusercontent.com/ajbatac/css-showcase/main/${routeFile}
Shared pattern components (if the route imports any): ${REPO}/tree/main/src/components/patterns

Instructions:
1. Fetch the source file (or ask me to paste it) and study it before writing any code.
2. Recreate this pattern in my project's stack. Where my stack allows it, keep the original approach: pure modern CSS (custom properties, flexbox, grid, container queries, aspect-ratio, as used by the demo) with JavaScript only for state.
3. Match the original's responsive behavior across mobile, iPad, and desktop widths.
4. Support light and dark themes via CSS custom properties, like the original.
5. Keep the original's accessibility: semantic HTML, keyboard navigation, and visible focus states.
6. Do not add new dependencies unless something essential is missing from my project.
7. When you finish, summarize the CSS techniques you used, what you adapted for my stack, and anything you dropped.

If you cannot fetch the URL, ask me to paste the contents of the source file instead of guessing.`;
}

function buildSitePrompt(origin: string): string {
  return `You are helping me adopt CSS Showcase, an open-source library of live CSS demos (${REPO}), into my own project.

The project is a TanStack Start app (React 19, Tailwind CSS v4, Radix UI primitives, Vite, Nitro) with 37 CSS demos across layout, forms, navigation, feedback, overlays, data display, and utilities. Live copy: ${origin}

Instructions:
1. Clone the repository: git clone ${REPO}.git
2. Install and run it locally (Bun or npm): bun install && bun run dev
3. Identify the demos and shared components relevant to my project (the registry is src/lib/demos.ts; demo implementations live in src/components/patterns/).
4. Port the pieces I need into my project, keeping the original CSS approach (pure modern CSS, minimal JavaScript).
5. When you finish, summarize what you ported and anything you adapted for my stack.

Ask me which demos or components I want before porting everything.`;
}

export function SendToLLM() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (typeof window === "undefined") return;
    const demo = DEMOS.find((d) => d.path === pathname);
    const origin = window.location.origin;
    const prompt = demo ? buildDemoPrompt(demo, origin) : buildSitePrompt(origin);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("LLM prompt copied", {
        description: demo
          ? `Instructions for the ${demo.name} demo. Paste into your LLM.`
          : "Instructions to clone this project. Paste into your LLM.",
      });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy the prompt");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy an LLM prompt with instructions to clone this demo into your project"
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Bot className="h-4 w-4" aria-hidden />}
      {copied ? "Copied" : "Send to LLM"}
    </button>
  );
}
