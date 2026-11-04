import { useEffect, useRef, useState } from "react";

/**
 * Progressive-enhancement Three.js scene. This is decorative: all content,
 * links and navigation remain semantic HTML. On reduced motion, low power,
 * absent WebGL, or failed chunk loads, the static atmospheric design remains.
 */
export function FounderUniverse3D() {
  const mount = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const node = mount.current;
    if (!node || typeof window === "undefined") return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced.matches || saveData) return;

    let disposed = false;
    let cleanup = () => {};
    let observer: IntersectionObserver | undefined;
    const start = async () => {
      if (disposed || !node.isConnected) return;
      try {
        const THREE = await import("three");
        if (disposed || !node.isConnected) return;
        const width = Math.max(node.clientWidth, 1);
        const height = Math.max(node.clientHeight, 1);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 0, 12);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
        node.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);
        for (let i = 0; i < 6; i++) {
          const geo = new THREE.TorusGeometry(2.55 + i * 0.32, 0.0075, 3, 180);
          const mat = new THREE.MeshBasicMaterial({
            color: i % 2 ? 0xd0d0d0 : 0x888888, transparent: true, opacity: 0.12 + (5 - i) * 0.023,
          });
          const ring = new THREE.Mesh(geo, mat);
          ring.rotation.x = 0.55 + i * 0.13;
          ring.rotation.y = i * 0.25;
          group.add(ring);
        }
        const icosahedron = new THREE.IcosahedronGeometry(1.28, 1);
        const wire = new THREE.LineSegments(
          new THREE.EdgesGeometry(icosahedron),
          new THREE.LineBasicMaterial({ color: 0xc0c0c0, transparent: true, opacity: 0.34 }),
        );
        group.add(wire);
        const points = new Float32Array(270 * 3);
        for (let i = 0; i < 270; i++) {
          // Deterministic points; no per-render random layout shifts.
          const phi = i * 2.399963229728653;
          const z = 1 - (2 * (i + 0.5)) / 270;
          const r = Math.sqrt(1 - z * z) * (3.6 + (i % 5) * 0.16);
          points[i * 3] = Math.cos(phi) * r;
          points[i * 3 + 1] = Math.sin(phi) * r;
          points[i * 3 + 2] = z * 3.8;
        }
        const starsGeo = new THREE.BufferGeometry();
        starsGeo.setAttribute("position", new THREE.BufferAttribute(points, 3));
        const stars = new THREE.Points(starsGeo,
          new THREE.PointsMaterial({ color: 0xbbbbbb, size: 0.026, transparent: true, opacity: 0.44 }));
        group.add(stars);
        let frame = 0;
        let visible = true;
        let intersecting = true;
        const pointer = { x: 0, y: 0 };
        const onPointer = (event: PointerEvent) => {
          const rect = node.getBoundingClientRect();
          pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
          pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
        };
        const onResize = () => {
          const w = Math.max(1, node.clientWidth), h = Math.max(1, node.clientHeight);
          camera.aspect = w / h;
          camera.position.z = w < 560 ? 15 : 12;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(node);
        node.addEventListener("pointermove", onPointer, { passive: true });
        onResize();
        const clock = new THREE.Clock();
        const render = () => {
          if (!visible || disposed) return;
          const elapsed = clock.getElapsedTime();
          group.rotation.y = elapsed * 0.055 + pointer.x * 0.22;
          group.rotation.x = 0.14 + Math.sin(elapsed * 0.23) * 0.11 - pointer.y * 0.12;
          wire.rotation.y = elapsed * -0.11;
          renderer.render(scene, camera);
          frame = requestAnimationFrame(render);
        };
        const visibilityObserver = new IntersectionObserver(([entry]) => {
          intersecting = entry.isIntersecting;
          visible = intersecting && !document.hidden;
          if (visible) render();
          else cancelAnimationFrame(frame);
        });
        const onVisibility = () => {
          visible = !document.hidden && intersecting;
          if (visible) render();
          else cancelAnimationFrame(frame);
        };
        visibilityObserver.observe(node);
        document.addEventListener("visibilitychange", onVisibility);
        render();
        if (!disposed) setAvailable(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          document.removeEventListener("visibilitychange", onVisibility);
          node.removeEventListener("pointermove", onPointer);
          visibilityObserver.disconnect();
          resizeObserver.disconnect();
          starsGeo.dispose();
          icosahedron.dispose();
          stars.material.dispose();
          wire.geometry.dispose();
          wire.material.dispose();
          group.traverse(child => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              if (Array.isArray(child.material)) child.material.forEach(mat => mat.dispose());
              else child.material.dispose();
            }
          });
          renderer.dispose();
          if (renderer.domElement.parentElement === node) node.removeChild(renderer.domElement);
        };
      } catch {
        // Feature is optional. No fallback network call, no browser error UI.
      }
    };
    observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer?.disconnect();
      void start();
    }, { rootMargin: "200px" });
    observer.observe(node);
    return () => { disposed = true; observer?.disconnect(); cleanup(); };
  }, []);
  return <div ref={mount} className="pointer-events-auto absolute inset-0 opacity-90"
    aria-hidden="true" data-webgl={available ? "ready" : "fallback"}>
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#aaaaaa]/[0.13] blur-[90px]" />
  </div>;
}
