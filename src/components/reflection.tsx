import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Scripture = { text: string; ref: string };

/**
 * Signature pairing: Yomi's personal reflection above, Scripture below.
 * Scripture and reflection are always explicitly labelled and visually
 * distinct — a personal thought is never presented as equivalent to the Bible.
 */
export function ReflectionWithScripture({
  reflection,
  scripture,
  topic,
  size = "lg",
  className,
  shareUrl,
}: {
  reflection: string;
  scripture: Scripture;
  topic?: string;
  size?: "sm" | "lg";
  className?: string;
  shareUrl?: string;
}) {
  return (
    <figure className={cn("relative", className)}>
      {topic && <div className="eyebrow mb-6">{topic}</div>}

      <div className="eyebrow mb-4 !text-gold/70">Reflection</div>
      <blockquote
        className={cn(
          "font-display leading-[1.08] text-foreground",
          size === "lg"
            ? "text-[clamp(1.75rem,4.6vw,3.5rem)]"
            : "text-[clamp(1.35rem,3vw,2rem)]",
        )}
      >
        “{reflection}”
      </blockquote>
      <figcaption className="mt-5 text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Yomi Onalaru
      </figcaption>

      <div className="mt-10 border-l border-gold/35 pl-6">
        <div className="eyebrow mb-3 !text-gold/70">Scripture</div>
        <p className="max-w-xl text-sm italic leading-relaxed text-muted-foreground md:text-[0.95rem]">
          “{scripture.text}”
        </p>
        <cite className="mt-3 block not-italic text-xs uppercase tracking-[0.24em] text-foreground/60">
          {scripture.ref}
        </cite>
      </div>

      {shareUrl && (
        <ShareRow
          url={shareUrl}
          text={`“${reflection}” — Yomi Onalaru`}
          className="mt-8"
        />
      )}
    </figure>
  );
}

/** Scripture on its own — used as an elegant closing note inside sections. */
export function ScriptureNote({ text, ref: reference, className }: Scripture & { className?: string }) {
  return (
    <div className={cn("border-l border-gold/35 pl-6", className)}>
      <div className="eyebrow mb-3 !text-gold/70">Scripture</div>
      <p className="max-w-lg text-sm italic leading-relaxed text-muted-foreground">“{text}”</p>
      <cite className="mt-3 block not-italic text-xs uppercase tracking-[0.24em] text-foreground/60">
        {reference}
      </cite>
    </div>
  );
}

export function ShareRow({
  url,
  text,
  className,
}: {
  url: string;
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState<"link" | "text" | null>(null);

  const copy = async (what: "link" | "text") => {
    try {
      await navigator.clipboard.writeText(what === "link" ? url : `${text}\n\n${url}`);
      setCopied(what);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    copy("text");
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <button
        onClick={share}
        className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-foreground/70 transition hover:border-gold/50 hover:text-gold"
      >
        {copied === "text" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied === "text" ? "Copied" : "Share"}
      </button>
      <button
        onClick={() => copy("link")}
        className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-foreground/70 transition hover:border-gold/50 hover:text-gold"
      >
        {copied === "link" ? <Check className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
        {copied === "link" ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
