import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, Minus, Search } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { BUDGETS, CITIES, GIGA_PROJECTS, PROPERTIES, TYPES, formatSAR } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SectionTitle } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { useLiquidGlass, useReveal } from "@/components/site/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Najm Estate — Premium Villas & Investment Property in Saudi Arabia" },
      { name: "description", content: "Discover signature villas, penthouses and investment-ready properties in Riyadh, Jeddah and beyond with Najm Estate." },
      { property: "og:title", content: "Najm Estate — Premium Property in Saudi Arabia" },
      { property: "og:description", content: "Signature villas, penthouses and investment-ready properties across the Kingdom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Hero() {
  const navigate = useNavigate();
  const imgRef = useRef<HTMLDivElement>(null);
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const tl = gsap.timeline();
      tl.from("[data-hero-line]", { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.12, ease: "power4.out" })
        .from(imgRef.current, { y: 120, rotateX: 25, opacity: 0, scale: 0.9, duration: 1.6, ease: "power3.out" }, 0.2)
        .from("[data-hero-search]", { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.8);
      const onMove = (e: MouseEvent) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        gsap.to(imgRef.current, { rotateY: x * 14, rotateX: -y * 10, x: x * 30, duration: 1.2, ease: "power3.out" });
      };
      window.addEventListener("mousemove", onMove);
      cleanup = () => window.removeEventListener("mousemove", onMove);
    })();
    return () => cleanup();
  }, []);

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-36">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="display-xl">
          <span className="block overflow-hidden"><span data-hero-line className="block">Homes written</span></span>
          <span className="block overflow-hidden"><span data-hero-line className="block">in the <span className="fancy">s</span>tars</span></span>
        </h1>
        <p data-hero-line className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
          Curated residences and investment property across the Kingdom of Saudi Arabia.
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-6xl" style={{ perspective: "1400px" }}>
        <div ref={imgRef} style={{ transformStyle: "preserve-3d" }}>
          <img src={hero} alt="Najm Estate signature villa" width={1600} height={1008} className="mx-auto w-full max-w-5xl" />
        </div>
      </div>
      <form
        data-hero-search
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/properties", search: { city: loc || undefined, type: type || undefined, budget: budget || undefined } });
        }}
        className="liquidGL glass relative z-10 mx-auto -mt-16 grid max-w-5xl gap-3 rounded-[2.5rem] p-3 md:-mt-28 md:grid-cols-[1fr_1fr_1fr_auto] md:rounded-full"
      >
        <select value={loc} onChange={(e) => setLoc(e.target.value)} className="field bg-background" aria-label="Location">
          <option value="">Any location</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="field bg-background" aria-label="Property type">
          <option value="">Any property type</option>
          {TYPES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={budget} onChange={(e) => setBudget(e.target.value)} className="field bg-background" aria-label="Budget">
          <option value="">Any budget</option>
          {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
        <button className="flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-lg text-ink-foreground transition-colors hover:bg-primary">
          <Search className="h-5 w-5" /> Search
        </button>
      </form>
    </section>
  );
}

const STEPS = [
  { t: "Discover", d: "A private consultation to understand your lifestyle, goals and budget." },
  { t: "Curate", d: "A hand-picked shortlist of verified properties, including off-market homes." },
  { t: "Visit", d: "Chauffeured private viewings — or immersive virtual tours from anywhere." },
  { t: "Own", d: "Negotiation, REGA-compliant contracts, financing and handover, all managed." },
];

const WHY = [
  { n: "18+", t: "Years of local expertise", d: "Deep relationships with the Kingdom's leading developers." },
  { n: "SAR 6B", t: "In property transacted", d: "Trusted by families, funds and global investors." },
  { n: "100%", t: "Verified listings", d: "Every title and permit checked before it reaches you." },
  { n: "24h", t: "Response promise", d: "A dedicated advisor, available whenever you need them." },
];

const FAQ = [
  { q: "Can foreigners buy property in Saudi Arabia?", a: "Yes. Under the updated real estate ownership law, non-Saudis can own property in designated zones. Our advisors guide you through every eligibility requirement." },
  { q: "Do you help with mortgage financing?", a: "We work with leading Saudi banks to secure competitive, Sharia-compliant financing for residents and eligible non-residents." },
  { q: "What returns can investment properties offer?", a: "Our Investment Vault properties typically yield between 6% and 9% annually, depending on location and property type." },
  { q: "Can I buy off-plan?", a: "Yes — we offer early access to off-plan releases from trusted developers, with escrow-protected payment plans." },
  { q: "Are there any hidden fees?", a: "No. We share a full cost breakdown upfront, including the 5% real estate transaction tax where applicable." },
];

function Home() {
  useReveal();
  useLiquidGlass();
  const [faq, setFaq] = useState<number | null>(0);
  const featured = PROPERTIES.filter((p) => p.featured).slice(0, 6);
  const vault = PROPERTIES.filter((p) => p.investment).slice(0, 4);

  return (
    <main>
      <Hero />

      {/* Featured */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionTitle letter="F" rest="eatured homes" eyebrow="Hand-picked this season" />
            <Link to="/properties" className="flex items-center gap-2 text-lg hover:text-primary" data-reveal>
              View all properties <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Investment Vault */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <SectionTitle letter="I" rest="nvestment Vault" eyebrow="Income-ready properties" />
            <p className="text-lg text-muted-foreground" data-reveal>
              Tenanted, fully furnished or in high-growth zones — properties selected for strong, dependable returns from day one.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {vault.map((p) => (
              <Link key={p.id} to="/properties/$id" params={{ id: p.id }} data-reveal
                className="group flex items-center gap-6 rounded-[2rem] bg-background p-4 transition-shadow hover:shadow-soft">
                <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-[1.5rem] md:h-44 md:w-44">
                  <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1">
                  <p className="text-4xl font-medium tracking-tight text-primary">{p.investment!.yield}%</p>
                  <p className="text-base text-muted-foreground">Est. annual yield · {p.investment!.label}</p>
                  <p className="mt-3 text-lg font-medium">{p.title}</p>
                  <p className="text-base text-muted-foreground">{formatSAR(p.price)} · {p.city}</p>
                </div>
                <ArrowUpRight className="mr-3 hidden h-7 w-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:block" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other properties */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle letter="M" rest="ore to explore" />
          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {PROPERTIES.filter((p) => !p.featured).slice(0, 3).map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Info statement */}
      <section className="px-6 py-20">
        <p className="display-md mx-auto max-w-5xl text-center" data-reveal>
          Vision 2030 is reshaping the Kingdom. We place you at the heart of it — with homes and investments in the{" "}
          <span className="text-primary">fastest-growing real estate market</span> in the region.
        </p>
      </section>

      {/* Giga projects */}
      <section className="bg-ink px-6 py-20 text-ink-foreground">
        <div className="mx-auto max-w-7xl">
          <div data-reveal>
            <p className="mb-5 text-lg opacity-60">Upcoming & under construction</p>
            <h2 className="display-lg"><span className="fancy">T</span>he Sovereign Giga Projects</h2>
          </div>
        </div>
        <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2))] pb-6 [scrollbar-width:none]">
          {GIGA_PROJECTS.map((g) => (
            <article key={g.name} className="group relative h-[70vh] min-h-[480px] w-[85vw] shrink-0 snap-start overflow-hidden rounded-[2.5rem] md:w-[65vw] lg:w-[54rem]">
              <img src={g.image} alt={g.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="liquidGL glass absolute bottom-6 left-6 right-6 rounded-[2rem] p-8 text-foreground md:right-auto md:max-w-lg">
                <p className="text-lg text-primary">{g.status} · {g.region}</p>
                <h3 className="display-md mt-2">{g.name}</h3>
                <p className="mt-3 text-lg text-muted-foreground">{g.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle letter="H" rest="ow we work" eyebrow="Four steps to the keys" />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="rounded-[2rem] bg-cream p-8" data-reveal>
                <p className="fancy text-5xl">{i + 1}</p>
                <h3 className="mt-10 text-2xl font-medium tracking-tight">{s.t}</h3>
                <p className="mt-3 text-lg text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-primary px-6 py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl">
          <h2 className="display-lg" data-reveal>
            <span className="fancy !text-primary-foreground">W</span>hy Najm?
          </h2>
          <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.t} data-reveal>
                <p className="display-lg">{w.n}</p>
                <p className="mt-4 text-xl">{w.t}</p>
                <p className="mt-2 text-lg opacity-70">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + Contact */}
      <section id="contact" className="scroll-mt-28 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <SectionTitle letter="Q" rest="uestions" />
            <div className="mt-12 flex flex-col gap-3">
              {FAQ.map((f, i) => (
                <div key={f.q} className="rounded-[1.75rem] bg-cream" data-reveal>
                  <button className="flex w-full items-center justify-between gap-6 p-6 text-left text-lg font-medium" onClick={() => setFaq(faq === i ? null : i)}>
                    {f.q}
                    {faq === i ? <Minus className="h-6 w-6 shrink-0 text-primary" /> : <Plus className="h-6 w-6 shrink-0 text-primary" />}
                  </button>
                  {faq === i && <p className="px-6 pb-6 text-lg text-muted-foreground">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-background p-2 lg:pt-0" data-reveal>
            <h2 className="display-lg"><span className="fancy">T</span>alk to us</h2>
            <p className="mb-10 mt-5 text-lg text-muted-foreground">Tell us what you're looking for — a private advisor will be in touch within 24 hours.</p>
            <EnquiryForm cta="Send message" />
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="px-6 pb-28">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 overflow-hidden rounded-[2.5rem] bg-cream p-10 md:flex-row md:items-center md:p-16" data-reveal>
          <h2 className="display-lg max-w-3xl">Your <span className="fancy">n</span>ext address is waiting.</h2>
          <Link to="/properties" className="flex shrink-0 items-center gap-3 rounded-full bg-ink px-8 py-4 text-lg text-ink-foreground transition-colors hover:bg-primary">
            Browse properties <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
