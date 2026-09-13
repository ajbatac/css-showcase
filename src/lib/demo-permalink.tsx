import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";

export function CopyLinkButton({ device, pattern }: { device: string; pattern: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}?device=${encodeURIComponent(
      device,
    )}&pattern=${encodeURIComponent(pattern)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied", { description: `${device} · ${pattern}` });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy link to the ${device} ${pattern} pattern`}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-[10px] font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
    >
      {copied ? <Check className="h-3 w-3 text-primary" /> : <Link2 className="h-3 w-3" />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
