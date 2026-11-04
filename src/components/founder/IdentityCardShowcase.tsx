import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Camera, Code2, Quote, Instagram, Linkedin, Grid3X3, Rows3 } from "lucide-react";
import { SOCIALS } from "@/lib/site-data";

const chapters=[
  {name:"The beginnings",label:"01 / Creative work",image:"/media/yomi-portrait-1080.webp",href:"/journey"},
  {name:"Spaces to create",label:"02 / YV Studios",image:"/media/the-oria-space-1080.webp",href:"https://yvstudios.ng"},
  {name:"A different perspective",label:"03 / Selected photography",image:"/media/studio-portrait-1080.webp",href:"/projects"},
  {name:"Building new worlds",label:"04 / Vision & ventures",image:"/media/interior-light-1080.webp",href:"/companies"},
];
function Destination({href,children,className}:{href:string;children:React.ReactNode;className:string}){
  return href.startsWith("/")?<Link to={href} className={className}>{children}</Link>:<a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
export function IdentityCardShowcase(){
  const [mode,setMode]=useState<"grid"|"list">("grid");
  const [style,setStyle]=useState<"light"|"dark">("dark");
  const reduced=useReducedMotion();
  const reveal=reduced?{}:{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:.6}};
  return <div className="overflow-hidden bg-[#f1eee5] text-[#181e1a]">
    <section aria-labelledby="profile-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <motion.div {...reveal} className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-[11px] uppercase tracking-[.27em] text-[#6d766b]">Personal identity / 001</p><h2 id="profile-title" className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[.96] tracking-[-.08em]">More than<br/><span className="text-[#6e8b75]">a portfolio.</span></h2></div>
        <p className="max-w-xs text-sm leading-7 text-[#67726a]">Photographer, creative director, founder and builder. One identity, many worlds.</p>
      </motion.div>
      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <motion.article {...reveal} className="group relative min-h-[660px] overflow-hidden rounded-[2.7rem] bg-[#18231d] text-white">
          <img src="/media/yomi-portrait-1080.webp" srcSet="/media/yomi-portrait-640.webp 640w,/media/yomi-portrait-1080.webp 1080w" sizes="(max-width:1024px) 100vw,44vw" loading="lazy" alt="Yomi Onalaru" className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent"/>
          <span className="absolute left-6 top-6 rounded-full border border-white/30 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[.2em] backdrop-blur-md">Y / The living profile</span>
          <div className="absolute inset-x-0 bottom-0 p-8"><p className="text-[11px] uppercase tracking-[.2em] text-[#e8ece5]/80">Creator · Founder · Builder</p><h3 className="mt-4 text-[clamp(3.6rem,8vw,6.4rem)] font-semibold leading-[.9] tracking-[-.09em]">Yomi<br/>Onalaru.</h3><p className="mt-5 max-w-sm text-sm leading-7 text-white/80">From seeing the world through a lens to building the systems and ideas that shape it.</p><Link to="/journey" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#dff088] px-6 text-xs font-semibold uppercase tracking-[.13em] text-[#172019]">Experience my story <ArrowUpRight className="h-4 w-4"/></Link></div>
        </motion.article>
        <motion.article {...reveal} className="flex flex-col rounded-[2.7rem] bg-white p-7 shadow-[0_15px_70px_rgba(34,51,31,.07)] sm:p-11">
          <div className="flex items-center justify-between"><div className="flex items-center gap-4"><img src="/media/yomi-portrait-640.webp" alt="" className="h-16 w-16 rounded-2xl object-cover"/><div><h3 className="text-xl font-semibold tracking-tight">Yomi Onalaru</h3><p className="text-xs text-[#738073]">My world through my lens</p></div></div><span className="text-xs text-[#65856c]">● Lagos</span></div>
          <div className="my-8 border-y border-[#e8eae3] py-9"><span className="text-[10px] uppercase tracking-[.22em] text-[#7e877b]">About me</span><p className="mt-5 text-[clamp(1.7rem,3.5vw,3rem)] font-semibold leading-[1.17] tracking-[-.065em]">A creative mind building at the intersection of <span className="text-[#718b75]">stories, software and possibility.</span></p><p className="mt-6 max-w-lg text-sm leading-8 text-[#687268]">I started with photography. Today I work across creative direction, business operations, software and immersive digital experiences. This is a window into the person and the thinking behind the work.</p></div>
          <div className="grid grid-cols-3 gap-2">
            {[{icon:Camera,label:"Creative",to:"/projects"},{icon:Code2,label:"Ventures",to:"/companies"},{icon:Quote,label:"Thinking",to:"/thinking"}].map(({icon:Icon,label,to})=><Link key={label} to={to} className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl bg-[#f0f4e9] text-center transition hover:bg-[#dff088]"><Icon className="h-6 w-6 stroke-[1.5]"/><span className="text-xs font-semibold">{label}</span></Link>)}
          </div>
          <div className="mt-auto pt-10"><p className="mb-4 text-[10px] uppercase tracking-[.22em] text-[#7e877b]">Connect with me</p><div className="flex flex-wrap gap-2">{SOCIALS.personal.slice(0,4).map((s,i)=><a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#dce3d6] px-4 text-xs font-medium transition hover:bg-[#dff088]">{i===0?<Instagram className="h-4 w-4"/>:i===2?<Linkedin className="h-4 w-4"/>:<ArrowUpRight className="h-4 w-4"/>}{s.label}</a>)}</div></div>
        </motion.article>
      </div>
    </section>

    <section aria-labelledby="card-gallery-title" className="bg-[#fafbf7] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="text-[11px] uppercase tracking-[.23em] text-[#6a786c]">The chapters / The work</p><h2 id="card-gallery-title" className="mt-4 text-[clamp(3rem,7vw,6rem)] font-semibold leading-[.96] tracking-[-.075em]">Discover the<br/>different worlds.</h2></div>
          <div role="group" aria-label="Gallery layout" className="flex rounded-full bg-[#eaeee4] p-1"><button onClick={()=>setMode("grid")} aria-pressed={mode==="grid"} className={mode==="grid"?"flex min-h-11 items-center gap-2 rounded-full bg-[#18231a] px-4 text-xs text-white":"flex min-h-11 items-center gap-2 rounded-full px-4 text-xs"}><Grid3X3 className="h-4 w-4"/> Grid</button><button onClick={()=>setMode("list")} aria-pressed={mode==="list"} className={mode==="list"?"flex min-h-11 items-center gap-2 rounded-full bg-[#18231a] px-4 text-xs text-white":"flex min-h-11 items-center gap-2 rounded-full px-4 text-xs"}><Rows3 className="h-4 w-4"/> List</button></div>
        </div>
        <div className={mode==="grid"?"grid auto-rows-[210px] grid-cols-2 gap-3 sm:auto-rows-[270px] sm:grid-cols-3 lg:auto-rows-[300px] lg:grid-cols-4":"grid gap-4 md:grid-cols-2"}>
          {chapters.map((c,i)=><Destination key={c.name} href={c.href} className={mode==="grid"?"group relative overflow-hidden rounded-[1.8rem] bg-[#212c24] "+(i===0?"col-span-2 row-span-2":i===1?"row-span-2":""):"group flex items-center gap-5 rounded-[2rem] bg-white p-4 shadow-sm"}>
            <img src={c.image} loading="lazy" alt="" className={mode==="grid"?"absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105":"h-32 w-28 shrink-0 rounded-2xl object-cover"}/>
            {mode==="grid"&&<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"/>}
            <div className={mode==="grid"?"absolute inset-x-0 bottom-0 p-5 text-white sm:p-7":"flex-1 text-[#1a251c]"}><p className="text-[10px] uppercase tracking-[.2em] opacity-75">{c.label}</p><h3 className={i===0&&mode==="grid"?"mt-3 text-3xl font-semibold tracking-tight sm:text-5xl":"mt-2 text-lg font-semibold tracking-tight sm:text-2xl"}>{c.name}</h3><ArrowUpRight className="mt-4 h-5 w-5"/></div>
          </Destination>)}
        </div>
        <div className="mt-8 text-right"><Link to="/projects" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#18231a] px-6 text-xs font-semibold uppercase tracking-[.15em] text-white">See all work <ArrowUpRight className="h-4 w-4"/></Link></div>
      </div>
    </section>

    <section aria-labelledby="styles-title" className="bg-[#3b241e] px-5 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5"><div><span className="text-[11px] uppercase tracking-[.25em] text-[#d1b4a6]">Identity / Two moods</span><h2 id="styles-title" className="mt-4 text-[clamp(2.8rem,7vw,5.7rem)] font-semibold leading-[.96] tracking-[-.075em]">One story.<br/>Different frames.</h2></div><div role="group" aria-label="Profile theme"><button aria-pressed={style==="light"} onClick={()=>setStyle("light")} className={style==="light"?"min-h-11 rounded-full bg-white px-5 text-xs font-semibold text-black":"min-h-11 rounded-full border border-white/30 px-5 text-xs"}>Light</button><button aria-pressed={style==="dark"} onClick={()=>setStyle("dark")} className={style==="dark"?"ml-2 min-h-11 rounded-full bg-[#e1f38d] px-5 text-xs font-semibold text-black":"ml-2 min-h-11 rounded-full border border-white/30 px-5 text-xs"}>Dark</button></div></div>
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
          {(["light","dark"] as const).map(tone=><div key={tone} className={"overflow-hidden rounded-[2.4rem] border-[8px] transition duration-500 "+(tone===style?"-translate-y-2 shadow-2xl":"opacity-75")+(tone==="light"?" border-white bg-white text-[#142018]":" border-[#282b29] bg-[#151a17] text-white")}>
            <img src="/media/yomi-portrait-1080.webp" alt="Yomi Onalaru" loading="lazy" className="h-64 w-full object-cover object-top"/>
            <div className="p-6"><p className="text-2xl font-semibold tracking-tight">Yomi Onalaru ✦</p><p className="mt-2 text-xs opacity-65">Creative Director · Founder · Builder</p><div className="my-6 grid grid-cols-3 gap-2 border-y border-current/10 py-4 text-center text-[10px] uppercase tracking-[.08em]"><span>Creative</span><span>Technology</span><span>Ideas</span></div><Link to="/contact" className={tone==="light"?"flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1b251c] text-xs font-semibold uppercase tracking-widest text-white":"flex min-h-12 items-center justify-center gap-2 rounded-full bg-white text-xs font-semibold uppercase tracking-widest text-black"}>Get in touch <ArrowUpRight className="h-4 w-4"/></Link></div>
          </div>)}
        </div>
      </div>
    </section>
  </div>;
}
