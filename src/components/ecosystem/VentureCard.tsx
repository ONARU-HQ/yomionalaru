import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/editorial";
import { StatusBadge, ConnectionBadge } from "./StatusBadge";
import { CdnImage } from "@/components/photo";
import type { Venture, EcosystemUpdate } from "@/lib/ecosystem";
import { cn } from "@/lib/utils";

export function VentureCard({ venture, index = 0 }: { venture: Venture; index?: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <Link
        to="/ecosystem/$slug"
        params={{ slug: venture.slug }}
        className="group flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-white/[0.015] p-8 transition-colors hover:border-gold/40"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={venture.status} />
            <ConnectionBadge connection={venture.connection} />
          </div>
          <h3 className="mt-7 font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight">
            {venture.name}
          </h3>
          {venture.tagline && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{venture.tagline}</p>
          )}
        </div>
        <div className="mt-10 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.26em] text-gold">
          {venture.category ?? "Venture"}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    </Reveal>
  );
}

export function UpdateRow({ update, index = 0 }: { update: EcosystemUpdate; index?: number }) {
  const date = update.published_at
    ? new Date(update.published_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const body = (
    <div className="grid gap-6 py-8 md:grid-cols-[10rem_1fr_auto] md:items-baseline">
      <div className="text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground">
        {date}
      </div>
      <div>
        {update.venture_label && (
          <div className="mb-2 text-[0.62rem] uppercase tracking-[0.26em] text-gold">
            {update.venture_label}
          </div>
        )}
        <h3 className="font-display text-2xl leading-snug">{update.title}</h3>
        {update.description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {update.description}
          </p>
        )}
        {update.image_url && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/50">
            <CdnImage
              src={update.image_url}
              alt={update.title}
              sizes="(max-width: 768px) 100vw, 40rem"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      {update.cta_url && update.cta_label && (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.65rem] uppercase tracking-[0.24em] text-gold">
          {update.cta_label}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );

  return (
    <Reveal delay={index * 0.04}>
      <div className={cn("border-t border-border/50")}>
        {update.cta_url ? (
          <a
            href={update.cta_url}
            target={update.cta_url.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="block transition-colors hover:bg-white/[0.02]"
          >
            {body}
          </a>
        ) : (
          body
        )}
      </div>
    </Reveal>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
