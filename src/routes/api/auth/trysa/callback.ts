import { createFileRoute } from "@tanstack/react-router";
export const Route=createFileRoute("/api/auth/trysa/callback")({
  server:{handlers:{GET:async({request})=>{
    const {finishTrysaOwnerOAuth}=await import("@/lib/myos/trysa-owner-session.server");
    return finishTrysaOwnerOAuth(request);
  }}},
});
