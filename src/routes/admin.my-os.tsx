import { createFileRoute } from "@tanstack/react-router";
import { useEffect,useState } from "react";
import { ShieldCheck, ShieldAlert, RefreshCw, ExternalLink, Database, CalendarDays, Lock } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";

export const Route=createFileRoute("/admin/my-os")({
  component:MyOsOwnerPanel,
  head:()=>({meta:[
    {title:"Private MY OS — TRYSA Integration"},
    {name:"robots",content:"noindex,nofollow"},
  ]}),
});
type Status={connected:boolean;state:"not_configured"|"verified"|"rejected"|"unavailable";syncActive:boolean;message:string};
function MyOsOwnerPanel(){
  const [workspace,setWorkspace]=useState<string|null>(null);
  const [status,setStatus]=useState<Status|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    let active=true;
    void fetch("/api/admin/myos-owner-session",{cache:"no-store",credentials:"same-origin"})
      .then(async r=>{if(!r.ok)throw new Error("expired");const body=await r.json() as {workspace_id:string};if(active)setWorkspace(body.workspace_id);})
      .catch(()=>{if(active){setWorkspace(null);setError("TRYSA owner session expired. Sign in again.");}});
    return()=>{active=false;};
  },[]);
  const check=async()=>{
    setBusy(true);setError("");setStatus(null);
    try{
      const r=await fetch("/api/admin/myos-trysa-status",{cache:"no-store",credentials:"same-origin"});
      if(!r.ok){setError(r.status===401?"TRYSA owner session expired. Sign in again.":"Handshake service unavailable.");return;}
      setStatus(await r.json() as Status);
    }catch{setError("Handshake could not be checked.");}
    finally{setBusy(false);}
  };
  return <div>
    <AdminHeader title="MY OS ↔ TRYSA"
      description="Private owner console. TRYSA remains the CRM and bookings system of record."/>
    <div className="mb-6 flex flex-wrap gap-3">
      <a href="https://trysa.app/app" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground">
        Open TRYSA workspace <ExternalLink className="h-4 w-4"/>
      </a>
      <a href="/api/auth/trysa/start"
        className="inline-flex items-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.14em] hover:text-gold">
        Authorize another workspace
      </a>
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-border/70 bg-white/[0.02] p-6">
        <Database className="mb-5 h-6 w-6 text-gold"/>
        <h2 className="font-display text-3xl">TRYSA CRM</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Contacts, client organizations and enquiries remain in TRYSA. MY OS can request
          approved read-only summaries after both security signatures are active.
        </p>
        <p className="mt-5 text-xs text-muted-foreground">
          Authorized workspace: {workspace?"Selected in TRYSA":"Not authenticated"}
        </p>
        <p className="mt-2 text-xs text-gold">Data sync: {status?.syncActive?"Active":"Not enabled"}</p>
      </div>
      <div className="rounded-3xl border border-border/70 bg-white/[0.02] p-6">
        <CalendarDays className="mb-5 h-6 w-6 text-gold"/>
        <h2 className="font-display text-3xl">Bookings</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Booking records, availability, clients and updates stay in TRYSA.
          They will not be copied into an unprotected browser or a second CRM.
        </p>
        <p className="mt-5 text-xs text-gold">Read-only contract access pending</p>
      </div>
    </div>
    <div className="mt-6 rounded-3xl border border-border/70 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Lock className="h-5 w-5 text-gold"/>
        <h2 className="font-display text-2xl">Bilateral security</h2>
        <span className="ml-auto rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Contract v1</span>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        MY OS is restricted to your verified TRYSA account. An individual TRYSA workspace must
        also authorize access. Changes to MY OS require this owner session; no CRM writes are enabled.
      </p>
      <div aria-live="polite" className="mt-6 rounded-2xl bg-black/20 p-5">
        {status?.connected?<ShieldCheck className="mb-3 h-6 w-6 text-green-400"/>:
          <ShieldAlert className="mb-3 h-6 w-6 text-amber-400"/>}
        <h3 className="text-base font-semibold">{status?.connected?"Cryptographic handshake verified":"Contract connection not yet verified"}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {status?.message||"Both separately managed signing identities must complete contract activation before CRM and booking reads can begin."}
        </p>
        {error&&<p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
      <button onClick={()=>void check()} disabled={busy||!workspace}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${busy?"animate-spin":""}`}/>
        {busy?"Checking…":"Check secure connection"}
      </button>
      <div className="mt-5 text-xs text-muted-foreground">
        <a href="https://github.com/ONARU-HQ/trysahq/pull/7" target="_blank" rel="noopener noreferrer" className="hover:text-gold">Review integration contract</a>
      </div>
    </div>
  </div>;
}
