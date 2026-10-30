import { useEffect } from "react";

/** Fade/slide in every [data-reveal] element as it enters the viewport. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%" } },
          );
        });
      });
      ScrollTrigger.refresh();
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Load liquidGL (from CDN) and apply it to `.liquidGL` elements; CSS glass stays as fallback. */
export function useLiquidGlass() {
  useEffect(() => {
    const load = (src: string) =>
      new Promise<void>((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) return res();
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => res();
        s.onerror = rej;
        document.body.appendChild(s);
      });
    const t = setTimeout(async () => {
      try {
        await load("https://cdn.jsdelivr.net/npm/html2canvas-pro@1.6.7/dist/html2canvas-pro.min.js");
        const g = window as unknown as { html2canvas?: unknown };
        const h = g.html2canvas as { default?: unknown } | undefined;
        if (h && typeof h !== "function" && h.default) g.html2canvas = h.default;
        await load("https://cdn.jsdelivr.net/gh/naughtyduk/liquidGL/scripts/liquidGL.js");
        const w = window as unknown as { liquidGL?: (o: Record<string, unknown>) => void };
        if (!document.querySelector(".liquidGL") || !w.liquidGL) return;
        w.liquidGL({
          target: ".liquidGL",
          snapshot: "body",
          resolution: 1.5,
          refraction: 0.01,
          bevelDepth: 0.08,
          bevelWidth: 0.15,
          frost: 2,
          shadow: false,
          specular: true,
          reveal: "fade",
        });
      } catch {
        /* glass CSS fallback remains */
      }
    }, 1200);
    return () => clearTimeout(t);
  }, []);
}
