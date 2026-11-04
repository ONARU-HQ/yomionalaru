/** Super-Admin MY OS is authorized ONLY by the pinned TRYSA owner identity. */
import { createFileRoute } from "@tanstack/react-router";

const response=(status:number,body:Record<string,unknown>)=>Response.json(body,{
  status,headers:{"Cache-Control":"private,no-store","X-Content-Type-Options":"nosniff"},
});
export const Route=createFileRoute("/api/admin/myos-trysa-status")({
  server:{handlers:{GET:async({request})=>{
    try {
      const {verifiedOwnerSession}=await import("@/lib/myos/trysa-owner-session.server");
      const owner=await verifiedOwnerSession(request);
      if(!owner)return response(401,{error:"TRYSA owner authentication required"});
      const {testTrysaContract}=await import("@/lib/myos/trysa-contract.server");
      const result=await testTrysaContract({accessToken:owner.accessToken,workspaceId:owner.workspaceId});
      return response(200,result);
    }catch{return response(503,{connected:false,state:"unavailable",syncActive:false,message:"Handshake service unavailable."});}
  }}},
});
