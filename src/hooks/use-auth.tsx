import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "admin" | "editor" | "author";

export const ROLE_RANK: Record<AppRole, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  author: 1,
};

export const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  author: "Author",
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  suspended: boolean;
  last_login_at: string | null;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  rank: number;
  isStaff: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const load = async (uid: string | undefined) => {
    if (!uid) {
      setProfile(null);
      setRoles([]);
      return;
    }
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((p as Profile) ?? null);
    setRoles(((r ?? []) as { role: AppRole }[]).map((x) => x.role));
  };

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (!active) return;
      setSession(s);
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setRoles([]);
        return;
      }
      // defer supabase calls out of the callback
      setTimeout(() => {
        void load(s?.user?.id);
      }, 0);
    });

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      await load(data.session?.user?.id);
      if (data.session?.user?.id) {
        void supabase
          .from("profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", data.session.user.id);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(() => {
    const rank = roles.reduce((m, r) => Math.max(m, ROLE_RANK[r] ?? 0), 0);
    const effective = profile?.suspended ? 0 : rank;
    return {
      loading,
      session,
      user: session?.user ?? null,
      profile,
      roles,
      rank: effective,
      isStaff: effective >= 1,
      isEditor: effective >= 2,
      isAdmin: effective >= 3,
      isSuperAdmin: effective >= 4,
      refresh: async () => load(session?.user?.id),
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setRoles([]);
      },
    };
  }, [loading, session, profile, roles]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
