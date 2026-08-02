import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, UserPlus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { useRows, logAudit } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABEL, ROLE_RANK, useAuth, type AppRole } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  suspended: boolean;
  last_login_at: string | null;
};
type RoleRow = { id: string; user_id: string; role: AppRole };
type InviteRow = { id: string; email: string; role: AppRole; accepted_at: string | null; created_at: string };

const ROLES: AppRole[] = ["author", "editor", "admin", "super_admin"];

export const Route = createFileRoute("/admin/users")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: profiles = [] } = useRows<ProfileRow>("profiles", { order: "created_at", ascending: false });
  const { data: roles = [] } = useRows<RoleRow>("user_roles", { order: "created_at" });
  const { data: invites = [] } = useRows<InviteRow>("invitations", { order: "created_at", ascending: false });

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("author");
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["rows", "user_roles"] });
    void qc.invalidateQueries({ queryKey: ["rows", "profiles"] });
    void qc.invalidateQueries({ queryKey: ["rows", "invitations"] });
  };

  const invite = async () => {
    if (!email.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("invitations").insert({
      email: email.trim().toLowerCase(),
      role,
      invited_by: user?.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    void logAudit("invite", "invitations", undefined, { email, role });
    setEmail("");
    toast.success("Invitation created — they get the role when they sign up.");
    refresh();
  };

  const setUserRole = async (uid: string, next: AppRole) => {
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", uid);
    if (delErr) return toast.error(delErr.message);
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: next });
    if (error) return toast.error(error.message);
    void logAudit("role_change", "user_roles", uid, { role: next });
    toast.success("Role updated");
    refresh();
  };

  const toggleSuspend = async (p: ProfileRow) => {
    const { error } = await supabase.from("profiles").update({ suspended: !p.suspended }).eq("id", p.id);
    if (error) return toast.error(error.message);
    void logAudit(p.suspended ? "unsuspend" : "suspend", "profiles", p.id);
    refresh();
  };

  return (
    <RequireRank min={4}>
      <AdminHeader title="Users" description="Invite teammates and control what each of them can do." />

      <div className="mb-10 flex flex-wrap items-end gap-3 rounded-2xl border border-border/60 p-6">
        <div className="min-w-[220px] flex-1">
          <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Role</div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AppRole)}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          >
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </select>
        </div>
        <button
          onClick={() => void invite()}
          disabled={busy}
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" /> Invite
        </button>
      </div>

      <h2 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Team</h2>
      <div className="space-y-2">
        {profiles.map((p) => {
          const mine = roles.filter((r) => r.user_id === p.id).map((r) => r.role);
          const top = mine.sort((a, b) => ROLE_RANK[b] - ROLE_RANK[a])[0];
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-white/[0.02] px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{p.full_name || p.email}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {p.email}
                  {p.last_login_at ? ` · last seen ${new Date(p.last_login_at).toLocaleDateString()}` : ""}
                </div>
              </div>
              <select
                value={top ?? ""}
                onChange={(e) => void setUserRole(p.id, e.target.value as AppRole)}
                disabled={p.id === user?.id}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs disabled:opacity-50"
              >
                <option value="">No role</option>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
              <button
                onClick={() => void toggleSuspend(p)}
                disabled={p.id === user?.id}
                className={cn(
                  "rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] disabled:opacity-40",
                  p.suspended ? "border-red-500/40 text-red-400" : "border-border",
                )}
              >
                {p.suspended ? "Suspended" : "Active"}
              </button>
            </div>
          );
        })}
      </div>

      <h2 className="mb-4 mt-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Pending invitations</h2>
      {invites.filter((i) => !i.accepted_at).length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending invitations.</p>
      ) : (
        <div className="space-y-2">
          {invites.filter((i) => !i.accepted_at).map((i) => (
            <div key={i.id} className="flex items-center gap-4 rounded-2xl border border-border/60 px-5 py-4">
              <div className="min-w-0 flex-1 truncate text-sm">{i.email}</div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{ROLE_LABEL[i.role]}</span>
              <button
                onClick={async () => {
                  const { error } = await supabase.from("invitations").delete().eq("id", i.id);
                  if (error) return toast.error(error.message);
                  refresh();
                }}
                className="rounded-full border border-border p-2 hover:text-red-400"
                aria-label="Revoke"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </RequireRank>
  );
}
