import { cn } from "@/lib/utils";
import {
  STATUS_LABEL,
  CONNECTION_LABEL,
  type VentureStatus,
  type ConnectionState,
} from "@/lib/ecosystem";

const STATUS_TONE: Record<VentureStatus, string> = {
  idea: "border-border text-muted-foreground",
  building: "border-gold/40 text-gold",
  beta: "border-gold/40 text-gold",
  live: "border-emerald-400/40 text-emerald-300",
  operating: "border-emerald-400/40 text-emerald-300",
  paused: "border-border text-muted-foreground",
  archived: "border-border text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: VentureStatus; className?: string }) {
  const pulse = status === "live" || status === "operating" || status === "building";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em]",
        STATUS_TONE[status],
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ConnectionBadge({
  connection,
  className,
}: {
  connection: ConnectionState;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-[0.22em]",
        connection === "live" || connection === "synced"
          ? "border-emerald-400/30 text-emerald-300/90"
          : "border-border/70 text-muted-foreground",
        className,
      )}
      title={
        connection === "not_connected"
          ? "This product is not connected to a live data source yet."
          : undefined
      }
    >
      {CONNECTION_LABEL[connection]}
    </span>
  );
}
