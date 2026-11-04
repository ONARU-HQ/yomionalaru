/**
 * MY OS ↔ TRYSA connection check for the Yomi Onalaru admin portal.
 * This route is never callable anonymously: it independently validates the
 * Supabase access token and SUPER ADMIN role server-side before touching the
 * signer or making any upstream request.
 */
import { createFileRoute } from "@tanstack/react-router";

const response = (status: number, body: Record<string, unknown>) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, private",
      "Pragma": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });

export const Route = createFileRoute("/api/admin/myos-trysa-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const value = request.headers.get("authorization") ?? "";
        const match = /^Bearer ([A-Za-z0-9._-]{20,4096})$/.exec(value);
        if (!match) return response(401, { error: "Authentication required" });
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: authenticated, error: authError } = await supabaseAdmin.auth.getUser(match[1]);
          const userId = authenticated?.user?.id;
          if (authError || !userId) return response(401, { error: "Invalid session" });

          const [{ data: role, error: roleError }, { data: profile, error: profileError }] = await Promise.all([
            supabaseAdmin.from("user_roles").select("role")
              .eq("user_id", userId).eq("role", "super_admin").limit(1),
            supabaseAdmin.from("profiles").select("suspended")
              .eq("id", userId).maybeSingle(),
          ]);
          if (roleError || profileError || !role?.length || !profile || profile.suspended) {
            return response(403, { error: "Super Admin access required" });
          }

          const { testTrysaContract } = await import("@/lib/myos/trysa-contract.server");
          const result = await testTrysaContract();
          return response(200, result);
        } catch {
          return response(503, { connected: false, state: "unavailable",
            syncActive: false, message: "Integration service is unavailable." });
        }
      },
    },
  },
});
