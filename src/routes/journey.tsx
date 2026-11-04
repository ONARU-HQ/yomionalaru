import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Camera, Building2, Workflow, Sparkles, Orbit } from "lucide-react";
import { SITE_URL } from "@/lib/site-data";

const Space=lazy(()=>import("@/components/founder/LifeJourney3D").then(m=>({default:m.LifeJourney3D})));
const chapters=[
  {id:"lens",number:"01",year:"Creative beginnings",heading:"First, I learned to see.",kicker:"The lens",icon:Camera,
    text:"Photography gave me a way to notice details, understand people, and tell stories. Before software or systems, there was a camera.",
    image:"/media/yomi-portrait-1080.webp",alt:"Portrait from Yomi Onalaru's photographic archive",
    cta:"Explore the photography",href:"/projects",color:"#dddddd"},
  {id:"studio",number:"02",year:"Yomi Visuals",heading:"Then I learned to create.",kicker:"The studio",icon:Building2,
    text:"What started as a craft grew into creative direction, film, brand campaigns and a production studio. Building creative spaces became part of the work.",
    image:"/media/the-oria-space-1080.webp",alt:"The ORIA creative studio space",
    cta:"Visit YV Studios",href:"https://yvstudios.ng",color:"#bdbdbd"},
  {id:"systems",number:"03",year:"Building businesses",heading:"A question changed everything.",kicker:"The systems",icon:Workflow,
    text:"How can creative businesses operate without relying on one person for every decision? That question began a shift from creating projects to designing processes and infrastructure.",
    image:"/media/interior-light-1080.webp",alt:"A creative interior space from the visual archive",
    cta:"Explore the ecosystem",href:"/companies",color:"#aaaaaa"},
  {id:"trysa",number:"04",year:"TRYSA / 2026",heading:"Ideas became software.",kicker:"The operating system",icon:Sparkles,
    text:"TRYSA brings together bookings, client relationships and business workflows. I am also learning and building in interactive technology, AI and digital experiences.",
    image:"/media/studio-light-study-1080.webp",alt:"Studio lighting composition from the existing portfolio",
    cta:"Explore TRYSA",href:"https://trysa.app",color:"#eeeeee"},
  {id:"future",number:"05",year:"The road ahead",heading:"Still becoming.",kicker:"The vision",icon:Orbit,
    text:"Through ONARU, my vision connects creative spaces, technology, people, learning and new kinds of worlds. This story is unfolding—and the work is still being built.",
    image:"/media/new-year-portrait-1080.webp",alt:"Portrait from the photographic archive",
    cta:"See what I'm building",href:"/companies",color:"#cccccc"},
] as const;

export const Route=createFileRoute("/journey")({
  component:Journey,
  head:()=>({
    meta:[
      {title:"The Journey — Yomi Onalaru | From the Lens to Building Worlds"},
      {name:"description",content:"An immersive five-chapter 3D story of Yomi Onalaru's creative journey: photography, studios, systems, software and the future."},
      {property:"og:title",content:"The Journey — Yomi Onalaru"},
      {property:"og:url",content:`${SITE_URL}/journey`},
    ],
    links:[{rel:"canonical",href:`${SITE_URL}/journey`}],
  }),
});
function Journey(){
  const story=useRef<HTMLDivElement>(null);
  const [progress,setProgress]=useState(0);
  const [chapter,setChapter]=useState(0);
  useEffect(()=>{
    let frame=0;
    const update=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const el=story.current;
        if(!el)return;
        const rect=el.getBoundingClientRect();
        const distance=Math.max(1,el.offsetHeight-innerHeight);
        const p=Math.max(0,Math.min(1,-rect.top/distance));
        setProgress(p);
        setChapter(Math.min(chapters.length-1,Math.floor(p*chapters.length+.15)));
      });
    };
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
  },[]);
  return <div className="relative isolate bg-[#0b0b0b] text-[#ffffff]">
    <nav aria-label="Journey controls" className="fixed inset-x-0 top-24 z-40 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
      <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[#090909]/80 px-4 text-[11px] uppercase tracking-[.15em] backdrop-blur-lg hover:border-[#eeeeee]">
        <ArrowLeft className="h-4 w-4"/> Back home
      </Link>
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-[#090909]/80 px-4 py-3 text-[10px] uppercase tracking-[.16em] backdrop-blur-lg">
        <span className="text-[#eeeeee]">Chapter {String(chapter+1).padStart(2,"0")}</span>
        <span className="text-white/50">/ 05</span>
      </div>
    </nav>

    <div ref={story} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden" aria-hidden="true">
        <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(circle,#252525,#0b0b0b_70%)]"/>}>
          <Space progress={progress}/>
        </Suspense>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,9,.65),transparent_78%),linear-gradient(0deg,rgba(7,10,9,.68),transparent_55%)]"/>
        <div className="absolute bottom-0 left-0 h-[3px] bg-[#eeeeee] transition-[width] duration-100" style={{width:`${progress*100}%`}}/>
      </div>
      <div className="relative -mt-[100svh]">
        {chapters.map((c,i)=>{
          const Icon=c.icon;
          const hrefClass="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-xs uppercase tracking-[.13em] backdrop-blur-lg transition hover:border-[#eeeeee] hover:bg-white/15";
          return <section id={c.id} key={c.id} aria-labelledby={`title-${c.id}`}
            className="relative grid min-h-[100svh] scroll-mt-20 items-center px-6 pb-14 pt-44 sm:pb-20 lg:pt-32">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(260px,.66fr)] md:gap-16">
              <div className="max-w-[700px] rounded-[2rem] border border-white/10 bg-[#111111]/55 p-7 backdrop-blur-[10px] sm:p-10 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
                <p className="text-[11px] uppercase tracking-[.28em] text-white/65"><span className="mr-4" style={{color:c.color}}>{c.number} / 05</span>{c.kicker}</p>
                <h1 id={`title-${c.id}`} className="mt-7 text-[clamp(3.4rem,7.6vw,7.8rem)] font-semibold leading-[.9] tracking-[-.078em]">{c.heading}</h1>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[.25em]" style={{color:c.color}}>{c.year}</p>
                <p className="mt-5 max-w-lg text-base leading-8 text-[#d0d0d0]">{c.text}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  {c.href.startsWith("/")?
                    <Link to={c.href} className={hrefClass}>{c.cta}<ArrowUpRight className="h-4 w-4"/></Link>:
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className={hrefClass}>{c.cta}<ArrowUpRight className="h-4 w-4"/></a>}
                  {i<chapters.length-1?
                    <a href={`#${chapters[i+1].id}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#eeeeee] px-5 text-xs font-semibold uppercase tracking-[.13em] text-[#151515]">Next chapter <ArrowDown className="h-4 w-4"/></a>:
                    <Link to="/thinking" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#eeeeee] px-5 text-xs font-semibold uppercase tracking-[.13em] text-[#151515]">Read my thinking <ArrowUpRight className="h-4 w-4"/></Link>}
                </div>
              </div>
              <figure className="relative mx-auto w-full max-w-[350px] overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#202020]/75 p-2 shadow-[0_20px_90px_rgba(0,0,0,.5)] backdrop-blur-xl md:rotate-[2deg]">
                <div className="relative overflow-hidden rounded-[2rem]">
                  <img src={c.image} alt={c.alt} width="440" height="550" loading={i===0?"eager":"lazy"} onError={event=>{const img=event.currentTarget;if(img.dataset.backup)return;img.dataset.backup="1";img.src=img.src.replace(/-1080\.webp$/, ".jpg");}} className="aspect-[4/4.7] w-full object-cover grayscale"/>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-24">
                    <Icon className="mb-3 h-6 w-6 stroke-[1.2]" aria-hidden="true"/>
                    <p className="text-xs uppercase tracking-[.2em] text-white/80">{c.kicker}</p>
                  </div>
                </div>
              </figure>
            </div>
          </section>;
        })}
      </div>
    </div>
    <footer className="relative border-t border-white/15 bg-[#0b0b0b] px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <div><p className="text-xs uppercase tracking-[.23em] text-[#eeeeee]">Yomi Onalaru</p>
          <p className="mt-2 max-w-sm text-sm text-white/55">An evolving story. Photography, systems, ideas and the work ahead.</p></div>
        <Link to="/" className="rounded-full border border-white/20 px-5 py-3 text-xs uppercase tracking-[.13em]">Return to the universe</Link>
      </div>
    </footer>
  </div>;
}
