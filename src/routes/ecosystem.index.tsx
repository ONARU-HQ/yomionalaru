import { createFileRoute } from "@tanstack/react-router";
import { Editorial, Reveal } from "@/components/editorial";
import { VentureCard, EmptyState } from "@/components/ecosystem/VentureCard";
import { useVentures } from "@/lib/ecosystem";

export const Route = createFileRoute("/ecosystem/")({
  component: EcosystemIndex,
  head: () => ({
    meta: [
      { title: "The Ecosystem — Yomi Onalaru" },
      {
        name: "description",
        content:
          "TRYSA, Yomi Visuals, YV Studios, Yomi Unscripted, the Academy and ONARU Ventures — the companies Yomi Onalaru is building.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "The Ecosystem — Yomi Onalaru" },
      {
        property: "og:description",
        content: "The companies and products behind Yomi Onalaru's work.",
      },
    ],
  }),
});

function EcosystemIndex() {
  const { data: ventures = [], isLoading, error } = useVentures();

  return (
    <div className="pt-32">
      <Editorial
        eyebrow="The ecosystem"
        title={
          <>
            One founder.
            <br />
            Six distinct brands.
          </>
        }
        intro="I started with a camera. Now I'm building infrastructure for the people behind them. Each company stands on its own — together they form the ecosystem."
      >
        {isLoading ? (
          <EmptyState>Loading the ecosystem…</EmptyState>
        ) : error ? (
          <EmptyState>The ecosystem could not be loaded right now. Please refresh.</EmptyState>
        ) : ventures.length === 0 ? (
          <EmptyState>No ventures published yet.</EmptyState>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ventures.map((v, i) => (
              <VentureCard key={v.id} venture={v} index={i} />
            ))}
          </div>
        )}

        <Reveal className="mt-24">
          <p className="max-w-2xl font-display text-[clamp(1.4rem,3vw,2rem)] leading-snug text-foreground/80">
            Creativity gives the work its voice. Systems give it endurance. Technology gives it
            reach.
          </p>
        </Reveal>
      </Editorial>
    </div>
  );
}
