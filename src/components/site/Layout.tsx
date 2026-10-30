import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { toast } from "sonner";

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
      (window as unknown as { __lenis?: unknown }).__lenis = l;
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const link = "rounded-full px-4 py-2 text-sm transition-colors hover:bg-background/60";
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className={`relative mx-auto flex max-w-[1440px] items-center justify-between rounded-full py-2 pl-6 pr-2 transition-colors duration-500 ${scrolled ? "bg-background/45" : "bg-background/70"}`}>
        <span aria-hidden className="lg-nav glass pointer-events-none absolute inset-0 rounded-full" />
        <Link to="/" className="relative z-10 flex items-baseline text-lg font-medium tracking-tight">
          <span className="fancy text-2xl">Najm</span>&nbsp;Estate
        </Link>
        <div className="relative z-10 hidden items-center gap-1 md:flex">
          <Link to="/" className={link} activeOptions={{ exact: true }} activeProps={{ className: "bg-background/70" }}>Home</Link>
          <Link to="/properties" className={link} activeProps={{ className: "bg-background/70" }}>Properties</Link>
          <a href="/#vault" className={link}>Invest</a>
          <a href="/#projects" className={link}>Giga Projects</a>
          <a href="/#insights" className={link}>Knowledge Hub</a>
          <a href="/#contact" className={link}>Contact</a>
        </div>
        <a href="/#contact" className="relative z-10 hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ink-foreground transition-colors hover:bg-primary md:flex">
          Book a viewing <ArrowUpRight className="h-4 w-4" />
        </a>
        <button className="relative z-10 rounded-full bg-ink p-2.5 text-ink-foreground md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="glass mx-auto mt-2 flex max-w-6xl flex-col gap-3 rounded-[1.5rem] p-6 text-lg md:hidden">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/properties" onClick={() => setOpen(false)}>Properties</Link>
          <a href="/#vault" onClick={() => setOpen(false)}>Invest</a>
          <a href="/#insights" onClick={() => setOpen(false)}>Knowledge Hub</a>
          <a href="/#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="px-3 pb-3">
      <div className="overflow-hidden rounded-[2rem] bg-ink px-6 pt-16 text-ink-foreground md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="display-lg max-w-xl">Find the address that <span className="fancy !text-ink-foreground">defines</span> you.</h2>
              <form
                className="mt-8 flex max-w-md items-center gap-2 rounded-full bg-ink-foreground/10 p-1.5"
                onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); toast.success("Subscribed — welcome to Najm."); }}
              >
                <input type="email" required placeholder="Your email for private listings" className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-ink-foreground/50" />
                <button className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-ink-foreground hover:text-ink">Subscribe</button>
              </form>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
              <div className="flex flex-col gap-3">
                <p className="text-ink-foreground/50">Explore</p>
                <Link to="/" className="hover:text-ink-foreground/70">Home</Link>
                <Link to="/properties" className="hover:text-ink-foreground/70">Properties</Link>
                <a href="/#vault" className="hover:text-ink-foreground/70">Investment Vault</a>
                <a href="/#projects" className="hover:text-ink-foreground/70">Giga Projects</a>
                <a href="/#insights" className="hover:text-ink-foreground/70">Knowledge Hub</a>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-ink-foreground/50">Cities</p>
                {["Riyadh", "Jeddah", "Dammam", "AlUla"].map((c) => (
                  <Link key={c} to="/properties" search={{ city: c }} className="hover:text-ink-foreground/70">{c}</Link>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-ink-foreground/50">Contact</p>
                <a href="tel:+966110000000" className="hover:text-ink-foreground/70">+966 11 000 0000</a>
                <a href="mailto:hello@najmestate.sa" className="hover:text-ink-foreground/70">hello@najmestate.sa</a>
                <p className="text-ink-foreground/70">King Fahd Rd, Riyadh</p>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-ink-foreground/50">
            <p>© 2026 Najm Estate · Licensed by REGA</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-ink-foreground">Instagram</a>
              <a href="#" className="hover:text-ink-foreground">LinkedIn</a>
              <a href="#" className="hover:text-ink-foreground">X</a>
            </div>
          </div>
        </div>
        <p className="pointer-events-none -mb-[0.22em] select-none text-center font-medium leading-none tracking-[-0.05em] text-ink-foreground/10" style={{ fontSize: "clamp(5rem, 19vw, 18rem)" }}>
          <span className="fancy !text-primary">Najm</span>
        </p>
      </div>
    </footer>
  );
}

export function SectionTitle({ word, rest, eyebrow, className = "" }: { word: string; rest: string; eyebrow?: string; className?: string }) {
  return (
    <div className={className} data-reveal>
      {eyebrow && <p className="mb-3 text-sm text-muted-foreground">{eyebrow}</p>}
      <h2 className="display-lg">
        <span className="fancy">{word}</span>{rest}
      </h2>
    </div>
  );
}
