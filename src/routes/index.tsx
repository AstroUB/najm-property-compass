import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, Minus, Search } from "lucide-react";
import hero from "@/assets/hero2.jpg";
import heroCut from "@/assets/hero2-cut.png";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import g1 from "@/assets/g1.jpg";
import g3 from "@/assets/g3.jpg";
import { BUDGETS, CITIES, GIGA_PROJECTS, PROPERTIES, TYPES, formatSAR } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SectionTitle } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { useReveal } from "@/components/site/motion";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      gsap.timeline()
        .from("[data-hero-line]", { yPercent: 110, duration: 1.2, stagger: 0.12, ease: "power4.out" })
        .from("[data-hero-photo]", { scale: 1.08, opacity: 0, duration: 1.6, ease: "power3.out", clearProps: "all" }, 0.1)
        .from("[data-hero-cut]", { y: 80, opacity: 0, duration: 1.6, ease: "power3.out", clearProps: "all" }, 0.3)
        .from("[data-hero-search]", { y: 30, opacity: 0, duration: 1, ease: "power3.out", clearProps: "all" }, 0.9);
    })();
  }, []);

  const sel = "w-full appearance-none bg-transparent text-base font-medium text-foreground outline-none cursor-pointer";

  return (
    <section className="px-3 pt-24 md:px-4">
      <div ref={stageRef} className="relative mx-auto aspect-[4/5] w-full max-w-[1440px] sm:aspect-[5/4] sm:max-w-[min(1440px,calc((100svh-6.5rem)*1.25))]">
        <h1 className="absolute inset-x-0 top-[1%] z-10 text-center font-medium uppercase leading-[0.86] tracking-[-0.04em]" style={{ fontSize: "clamp(2.8rem, min(8vw, 11svh), 9rem)" }}>
          <span className="block overflow-hidden"><span data-hero-line className="block">Homes written</span></span>
          <span className="block overflow-hidden"><span data-hero-line className="block">in the <span className="fancy normal-case">S</span>tars</span></span>
        </h1>
        <div data-hero-photo className="absolute inset-x-0 bottom-0 top-[40%] overflow-hidden rounded-[2rem]">
          <img src={hero} alt="Najm Estate signature villa at blue hour" width={1920} height={1280} className="absolute inset-x-0 bottom-0 h-[138.4%] w-full object-cover" />
        </div>
        <img data-hero-cut src={heroCut} alt="" aria-hidden width={1920} height={1280} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[83%] w-full object-cover" />


        <form
          data-hero-search
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/properties", search: { city: loc || undefined, type: type || undefined, budget: budget || undefined } });
          }}
          className="absolute inset-x-3 bottom-3 z-50 mx-auto grid max-w-5xl gap-2 md:bottom-8 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          {[
            { label: "Location", value: loc, set: setLoc, opts: CITIES.map((c) => [c, c]), ph: "Any city" },
            { label: "Property type", value: type, set: setType, opts: TYPES.map((c) => [c, c]), ph: "Any type" },
            { label: "Budget", value: budget, set: setBudget, opts: BUDGETS.map((b) => [b.value, b.label]), ph: "Any budget" },
          ].map((f) => (
            <div key={f.label} className="relative">
              <span aria-hidden className="liquidGL glass absolute inset-0 z-0 rounded-full" />
              <label className="relative z-10 flex cursor-pointer flex-col rounded-full px-6 py-3">
                <span className="text-xs text-foreground/70">{f.label}</span>
                <select value={f.value} onChange={(e) => f.set(e.target.value)} className={sel} aria-label={f.label}>
                  <option value="">{f.ph}</option>
                  {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
            </div>
          ))}
          <button className="relative z-50 flex items-center justify-center gap-2 rounded-full bg-ink px-9 py-4 text-base text-ink-foreground transition-colors hover:bg-primary">
            <Search className="h-4 w-4" /> Search
          </button>
        </form>
      </div>
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

const ARTICLES = [
  { c: "Buyer guide", m: 6, t: "How foreigners can buy property in Saudi Arabia in 2026", img: p4 },
  { c: "Market report", m: 8, t: "Riyadh prime residential: Q3 prices and rental yields", img: g3 },
  { c: "Investment", m: 5, t: "Off-plan vs ready: which earns more in Jeddah?", img: p3 },
  { c: "Giga projects", m: 7, t: "What NEOM and the Red Sea mean for nearby land values", img: g1 },
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
  const [faq, setFaq] = useState<number | null>(0);
  const featured = PROPERTIES.filter((p) => p.featured).slice(0, 4);
  const vault = PROPERTIES.filter((p) => p.investment).slice(0, 4);

  return (
    <main>
      <Hero />

      {/* Featured */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionTitle letter="F" rest="eatured homes" eyebrow="Hand-picked this season" />
            <Link to="/properties" className="flex items-center gap-2 text-lg hover:text-primary" data-reveal>
              View all properties <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Investment Vault */}
      <section id="vault" className="scroll-mt-24 bg-cream px-6 py-20">
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
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.25rem] md:h-32 md:w-32">
                  <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1">
                  <p className="text-4xl font-medium tracking-tight text-primary">{p.investment!.yield}%</p>
                  <p className="text-sm text-muted-foreground">Est. annual yield · {p.investment!.label}</p>
                  <p className="mt-3 text-lg font-medium">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{formatSAR(p.price)} · {p.city}</p>
                </div>
                <ArrowUpRight className="mr-3 hidden h-7 w-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:block" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other properties */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle letter="M" rest="ore to explore" />
          <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {PROPERTIES.filter((p) => !p.featured).slice(0, 4).map((p) => <PropertyCard key={p.id} p={p} />)}
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
      <section id="projects" className="scroll-mt-24 bg-ink px-6 py-20 text-ink-foreground">
        <div className="mx-auto max-w-7xl">
          <div data-reveal>
            <p className="mb-5 text-lg opacity-60">Upcoming & under construction</p>
            <h2 className="display-lg"><span className="fancy">T</span>he Sovereign Giga Projects</h2>
          </div>
        </div>
        <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2))] pb-6 [scrollbar-width:none]">
          {GIGA_PROJECTS.map((g) => (
            <article key={g.name} className="group relative h-[62vh] min-h-[420px] w-[85vw] shrink-0 snap-start overflow-hidden rounded-[2.5rem] md:w-[65vw] lg:w-[46rem]">
              <img src={g.image} alt={g.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="liquidGL glass absolute z-50 bottom-5 left-5 right-5 rounded-[1.5rem] p-6 text-foreground md:right-auto md:max-w-md">
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

      {/* Knowledge Hub */}
      <section id="insights" className="scroll-mt-28 px-6 py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionTitle letter="K" rest="nowledge Hub" eyebrow="Guides, market reports and buyer insight" />
            <a href="#contact" className="flex items-center gap-2 text-lg hover:text-primary" data-reveal>
              Ask an advisor <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {ARTICLES.map((a) => (
              <a key={a.t} href="#contact" className="group block" data-reveal>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <img src={a.img} alt={a.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="glass absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">{a.c} · {a.m} min read</p>
                <p className="mt-2 text-xl font-medium leading-snug tracking-tight">{a.t}</p>
              </a>
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
