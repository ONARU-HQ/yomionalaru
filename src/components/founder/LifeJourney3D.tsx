import { useEffect, useRef, useState } from "react";

/**
 * Scroll-linked story engine. A single WebGL canvas moves the camera through
 * five spatial worlds. The semantic chapter overlays remain usable without
 * JavaScript, WebGL, animation or a high-performance GPU.
 */
export function LifeJourney3D({ progress }: { progress: number }) {
  const mount=useRef<HTMLDivElement>(null);
  const target=useRef(progress);
  const [status,setStatus]=useState<"fallback"|"ready">("fallback");
  useEffect(()=>{target.current=Math.max(0,Math.min(1,progress));},[progress]);
  useEffect(()=>{
    const host=mount.current;
    if(!host || typeof window==="undefined" || typeof IntersectionObserver==="undefined") return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData;
    if(reduced||saveData) return;
    let disposed=false,teardown=()=>{};
    const begin=async()=>{
      if(disposed) return;
      try{
        const T=await import("three");
        if(disposed||!host.isConnected)return;
        const scene=new T.Scene();
        scene.fog=new T.FogExp2(0x090c0c,0.018);
        const camera=new T.PerspectiveCamera(45,1,0.1,65);
        camera.position.set(0,0,10);
        const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
        renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.4));
        renderer.outputColorSpace=T.SRGBColorSpace;
        renderer.domElement.setAttribute("aria-hidden","true");
        renderer.domElement.style.cssText="display:block;width:100%;height:100%;";
        host.appendChild(renderer.domElement);
        const shared:T.BufferGeometry[]=[];
        const materials:T.Material[]=[];
        const groups:T.Group[]=[];
        const gold=0xd2b88e, mint=0x9cceb6, lime=0xc7ee73, blue=0x7eb9da;
        const wire=(geom:T.BufferGeometry,color:number,opacity=0.58)=>{
          shared.push(geom);
          const edges=new T.EdgesGeometry(geom);
          shared.push(edges);
          const mat=new T.LineBasicMaterial({color,transparent:true,opacity});
          materials.push(mat);
          return new T.LineSegments(edges,mat);
        };
        const halo=(r:number,color:number,scaleX=1)=>{
          const geom=new T.TorusGeometry(r,0.012,3,120);
          shared.push(geom);
          const mat=new T.MeshBasicMaterial({color,transparent:true,opacity:0.27});
          materials.push(mat);
          const m=new T.Mesh(geom,mat);
          m.scale.x=scaleX;
          return m;
        };
        const addObject=(g:T.Group,z:number)=>{
          g.position.z=z;
          groups.push(g);scene.add(g);
        };
        // CHAPTER I — a photographic lens: concentric glass-like rings
        const lens=new T.Group();
        for(let i=0;i<6;i++){
          const h=halo(1.05+i*0.28,i%2?mint:gold,1.1);
          h.rotation.y=i*.17;h.rotation.x=i*.1;lens.add(h);
        }
        lens.add(wire(new T.CylinderGeometry(1.45,1.45,.32,24,1,true),gold,.35));
        addObject(lens,0);
        // CHAPTER II — a studio: geometric room, doorway and luminous frame
        const studio=new T.Group();
        studio.add(wire(new T.BoxGeometry(3.2,3.3,3),mint,.4));
        studio.add(wire(new T.BoxGeometry(2,2.2,.1),gold,.6));
        const beam=halo(2.3,mint);beam.rotation.x=.7;studio.add(beam);
        addObject(studio,-8);
        // CHAPTER III — connected nodes: operational systems
        const systems=new T.Group();
        for(let i=0;i<8;i++){
          const ang=i*Math.PI/4;
          const cube=wire(new T.BoxGeometry(.75,.75,.75),i%2?mint:gold,.8);
          cube.position.set(Math.cos(ang)*2.15,Math.sin(ang)*1.55,Math.sin(ang*2)*.65);
          systems.add(cube);
        }
        systems.add(wire(new T.IcosahedronGeometry(1.1,1),lime,.75));
        systems.add(halo(3.2,blue));
        addObject(systems,-16);
        // CHAPTER IV — software: floating interfaces in an operating system
        const software=new T.Group();
        for(let i=0;i<5;i++){
          const panel=wire(new T.BoxGeometry(1.9,2.6,.08),i%2?blue:lime,.7);
          panel.position.set((i-2)*.9,(i%2?-.55:.55),-Math.abs(i-2)*.28);
          panel.rotation.y=(i-2)*-.2;
          software.add(panel);
        }
        software.add(halo(3.9,lime));
        addObject(software,-24);
        // CHAPTER V — future: evolving world/infrastructure mesh
        const future=new T.Group();
        future.add(wire(new T.IcosahedronGeometry(2.4,2),lime,.7));
        for(let i=0;i<4;i++){
          const a=halo(2.85+i*.3,i%2?blue:gold);
          a.rotation.x=i*.33;a.rotation.y=i*.46;future.add(a);
        }
        addObject(future,-32);
        const stars=new Float32Array(220*3);
        for(let i=0;i<220;i++){
          const a=i*2.399963229728653, r=5.1+(i%9)*.26;
          stars[i*3]=Math.cos(a)*r;
          stars[i*3+1]=Math.sin(a)*r;
          stars[i*3+2]=-(i%36)*1.25;
        }
        const pointsGeometry=new T.BufferGeometry();
        pointsGeometry.setAttribute("position",new T.BufferAttribute(stars,3));
        shared.push(pointsGeometry);
        const pointMaterial=new T.PointsMaterial({color:0xb9d5c7,size:.035,transparent:true,opacity:.6});
        materials.push(pointMaterial);
        scene.add(new T.Points(pointsGeometry,pointMaterial));
        let running=false,frame=0,visible=true;
        let smooth=target.current;
        const clock=new T.Clock();
        const resize=()=>{
          const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
          renderer.setSize(w,h);
          camera.aspect=w/h;
          camera.fov=w<600?58:45;
          camera.updateProjectionMatrix();
        };
        const resizeObserver=new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();
        const animate=()=>{
          if(disposed||!visible){running=false;return;}
          smooth+=(target.current-smooth)*.085;
          const step=smooth*4;
          camera.position.z=10-step*8;
          camera.position.x=Math.sin(step*Math.PI*.7)*.55;
          camera.position.y=Math.cos(step*Math.PI*.65)*.24;
          camera.lookAt(0,0,camera.position.z-9);
          const t=clock.getElapsedTime();
          groups.forEach((g,i)=>{
            const closeness=Math.max(0,1-Math.abs(i-step));
            g.rotation.y=t*.085+i*.2;
            g.rotation.x=Math.sin(t*.32+i)*.075;
            g.scale.setScalar(0.8+closeness*.23);
          });
          renderer.render(scene,camera);
          frame=requestAnimationFrame(animate);
        };
        const run=()=>{if(!running&&!disposed){running=true;frame=requestAnimationFrame(animate)}};
        const intersection=new IntersectionObserver(([entry])=>{
          visible=entry.isIntersecting&&!document.hidden;
          if(visible)run();else{cancelAnimationFrame(frame);running=false;}
        },{threshold:0});
        intersection.observe(host);
        const visibility=()=>{
          visible=!document.hidden&&host.getBoundingClientRect().bottom>0&&host.getBoundingClientRect().top<innerHeight;
          if(visible)run();else{cancelAnimationFrame(frame);running=false;}
        };
        document.addEventListener("visibilitychange",visibility);
        run();
        if(!disposed)setStatus("ready");
        teardown=()=>{
          disposed=true;cancelAnimationFrame(frame);
          intersection.disconnect();
          resizeObserver.disconnect();
          document.removeEventListener("visibilitychange",visibility);
          shared.forEach(g=>g.dispose());
          materials.forEach(m=>m.dispose());
          renderer.dispose();
          if(renderer.domElement.parentElement===host)host.removeChild(renderer.domElement);
        };
      }catch{
        // Intentional no-WebGL path: the readable story is still available.
      }
    };
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){observer.disconnect();void begin();}
    },{rootMargin:"200px"});
    observer.observe(host);
    return ()=>{disposed=true;observer.disconnect();teardown();};
  },[]);
  return <div ref={mount} aria-hidden="true" data-renderer={status}
    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(93,147,119,.22),transparent_56%),linear-gradient(145deg,#0b1010,#080a0c_60%,#10140d)]"/>;
}
