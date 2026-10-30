import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function SmoothScroll() {
  useEffect(() => {
    let lenis: import("lenis").default | undefined;
    let tick: ((t: number) => void) | undefined;
    let gsapRef: typeof import("gsap").gsap | undefined;
    (async () => {
      const Lenis = (await import("lenis")).default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef = gsap;
      const l = new Lenis({ duration: 1.2, smoothWheel: true });
      lenis = l;
      l.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    })();
    return () => {
      if (tick && gsapRef) gsapRef.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return null;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-3 pl-7 pr-3">
        <Link to="/" className="flex items-baseline gap-1 text-2xl font-medium tracking-tight">
          <span className="fancy text-4xl">N</span>ajm Estate
        </Link>
        <div className="hidden items-center gap-10 text-base md:flex">
          <Link to="/" className="hover:text-primary" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/properties" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Properties</Link>
          <a href="/#contact" className="hover:text-primary">Contact</a>
        </div>
        <a href="/#contact" className="hidden items-center gap-2 rounded-full bg-ink px-6 py-3 text-base text-ink-foreground transition-colors hover:bg-primary md:flex">
          Book a viewing <ArrowUpRight className="h-4 w-4" />
        </a>
        <button className="rounded-full bg-ink p-3 text-ink-foreground md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="glass mx-auto mt-3 flex max-w-6xl flex-col gap-4 rounded-[2rem] p-6 text-2xl md:hidden">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/properties" onClick={() => setOpen(false)}>Properties</Link>
          <a href="/#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink px-6 pb-10 pt-24 text-ink-foreground">
      <div className="mx-auto max-w-7xl">
        <p className="display-xl">
          <span className="fancy">N</span>ajm Estate
        </p>
        <div className="mt-20 grid gap-12 text-lg md:grid-cols-4">
          <div>
            <p className="opacity-50">Head office</p>
            <p className="mt-3">King Fahd Road, Al Olaya<br />Riyadh 12214, Saudi Arabia</p>
          </div>
          <div>
            <p className="opacity-50">Contact</p>
            <p className="mt-3">+966 11 000 0000<br />hello@najmestate.sa</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="opacity-50">Explore</p>
            <Link to="/" className="mt-1 hover:opacity-70">Home</Link>
            <Link to="/properties" className="hover:opacity-70">Properties</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="opacity-50">Follow</p>
            <a href="#" className="mt-1 hover:opacity-70">Instagram</a>
            <a href="#" className="hover:opacity-70">LinkedIn</a>
            <a href="#" className="hover:opacity-70">X</a>
          </div>
        </div>
        <p className="mt-20 text-base opacity-50">© 2026 Najm Estate. Licensed by REGA. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function SectionTitle({ letter, rest, eyebrow, className = "" }: { letter: string; rest: string; eyebrow?: string; className?: string }) {
  return (
    <div className={className} data-reveal>
      {eyebrow && <p className="mb-5 text-lg text-muted-foreground">{eyebrow}</p>}
      <h2 className="display-lg">
        <span className="fancy">{letter}</span>{rest}
      </h2>
    </div>
  );
}
