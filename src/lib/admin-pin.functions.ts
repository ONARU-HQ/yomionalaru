import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Owner PIN sign-in.
 *
 * The owner signs in with their email + a short PIN. The PIN is verified on the
 * server against ADMIN_PIN and only ever accepted for ADMIN_EMAIL. On success we
 * mint a one-time magic-link token server-side and hand the token hash back so
 * the browser can exchange it for a real Supabase session — the PIN itself is
 * never a credential Supabase knows about.
 */
export const signInWithPin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ email: z.string().email(), pin: z.string().min(4).max(12) }).parse(data),
  )
  .handler(async ({ data }) => {
    const ownerEmail = (process.env["ADMIN_EMAIL"] ?? "").trim().toLowerCase();
    const pin = process.env["ADMIN_PIN"] ?? "";
    const fail = { ok: false as const, error: "Incorrect email or PIN." };

    if (!ownerEmail || !pin) return { ok: false as const, error: "PIN sign-in is not configured." };
    if (data.email.trim().toLowerCase() !== ownerEmail) return fail;

    // constant-time-ish comparison
    const a = new TextEncoder().encode(data.pin);
    const b = new TextEncoder().encode(pin);
    let diff = a.length ^ b.length;
    for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
    if (diff !== 0) return fail;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Ensure the owner account exists (confirmed), then mint a one-time token.
    const link = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: ownerEmail,
    });

    let tokenHash = link.data?.properties?.hashed_token;

    if (link.error || !tokenHash) {
      const created = await supabaseAdmin.auth.admin.createUser({
        email: ownerEmail,
        email_confirm: true,
        user_metadata: { full_name: "Yomi Onalaru" },
      });
      if (created.error && !/already/i.test(created.error.message)) {
        return { ok: false as const, error: "Could not start a session. Try again." };
      }
      const retry = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: ownerEmail,
      });
      tokenHash = retry.data?.properties?.hashed_token;
      if (!tokenHash) return { ok: false as const, error: "Could not start a session. Try again." };
    }

    return { ok: true as const, tokenHash, email: ownerEmail };
  });
