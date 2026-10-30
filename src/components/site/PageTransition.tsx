import { useEffect, useRef, useState } from "react";
import { useBlocker, useRouter } from "@tanstack/react-router";

/** Resolves when the first-visit loader has lifted, so page intros can wait for it. */
let resolveIntro: () => void = () => {};
export const introDone: Promise<void> =
  typeof window === "undefined" ? Promise.resolve() : new Promise<void>((r) => (resolveIntro = r));

const LABELS: Record<string, string> = {
  "/": "Home", "/properties": "Properties", "/about": "About", "/knowledge": "Knowledge", "/contact": "Contact", "/admin": "Admin",
};
const labelFor = (path: string) => {
  const clean = path.replace(/\/$/, "") || "/";
  if (LABELS[clean]) return LABELS[clean]!;
  if (clean.startsWith("/properties/")) return "Residence";
  if (clean.startsWith("/admin")) return "Admin";
  return "Najm";
};
const STRIPES = ["bg-background", "bg-primary", "bg-background", "bg-primary"];

/** Minimal shape of a gsap timeline we keep a handle on (heartbeat animation). */
type BeatTimeline = { kill: () => void; to: (...args: unknown[]) => BeatTimeline };

/** Four stripes rise from the bottom to cover the page, then lift away upward one by one. */
export function PageTransition() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("Najm");
  const [count, setCount] = useState(0);
  const [intro, setIntro] = useState(true);
  const busy = useRef(false);
  const beat = useRef<BeatTimeline | null>(null);

  const stripes = () => Array.from(root.current?.querySelectorAll<HTMLElement>("[data-stripe]") ?? []);
  const text = () => root.current?.querySelector<HTMLElement>("[data-label]");

  // Initial loader: page starts covered, counter runs, then stripes lift.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      const ready = new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));
      const c = { v: 0 };
      await Promise.all([
        new Promise<void>((r) => gsap.to(c, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => setCount(Math.round(c.v)), onComplete: r })),
        Promise.race([ready, new Promise((r) => setTimeout(r, 4000))]),
      ]);
      if (cancelled) return;
      await new Promise<void>((r) => gsap.timeline({ onComplete: r })
        .to(text()!, { yPercent: -120, opacity: 0, duration: 0.5, ease: "power3.in" })
        .to(stripes(), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.8, stagger: 0.09, ease: "power4.inOut" }, "-=0.15"));
      setIntro(false);
      root.current!.style.visibility = "hidden";
      resolveIntro();
    })();
    return () => { cancelled = true; resolveIntro(); };
  }, []);

  // Route change: cover before navigating, reveal once the new page has rendered.
  useBlocker({
    withResolver: false,
    shouldBlockFn: async ({ current, next }) => {
      if (busy.current || current.pathname === next.pathname) return false;
      if (current.pathname.startsWith("/admin") && next.pathname.startsWith("/admin")) return false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      busy.current = true;
      setLabel(labelFor(next.pathname));
      const { gsap } = await import("gsap");
      const el = root.current!;
      el.style.visibility = "visible";
      gsap.set(stripes(), { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(text()!, { yPercent: 120, opacity: 0 });
      await new Promise<void>((r) => gsap.timeline({ onComplete: r })
        .to(stripes(), { scaleY: 1, duration: 0.6, stagger: 0.07, ease: "power4.inOut" })
        .to(text()!, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, "-=0.25"));
      // If the next page is slow, all stripes + label pulse together like a heartbeat until it resolves.
      if (busy.current) {
        gsap.set(stripes(), { transformOrigin: "50% 50%" });
        beat.current = gsap.timeline({ repeat: -1, repeatDelay: 0.35 });
        stripes().forEach((s) => {
          beat.current!
            .to(s, { opacity: 0, duration: 0.15, ease: "power2.out" })
            .to(s, { opacity: 0.9, duration: 0.2, ease: "power2.in" });
        });
      }
      return false;
    },
  });

  useEffect(() => router.subscribe("onResolved", async () => {
    if (!busy.current) return;
    window.scrollTo(0, 0);
    const { gsap } = await import("gsap");
    beat.current?.kill(); beat.current = null;
    gsap.set([...stripes(), text()!], { opacity: 1 });
    await new Promise((r) => setTimeout(r, 120));
    gsap.timeline({ onComplete: () => { busy.current = false; if (root.current) root.current.style.visibility = "hidden"; } })
      .to(text()!, { yPercent: -120, opacity: 0, duration: 0.4, ease: "power3.in" })
      .to(stripes(), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.7, stagger: 0.08, ease: "power4.inOut" }, "-=0.1");
  }), [router]);

  return (
    <div ref={root} aria-hidden data-html2canvas-ignore="true" data-liquid-ignore className="pointer-events-none fixed inset-0 z-[100] grid grid-cols-4">
      {STRIPES.map((c, i) => <div key={i} data-stripe className={`${c} h-full w-full origin-bottom`} />)}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden text-ink">
        <div data-label className="text-center">
          <p className="fancy !text-ink text-[clamp(4rem,12vw,10rem)]">{intro ? "Najm" : label}</p>
          {intro && <p className="mt-4 text-lg tabular-nums tracking-[0.3em] opacity-70">{String(count).padStart(3, "0")}</p>}
        </div>
      </div>
    </div>
  );
}
