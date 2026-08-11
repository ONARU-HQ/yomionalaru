import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Editorial, Reveal } from "@/components/editorial";
import { StatusBadge, ConnectionBadge } from "@/components/ecosystem/StatusBadge";
import { UpdateRow, EmptyState } from "@/components/ecosystem/VentureCard";
import { EnquiryForm } from "@/components/ecosystem/EnquiryForm";
import { CdnImage } from "@/components/photo";
import { useVenture, useEcosystemUpdates } from "@/lib/ecosystem";
import { useChannelVideos } from "@/lib/use-integrations";

export const Route = createFileRoute("/ecosystem/$slug")({
  component: VenturePage,
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — Yomi Onalaru Ecosystem` },
        {
          name: "description",
          content: `${name} is part of the Yomi Onalaru ecosystem. Status, latest updates and how to work together.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: `${name} — Yomi Onalaru Ecosystem` },
        {
          property: "og:description",
          content: `${name} is part of the Yomi Onalaru ecosystem.`,
        },
      ],
    };
  },
});

function VenturePage() {
  const { slug } = Route.useParams();
  const { venture, isLoading } = useVenture(slug);
  const { data: updates = [] } = useEcosystemUpdates();
  const { videos, connection } = useChannelVideos();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (!venture) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-5xl">Not found</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This venture is not published yet.
          </p>
          <Link
            to="/ecosystem"
            className="mt-8 inline-block rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-[0.24em]"
          >
            Back to the ecosystem
          </Link>
        </div>
      </div>
    );
  }

  const ventureUpdates = updates.filter((u) => u.venture_id === venture.id);
  const isChannel = venture.slug === "yomi-unscripted";

  return (
    <div className="pt-32">
      <Editorial>
        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={venture.status} />
            <ConnectionBadge connection={venture.connection} />
          </div>
          <h1 className="mt-8 font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9]">
            {venture.name}
          </h1>
          {venture.tagline && (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {venture.tagline}
            </p>
          )}
        </Reveal>

        {venture.cover_image && (
          <Reveal className="mt-16 overflow-hidden rounded-3xl border border-border/50">
            <CdnImage
              src={venture.cover_image}
              alt={venture.name}
              priority
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </Reveal>
        )}

        {(venture.description || venture.long_description) && (
          <Reveal className="mt-20 max-w-3xl space-y-6 text-base leading-relaxed text-foreground/80">
            {venture.description && <p>{venture.description}</p>}
            {venture.long_description && (
              <p className="text-muted-foreground">{venture.long_description}</p>
            )}
          </Reveal>
        )}

        {venture.features.length > 0 && (
          <Reveal className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {venture.features.map((f) => (
              <div key={f} className="rounded-2xl border border-border/60 p-6 text-sm leading-relaxed">
                {f}
              </div>
            ))}
          </Reveal>
        )}

        {(venture.cta_url || venture.website_url) && (
          <Reveal className="mt-14">
            <a
              href={venture.cta_url ?? venture.website_url ?? "#"}
              target={(venture.cta_url ?? venture.website_url ?? "").startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.22em] text-primary-foreground"
            >
              {venture.cta_label ?? "Visit"}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        )}
      </Editorial>

      {isChannel && (
        <Editorial eyebrow="Latest episodes" title="Yomi Unscripted">
          {videos.length === 0 ? (
            <EmptyState>
              {connection === "not_connected"
                ? "The channel is not connected yet — episodes will appear here automatically once it is."
                : "No episodes available right now."}
            </EmptyState>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-2xl border border-border/60"
                >
                  {v.thumbnail && (
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      loading="lazy"
                      className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="p-5 text-sm leading-snug">{v.title}</div>
                </a>
              ))}
            </div>
          )}
        </Editorial>
      )}

      <Editorial eyebrow="Updates" title="What's happening">
        {ventureUpdates.length === 0 ? (
          <EmptyState>No updates published for {venture.name} yet.</EmptyState>
        ) : (
          <div className="border-b border-border/50">
            {ventureUpdates.map((u, i) => (
              <UpdateRow key={u.id} update={u} index={i} />
            ))}
          </div>
        )}
      </Editorial>

      <Editorial eyebrow="Get in touch" title={`Work with ${venture.name}`}>
        <EnquiryForm className="max-w-3xl" />
      </Editorial>
    </div>
  );
}
