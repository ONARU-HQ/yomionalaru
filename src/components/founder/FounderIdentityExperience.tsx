import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Camera, Code2, Film, Layers3, Quote, Sparkles } from "lucide-react";
import { lazy, Suspense } from "react";
import { TIMELINE, PRINCIPLES } from "@/lib/site-data";
import { usePublicArticles, usePublicProjects } from "@/lib/public-content";

const Universe = lazy(() => import("./FounderUniverse3D").then(m => ({default:m.FounderUniverse3D})));

const ventures = [
  { name:"Yomi Visuals HQ", category:"Creative direction / photography", phase:"CREATING", href:"/companies/yomi-visuals", image:"/media/yomi-portrait-1080.webp", icon:Camera },
  { name:"YV Studios Africa", category:"Creative production spaces", phase:"OPERATING", href:"https://yvstudios.ng", image:"/media/the-oria-space-1080.webp", icon:Layers3 },
  { name:"TRYSA", category:"Business operating system", phase:"BUILDING", href:"https://trysa.app", image:"", icon:Code2 },
  { name:"PlayBaaq", category:"Artists / music / entertainment", phase:"BUILDING", href:"/projects", image:"", icon:Film },
  { name:"Shop 1401", category:"Fashion and commerce", phase:"BUILDING", href:"https://trysa.app/shop1401", image:"/media/elegance-framed-in-light-1080.webp", icon:Sparkles },
  { name:"ONARU OS", category:"Products / systems / intelligence", phase:"IN DEVELOPMENT", href:"https://onaru.app", image:"", icon:Layers3 },
] as const;

function Entry({href,children,className}:{href:string;children:React.ReactNode;className?:string}) {
  if (href.startsWith("/")) return <Link to={href} className={className}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
function Eyebrow({children}:{children:React.ReactNode}) {
  return <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#adadad]">{children}</span>;
}
function onArchiveError(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.dataset.fallback === "done") { img.style.opacity = "0"; return; }
  img.dataset.fallback = "done";
  img.removeAttribute("srcset");
  const path = new URL(img.currentSrc || img.src, window.location.origin).pathname;
  img.src = path.includes("yomi-portrait") ? "/media/yomi-portrait.png" : path.replace(/-1080\.webp$/, ".jpg");
}
export function FounderIdentityExperience() {
  const reduced = useReducedMotion();
  const anim = (delay=0) => reduced ? {} : {
    initial:{opacity:0,y:26},whileInView:{opacity:1,y:0},
    viewport:{once:true,amount:0.15},transition:{duration:0.68,delay,ease:[0.22,1,0.36,1] as [number,number,number,number]},
  };
  const {articles}=usePublicArticles(3);
  const projects=usePublicProjects().slice(0,3);
  return <div className="identity-v2 text-[#f5f5f5]">
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-[#090909] pb-20 pt-32 sm:pt-40" aria-labelledby="identity-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(180,180,180,0.10),transparent_46%),radial-gradient(ellipse_at_10%_10%,rgba(180,180,180,0.08),transparent_55%)]"/>
      <div className="pointer-events-none absolute inset-0 z-0 opacity-80" aria-hidden>
        <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgba(160,160,160,.12),transparent_55%)]"/>}>
          <Universe/>
        </Suspense>
      </div>
      <div className="relative z-10 mx-auto grid min-h-[65svh] max-w-7xl items-center gap-8 px-6 lg:grid-cols-[1.07fr_0.93fr] lg:gap-12">
        <div className="relative z-20 max-w-[690px]">
          <motion.div {...anim()}><Eyebrow>Independent creative / Founder / Builder</Eyebrow></motion.div>
          <motion.h1 {...anim(0.08)} id="identity-title" className="mt-8 font-sans text-[clamp(3.8rem,10.5vw,9.3rem)] font-medium leading-[0.84] tracking-[-0.085em]">
            One life.<br/><span className="text-[#d3d3d3]">Many</span><br/>worlds.
          </motion.h1>
          <motion.p {...anim(0.16)} className="mt-8 max-w-md text-base leading-7 text-[#bdbdbd] sm:text-lg">
            I’m Yomi Onalaru. Photographer turned creative director, founder and product builder.
            My work moves between imagery, software, businesses and the ideas connecting them.
          </motion.p>
          <motion.div {...anim(0.24)} className="mt-8 flex flex-wrap gap-3">
            <a href="/journey" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#ffffff] px-6 text-xs font-semibold uppercase tracking-[.15em] text-black transition hover:bg-[#dddddd]">Enter the 3D journey <ArrowDownRight className="h-4 w-4"/></a>
            <Link to="/projects" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 bg-black/30 px-6 text-xs uppercase tracking-[.14em] transition hover:border-white">Selected work <ArrowUpRight className="h-4 w-4"/></Link>
          </motion.div>
        </div>
        <motion.div {...anim(0.12)} className="relative mx-auto w-full max-w-[490px] pb-10 sm:pb-0" aria-label="Featured personal profile">
          <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#252525]/85 p-3 shadow-[0_35px_110px_rgba(0,0,0,0.44)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[1.3rem] bg-[#161616]">
              <img onError={onArchiveError} src="/media/yomi-portrait-1080.webp" srcSet="/media/yomi-portrait-640.webp 640w,/media/yomi-portrait-1080.webp 1080w" sizes="(max-width:768px) 92vw,460px" width="600" height="720" alt="Portrait from Yomi Onalaru's existing media library" fetchPriority="high" className="aspect-[4/4.4] w-full object-cover object-top grayscale"/>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent px-6 pb-7 pt-24">
                <Eyebrow>The living profile</Eyebrow>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Yomi Onalaru</h2>
                <p className="mt-1 text-sm text-white/75">Creative Director · Entrepreneur · Builder</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.12em] text-white/75">
              <span className="rounded-xl bg-white/5 px-2 py-3">Create</span><span className="rounded-xl bg-white/5 px-2 py-3">Build</span><span className="rounded-xl bg-white/5 px-2 py-3">Share</span>
            </div>
          </div>
          <span className="absolute -left-3 top-12 rounded-2xl border border-white/15 bg-[#242424]/90 px-4 py-3 text-xs shadow-xl backdrop-blur-md sm:-left-6">Lagos, Nigeria <span className="ml-2 text-[#ffffff]">●</span></span>
          <span className="absolute -right-2 bottom-24 rounded-2xl border border-white/15 bg-[#202020]/90 px-4 py-3 text-xs shadow-xl backdrop-blur-md sm:-right-6">From lens to code ↗</span>
        </motion.div>
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl justify-between px-6 pt-7 text-[10px] uppercase tracking-[0.22em] text-white/50">
        <span>Chapter 01 / Identity</span><span>Scroll to explore ↓</span>
      </div>
    </section>

    <section id="the-journey" className="bg-[#f2f2f2] px-6 py-24 text-[#151515] md:py-32" aria-labelledby="journey-title">
      <div className="mx-auto max-w-7xl">
        <motion.div {...anim()} className="flex flex-col justify-between gap-6 border-b border-black/15 pb-12 md:flex-row md:items-end">
          <div><span className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#686868]">02 / The journey</span>
            <h2 id="journey-title" className="mt-4 max-w-3xl text-[clamp(3.1rem,8vw,6.5rem)] font-semibold leading-[.94] tracking-[-.07em]">The camera<br/>was the beginning.</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#666666]">A documentary-style timeline of the work, creative spaces, businesses and software that followed. Each chapter builds on the last.</p>
        </motion.div>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <motion.article {...anim()} className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] bg-[#202020]">
            <img onError={onArchiveError} src="/media/studio-portrait-1080.webp" alt="Creative portrait from Yomi's photography archive" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85 grayscale"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10"/>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <Eyebrow>Photography and visual storytelling</Eyebrow>
              <h3 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">Learning to see.<br/>Then learning to build.</h3>
              <Entry href="/projects" className="mt-6 inline-flex items-center gap-2 border-b border-white/70 pb-2 text-xs uppercase tracking-widest">View my work <ArrowUpRight className="h-4 w-4"/></Entry>
            </div>
          </motion.article>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {TIMELINE.slice(0,5).map((t,i)=><motion.div key={t.year} {...anim(i*0.045)}
              className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-[1.5rem] border border-black/10 bg-white/70 p-5 sm:grid-cols-1 lg:grid-cols-[4.5rem_1fr]">
                <span className="text-sm font-semibold tracking-tight text-[#666666]">{t.year}</span>
                <div><h3 className="text-lg font-semibold tracking-tight">{t.title}</h3><p className="mt-1 text-sm leading-6 text-[#666666]">{t.body}</p></div>
              </motion.div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#101010] px-6 py-24 md:py-32" id="my-world" aria-labelledby="world-title">
      <div className="mx-auto max-w-7xl">
        <motion.div {...anim()} className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div><Eyebrow>03 / Things I am building</Eyebrow><h2 id="world-title" className="mt-4 max-w-3xl text-[clamp(3.2rem,7.5vw,6.8rem)] font-semibold leading-[.94] tracking-[-.07em]">A connected<br/><span className="text-[#ffffff]">universe.</span></h2></div>
          <p className="max-w-xs text-sm leading-7 text-white/55">Each card opens the actual product or company. Live services and work in development are distinguished—no invented metrics.</p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ventures.map((v,i)=>{const Icon=v.icon;return <motion.div {...anim(i*0.05)} key={v.name} className="group">
            <Entry href={v.href} className={`relative flex min-h-[380px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#2a2a2a] via-[#171717] to-[#080808] p-6 transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#ffffff]`}>
              {v.image&&<img onError={onArchiveError} loading="lazy" src={v.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale transition duration-700 group-hover:scale-105"/>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15"/>
              <div className="relative z-10 flex justify-between gap-2 text-[10px] font-semibold tracking-[.23em]">
                <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2">{v.phase}</span><ArrowUpRight className="h-5 w-5"/>
              </div>
              <div className="relative z-10 my-auto grid place-items-center py-10"><Icon className="h-16 w-16 stroke-[.8] text-white/60" aria-hidden/></div>
              <div className="relative z-10"><p className="mb-2 text-xs text-white/65">{v.category}</p><h3 className="text-3xl font-semibold tracking-[-.055em]">{v.name}</h3><div className="mt-5 flex items-center gap-2 text-xs font-semibold">Explore <ArrowRight className="h-4 w-4"/></div></div>
            </Entry>
          </motion.div>})}
        </div>
      </div>
    </section>

    <section className="bg-[#f5f5f5] px-6 py-24 text-[#151515] md:py-32" aria-labelledby="work-title">
      <div className="mx-auto max-w-7xl">
        <motion.div {...anim()} className="flex flex-wrap items-end justify-between gap-6">
          <div><span className="text-[10px] uppercase tracking-[.3em] text-[#666666]">04 / Selected work</span><h2 id="work-title" className="mt-4 text-[clamp(3rem,7.5vw,6.5rem)] font-semibold leading-[.94] tracking-[-.07em]">Work that<br/>speaks first.</h2></div>
          <Entry href="/projects" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-black/20 px-5 text-xs uppercase tracking-widest">View all projects <ArrowUpRight className="h-4 w-4"/></Entry>
        </motion.div>
        <div className="mt-11 grid gap-4 md:grid-cols-3">
          {projects.map((p,i)=><motion.article {...anim(i*.08)} key={p.slug} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white">
            <div className="overflow-hidden bg-[#dddddd]"><img onError={onArchiveError} alt={p.title} loading="lazy" src={p.image || ["/media/the-oria-space-1080.webp","/media/monochrome-1080.webp","/media/interior-light-1080.webp"][i%3]} className="aspect-[4/4.5] w-full object-cover grayscale transition duration-700 hover:scale-[1.04]"/></div>
            <div className="p-6"><span className="text-[10px] uppercase tracking-[.2em] text-[#777777]">{p.tag} · {p.year}</span><h3 className="mt-3 text-2xl font-semibold tracking-tight">{p.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#666666]">{p.body}</p></div>
          </motion.article>)}
        </div>
      </div>
    </section>

    <section className="bg-[#eeeeee] px-6 py-24 text-[#111111] md:py-32" aria-labelledby="thinking-title">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <motion.div {...anim()}><span className="text-[10px] font-semibold uppercase tracking-[.3em]">05 / Thinking in public</span>
            <h2 id="thinking-title" className="mt-6 text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[.9] tracking-[-.08em]">Ideas.<br/>Notes.<br/>Questions.</h2>
            <p className="mt-7 max-w-sm text-sm leading-7">A living collection of written thinking, practical lessons and public essays. No private MY OS information is published here.</p>
            <Entry href="/thinking" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#111111] px-6 text-xs font-semibold uppercase tracking-[.15em] text-white">Explore my thinking <ArrowUpRight className="h-4 w-4"/></Entry>
          </motion.div>
          <div className="grid gap-4">
            {PRINCIPLES.slice(0,2).map((p,i)=><motion.article {...anim(i*.1)} key={p.title} className="rounded-[2rem] bg-[#ffffff] p-8">
              <Quote className="mb-8 h-8 w-8 stroke-[1.1]" aria-hidden/><span className="text-[10px] uppercase tracking-[.2em] text-[#777777]">From the public principles collection</span>
              <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">{p.title}</h3><p className="mt-3 text-sm leading-7 text-[#666666]">{p.body}</p>
            </motion.article>)}
            {articles[0]&&<motion.div {...anim(.16)}><Entry href={`/blog/${articles[0].slug}`} className="flex items-center justify-between gap-5 rounded-[2rem] bg-[#252525] p-7 text-white">
              <div><span className="text-[10px] uppercase tracking-widest text-white/50">Latest essay</span><h3 className="mt-2 text-xl font-semibold">{articles[0].title}</h3></div><ArrowUpRight className="h-6 w-6 shrink-0"/></Entry></motion.div>}
          </div>
        </div>
      </div>
    </section>
  </div>;
}
