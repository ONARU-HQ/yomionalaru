import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

export function RequireRank({ min, children }: { min: number; children: ReactNode }) {
  const { rank, loading } = useAuth();
  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (rank < min) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
        <h2 className="font-display text-2xl gold-text">Not permitted</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Your role does not have access to this section.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
