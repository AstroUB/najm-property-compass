import { useEffect, useRef } from "react";
import { ArrowUpRight, BadgeCheck, Building2, Handshake, Landmark, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { GIGA_PROJECTS } from "@/data/properties";
import { useLiquidGlass } from "./motion";

/** Giga projects: full-image cards with a lightly frosted liquidGL details panel; scroll drives horizontal movement on desktop. */
export function GigaProjects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useLiquidGlass(".lg-giga", { frost: 1.5, refraction: 0.006, bevelDepth: 0.06, bevelWidth: 0.1 });

  useEffect(() => {
    let mm: { revert: () => void } | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      mm = gsap.matchMedia();
      (mm as unknown as { add: (q: string, fn: () => void) => void }).add("(min-width: 1024px)", () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
      });
    })();
    return () => mm?.revert();
  }, []);

  return (
    <section ref={section} id="projects" className="scroll-mt-0 overflow-hidden bg-ink py-16 text-ink-foreground lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <p className="mb-4 text-lg opacity-60">Upcoming & under construction</p>
        <h2 className="display-lg">The <span className="fancy">Sovereign</span> Giga Projects</h2>
      </div>
      <div ref={track} className="mt-10 flex gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:w-max lg:overflow-visible lg:px-[max(1.5rem,calc((100vw-1440px)/2+1.5rem))]">
        {GIGA_PROJECTS.map((g, i) => (
          <article key={g.name} className="group relative h-[70svh] min-h-[460px] w-[86vw] shrink-0 overflow-hidden rounded-[2.5rem] lg:h-[64svh] lg:w-[min(64rem,72vw)]">
            <img src={g.image} alt={g.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
            <p className="absolute left-8 top-6 text-7xl font-medium tracking-tighter text-ink-foreground/80 md:text-8xl">0{i + 1}</p>
            <div className="absolute inset-x-3 bottom-3 md:inset-x-5 md:bottom-5">
              <span aria-hidden className="lg-giga glass-clear pointer-events-none absolute inset-0 rounded-[2rem]" />
              <div className="relative z-10 grid gap-6 rounded-[2rem] bg-ink/25 p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
                <div>
                  <p className="text-sm opacity-80">{g.status} · {g.region}</p>
                  <h3 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{g.name}</h3>
                  <p className="mt-3 max-w-xl text-base opacity-85">{g.text}</p>
                </div>
                <div className="flex flex-col justify-between gap-5">
                  <dl className="grid grid-cols-2 gap-4">
                    <div><dt className="text-sm opacity-70">Est. deadline</dt><dd className="mt-1 text-lg font-medium">{g.deadline}</dd></div>
                    <div><dt className="text-sm opacity-70">Budget</dt><dd className="mt-1 text-lg font-medium">{g.budget}</dd></div>
                  </dl>
                  <a href="#contact" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base text-primary-foreground transition-colors hover:bg-background hover:text-foreground">
                    Register interest <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const STATS = [
  { n: "18+", t: "Years of local expertise" },
  { n: "SAR 6B", t: "In property transacted" },
  { n: "2,400+", t: "Families and investors housed" },
  { n: "4.9/5", t: "Average client rating" },
];

const PILLARS = [
  { icon: BadgeCheck, t: "100% verified listings", d: "Every title deed, building permit and developer licence is checked against Ejar and REGA records before a home reaches you." },
  { icon: Landmark, t: "Off-market access", d: "Around a third of our sales never appear online — private releases from developers and families who trust our discretion." },
  { icon: LineChart, t: "Investment intelligence", d: "Yield forecasts, rental comparables and Vision 2030 pipeline data for every property, so decisions rest on numbers." },
  { icon: Handshake, t: "Financing made simple", d: "Sharia-compliant mortgages arranged with leading Saudi banks, including options for eligible non-residents." },
  { icon: ShieldCheck, t: "Legal & handover", d: "REGA-compliant contracts, escrow-protected payments, snagging inspections and utility setup — all handled." },
  { icon: Building2, t: "After-sale care", d: "Property management, leasing and resale support, so your home keeps performing long after the keys change hands." },
];

/** Why Najm: headline stats, six service pillars and a client quote. */
export function WhyNajm() {
  return (
    <section className="bg-primary px-6 py-24 text-primary-foreground">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 className="display-lg" data-reveal><span className="fancy !text-primary-foreground">Why</span> Najm?</h2>
          <p className="text-xl opacity-80" data-reveal>
            We are a Riyadh-born advisory built for one thing: helping families and investors own the right Saudi address with total confidence — from first viewing to long after handover.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.t} data-reveal>
              <p className="display-lg">{s.n}</p>
              <p className="mt-3 text-lg opacity-75">{s.t}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.t} className="rounded-[2rem] bg-primary-foreground/10 p-8 transition-colors hover:bg-primary-foreground/15" data-reveal>
              <p.icon className="h-8 w-8" />
              <h3 className="mt-10 text-2xl font-medium tracking-tight">{p.t}</h3>
              <p className="mt-3 text-base opacity-75">{p.d}</p>
            </div>
          ))}
        </div>

        <figure className="mt-20 grid gap-8 rounded-[2.5rem] bg-background p-10 text-foreground md:grid-cols-[auto_1fr] md:p-14" data-reveal>
          <Sparkles className="h-10 w-10 text-primary" />
          <div>
            <blockquote className="display-md">
              “Najm found us a villa in Al Malqa that was never listed online, negotiated SAR 600,000 off the asking price and handled every document. We moved in within eight weeks.”
            </blockquote>
            <figcaption className="mt-6 text-lg text-muted-foreground">Faisal & Noura Al-Harbi — homeowners, Riyadh</figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
