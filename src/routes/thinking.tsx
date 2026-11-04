import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Quote, BookOpen } from "lucide-react";
import { PRINCIPLES, LESSONS, SITE_URL } from "@/lib/site-data";
import { usePublicArticles } from "@/lib/public-content";

export const Route = createFileRoute("/thinking")({
  component:Thinking,
  head:()=>({
    meta:[
      {title:"Thinking, Notes & Public Principles — Yomi Onalaru"},
      {name:"description",content:"Public writing, principles and working notes on creativity, technology, company building and the journey from photography to software."},
      {property:"og:title",content:"Thinking — Yomi Onalaru"},
      {property:"og:url",content:`${SITE_URL}/thinking`},
    ],
    links:[{rel:"canonical",href:`${SITE_URL}/thinking`}],
  }),
});
function Thinking(){
  const {articles,isLoading}=usePublicArticles();
  return <div className="min-h-screen bg-[#f3f2eb] pt-32 text-[#1b221e]">
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-12">
      <span className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#5b685d]">The public notebook / 001</span>
      <h1 className="mt-6 text-[clamp(4rem,11vw,10rem)] font-semibold leading-[.85] tracking-[-.085em]">Thinking<br/><span className="text-[#72806a]">out loud.</span></h1>
      <p className="mt-8 max-w-2xl text-base leading-8 text-[#5b665e]">Selected principles, working ideas and published essays. These are public editorial notes—not private MY OS information, internal CRM records or confidential plans.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#principles" className="rounded-full bg-[#1a211c] px-6 py-3 text-xs uppercase tracking-[.16em] text-white">Principles</a>
        <a href="#essays" className="rounded-full border border-black/20 px-6 py-3 text-xs uppercase tracking-[.16em]">Essays</a>
        <Link to="/contact" className="rounded-full border border-black/20 px-6 py-3 text-xs uppercase tracking-[.16em]">Start a conversation</Link>
      </div>
    </section>
    <section id="principles" className="bg-[#d9ed7c] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center gap-3"><Quote className="h-7 w-7 stroke-[1.2]"/><h2 className="text-3xl font-semibold tracking-tight">Public principles</h2></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PRINCIPLES.map((p,i)=><motion.article key={p.title} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.04}}
            className="flex min-h-64 flex-col rounded-[2rem] bg-[#f8fae9] p-7">
            <span className="text-[10px] uppercase tracking-[.2em] text-[#71806f]">{String(i+1).padStart(2,"0")} / Principle</span>
            <h3 className="mt-auto text-2xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d685f]">{p.body}</p>
          </motion.article>)}
        </div>
        <div className="mt-12 rounded-[2rem] border border-black/15 p-8">
          <span className="text-[10px] uppercase tracking-[.2em]">Notes from the studio</span>
          <div className="mt-6 flex flex-wrap gap-3">{LESSONS.slice(0,6).map((lesson,i)=>
            <span key={i} className="rounded-full bg-white/65 px-5 py-3 text-sm">{lesson}</span>)}</div>
        </div>
      </div>
    </section>
    <section id="essays" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><span className="text-[10px] uppercase tracking-[.3em] text-[#788078]">Writing / Archive</span><h2 className="mt-3 text-5xl font-semibold tracking-[-.06em]">Essays & reflections</h2></div>
        <Link to="/blog" className="inline-flex gap-2 rounded-full border border-black/20 px-5 py-3 text-xs uppercase tracking-[.14em]">Full journal <ArrowUpRight className="h-4 w-4"/></Link>
      </div>
      {isLoading&&articles.length===0?<div role="status" className="mt-10 text-sm text-[#6e776e]">Loading public essays…</div>:
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a)=><Link to="/blog/$slug" params={{slug:a.slug}} key={a.slug}
          className="group flex min-h-72 flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white p-7 transition-transform hover:-translate-y-1">
          <BookOpen className="h-6 w-6 stroke-[1.3]"/><span className="mt-9 text-[10px] uppercase tracking-[.2em] text-[#6c756c]">{a.category} · {a.date}</span>
          <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight">{a.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6d746e]">{a.excerpt}</p>
          <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold">Read essay <ArrowUpRight className="h-4 w-4"/></span>
        </Link>)}
      </div>}
      <p className="mt-9 text-xs leading-6 text-[#7e847c]">Publication stays controlled through the existing articles CMS. Private drafts, MY OS data and TRYSA CRM records are not surfaced here.</p>
    </section>
  </div>;
}
