import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const searchSchema=z.object({redirect:z.string().optional()});
export const Route=createFileRoute("/auth")({
  validateSearch:searchSchema,
  component:AuthPage,
  head:()=>({meta:[
    {title:"Owner sign in — Yomi Onalaru"},
    {name:"robots",content:"noindex,nofollow"},
    {name:"description",content:"Private Yomi Onalaru studio sign-in through TRYSA."},
  ]}),
});
function safePath(p?:string){return p&&p.startsWith("/")&&!p.startsWith("//")&& !p.startsWith("/\\") ? p : "/admin";}
function AuthPage(){
  const {redirect}=Route.useSearch();
  const navigate=useNavigate();
  const {user,loading,rank}=useAuth();
  const [showLocal,setShowLocal]=useState(false);
  const [reset,setReset]=useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    if(!loading && user && rank>=1 && redirect!=="/admin/my-os"){
      void navigate({to:safePath(redirect),replace:true});
    }
  },[loading,user,rank,navigate,redirect]);

  const submit=async(e:FormEvent)=>{
    e.preventDefault();setBusy(true);setMessage("");
    try{
      if(reset){
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/reset-password"});
        if(error)throw error;
        setMessage("Check your email for the password reset link.");
      }else{
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error)throw error;
        setMessage("Signed in. Access to the content studio still requires an assigned role.");
      }
    }catch(err){toast.error(err instanceof Error?err.message:"Unable to sign in.");}
    finally{setBusy(false);}
  };
  const google=async()=>{
    const {error}=await supabase.auth.signInWithOAuth({
      provider:"google",options:{redirectTo:window.location.origin+"/auth"},
    });
    if(error)toast.error(error.message||"Google sign-in failed");
  };
  return <div className="grid min-h-screen place-items-center px-6 py-20">
    <div className="w-full max-w-md">
      <Link to="/" className="mb-10 flex items-center justify-center">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 font-display text-2xl text-gold">Y</span>
      </Link>
      <h1 className="text-center font-display text-5xl gold-text">Owner access</h1>
      <p className="mt-4 text-center text-sm leading-7 text-muted-foreground">
        MY OS is securely hosted by ONARU OS. TRYSA authenticates your email and PIN on its own website.
      </p>
      <a href="https://onaru.app/my-os"
        className="mt-10 flex w-full items-center justify-center rounded-full bg-gold px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
        Continue with TRYSA
      </a>
      <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
        ONARU OS will redirect you to TRYSA for owner verification and explicit workspace consent.
      </p>
      <div className="my-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <div className="h-px flex-1 bg-border"/> Existing site staff <div className="h-px flex-1 bg-border"/>
      </div>
      <button onClick={()=>setShowLocal(v=>!v)}
        className="w-full rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold/50">
        {showLocal?"Hide content studio login":"Content studio staff login"}
      </button>
      {showLocal&&<div className="mt-6">
        {user&&rank===0&&<p role="alert" className="mb-4 text-sm text-muted-foreground">Your site account has no staff permissions. MY OS instead requires verified TRYSA owner access.</p>}
        {message&&<p role="status" className="mb-4 rounded-xl border border-gold/30 p-3 text-sm text-gold">{message}</p>}
        <form onSubmit={e=>void submit(e)} className="space-y-3">
          <input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="Staff email" className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm"/>
          {!reset&&<input type="password" required autoComplete="current-password" value={password}
            onChange={e=>setPassword(e.target.value)} placeholder="Password"
            className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm"/>}
          <button disabled={busy} type="submit" className="w-full rounded-full bg-gold py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">
            {busy?"Working…":reset?"Send reset link":"Sign in to content studio"}
          </button>
        </form>
        <button onClick={()=>setReset(v=>!v)} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-gold">
          {reset?"Back to sign in":"Forgot your password?"}
        </button>
        {!reset&&<button onClick={()=>void google()} className="mt-5 w-full rounded-full border border-border py-3 text-xs uppercase tracking-[0.2em]">
          Continue with Google (site staff)
        </button>}
      </div>}
    </div>
  </div>;
}
