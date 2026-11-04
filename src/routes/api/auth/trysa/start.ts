import { createFileRoute } from "@tanstack/react-router";
export const Route=createFileRoute("/api/auth/trysa/start")({
  server:{handlers:{GET:async({request})=>{
    const {startTrysaOwnerOAuth}=await import("@/lib/myos/trysa-owner-session.server");
    return startTrysaOwnerOAuth(request);
  }}},
});
