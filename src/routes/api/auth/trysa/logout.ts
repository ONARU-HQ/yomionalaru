import { createFileRoute } from "@tanstack/react-router";
export const Route=createFileRoute("/api/auth/trysa/logout")({
  server:{handlers:{
    POST:async({request})=>{
      const {clearOwnerCookie}=await import("@/lib/myos/trysa-owner-session.server");
      const origin=request.headers.get("origin");
      if(origin!=="https://yomionalaru.com") return Response.json({error:"invalid_origin"},{status:403});
      return Response.json({ok:true},{headers:{"Set-Cookie":clearOwnerCookie(),"Cache-Control":"no-store"}});
    },
  }},
});
