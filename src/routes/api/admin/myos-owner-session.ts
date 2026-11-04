import { createFileRoute } from "@tanstack/react-router";
export const Route=createFileRoute("/api/admin/myos-owner-session")({
  server:{handlers:{
    GET:async({request})=>{
      const {verifiedOwnerSession}=await import("@/lib/myos/trysa-owner-session.server");
      const verified=await verifiedOwnerSession(request);
      return Response.json(verified?
        {authenticated:true,workspace_id:verified.workspaceId}:
        {authenticated:false}, {
        status:verified?200:401,headers:{"Cache-Control":"private,no-store","X-Content-Type-Options":"nosniff"},
      });
    },
  }},
});
