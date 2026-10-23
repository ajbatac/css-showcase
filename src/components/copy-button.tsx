import { useState } from "react";
import { toast } from "sonner";

/**
 * Copies text to the clipboard with toast feedback on success or failure.
 * Replaces the silent `navigator.clipboard?.writeText(...)` inline handlers.
 */
export function CopyButton({
  getText,
  label = "Copy",
  className = "",
}: {
  getText: () => string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      toast.success("Copied to clipboard");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy", {
        description: "Your browser blocked clipboard access.",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`text-xs font-medium transition hover:text-foreground ${
        copied ? "text-primary" : "text-muted-foreground"
      } ${className}`}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
