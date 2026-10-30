import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Building2, Calendar, Car, Check, Compass, Download, FileCheck2, Home, Layers, MapPin, Maximize, Sofa, Trees } from "lucide-react";
import { PROPERTIES, formatSAR, propertyDetails } from "@/data/properties";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PropertyCard } from "@/components/site/PropertyCard";
import { useLiquidGlass, useReveal } from "@/components/site/motion";

export const Route = createFileRoute("/properties/$id")({
  loader: ({ params }) => {
    const p = PROPERTIES.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — ${formatSAR(loaderData.price)} | Najm Estate` },
          { name: "description", content: loaderData.short },
          { property: "og:title", content: `${loaderData.title} | Najm Estate` },
          { property: "og:description", content: loaderData.short },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Property unavailable | Najm Estate" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <main className="px-6 pb-28 pt-44 text-center">
      <h1 className="display-lg">Property not found</h1>
      <Link to="/properties" className="mt-8 inline-block text-lg text-primary">Back to all properties</Link>
    </main>
  ),
  component: Detail,
});

function Detail() {
  const p = Route.useLoaderData();
  const d = propertyDetails(p);
  const [active, setActive] = useState(0);
  useReveal([p.id]);
  useLiquidGlass(".lg-detail", { frost: 1.5, refraction: 0.006, bevelDepth: 0.06, bevelWidth: 0.1 });

  const downloadBrochure = () => {
    const text = `NAJM ESTATE — PROPERTY BROCHURE\n\n${p.title}\n${p.district}, ${p.city}\n\nPrice: ${formatSAR(p.price)} (${formatSAR(d.pricePerM2)}/m²)\nType: ${p.type}\nBuilt-up area: ${p.area} m²\nPlot: ${d.plot} m²\nBedrooms: ${p.beds}\nBathrooms: ${p.baths}\nParking: ${d.parking}\nStatus: ${p.status}\nCompletion: ${p.year}\nDeveloper: ${d.developer}\n\n${p.description}\n\nAmenities:\n${p.amenities.map((a) => "• " + a).join("\n")}\n\nhello@najmestate.sa · +966 11 000 0000`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.id}-brochure.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const facts = [
    { icon: Maximize, label: "Built-up area", value: `${p.area} m²` },
    { icon: Trees, label: "Plot size", value: `${d.plot} m²` },
    { icon: BedDouble, label: "Bedrooms", value: p.beds || "—" },
    { icon: Bath, label: "Bathrooms", value: p.baths },
    { icon: Car, label: "Parking", value: d.parking },
    { icon: Layers, label: "Levels", value: d.floors },
    { icon: Home, label: "Type", value: p.type },
    { icon: Calendar, label: "Completion", value: `${p.year} · ${p.status}` },
    { icon: Sofa, label: "Furnishing", value: d.furnishing },
    { icon: Compass, label: "Facing", value: d.facing },
    { icon: Building2, label: "Developer", value: d.developer },
    { icon: FileCheck2, label: "Title deed", value: d.deed },
  ];

  const costs = [
    ["Asking price", formatSAR(p.price)],
    ["Price per m²", formatSAR(d.pricePerM2)],
    ["Real estate transaction tax (5%)", formatSAR(d.tax)],
    ["Brokerage fee (2.5%)", formatSAR(d.fee)],
    ["Est. monthly mortgage*", formatSAR(d.mortgage)],
  ];

  const go = (dir: number) => setActive((a) => (a + dir + p.images.length) % p.images.length);

  return (
    <main className="px-4 pb-28 pt-28 md:px-6">
      <div className="mx-auto max-w-[1440px]">
        <Link to="/properties" className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" /> All properties
        </Link>

        {/* Gallery with liquid glass overlay */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-cream lg:aspect-auto lg:h-[min(72svh,720px)]">
            <img key={active} src={p.images[active]} alt={p.title} className="h-full w-full object-cover animate-in fade-in duration-700" />
            <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
              <span aria-hidden className="lg-detail glass-clear pointer-events-none absolute inset-0 rounded-[1.75rem]" />
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] bg-ink/20 px-6 py-4 text-ink-foreground">
                <div>
                  <p className="flex items-center gap-2 text-sm opacity-85"><MapPin className="h-4 w-4" />{p.district}, {p.city}</p>
                  <p className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">{formatSAR(p.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-2 text-sm opacity-85">{active + 1} / {p.images.length}</span>
                  <button onClick={() => go(-1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground"><ArrowLeft className="h-5 w-5" /></button>
                  <button onClick={() => go(1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground"><ArrowRight className="h-5 w-5" /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 lg:flex-col">
            {p.images.map((img, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`aspect-square flex-1 overflow-hidden rounded-[1.5rem] transition-all lg:aspect-auto lg:flex-1 ${i === active ? "opacity-100 ring-4 ring-primary ring-offset-2 ring-offset-background" : "opacity-55 hover:opacity-100"}`}>
                <img src={img} alt={`${p.title} view ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_420px]">
          <div className="min-w-0">
            <h1 className="display-lg"><span className="fancy">{p.title.split(" ")[0]}</span> {p.title.split(" ").slice(1).join(" ")}</h1>
            <p className="mt-4 text-xl text-muted-foreground">{p.short}</p>
            {p.investment && (
              <div className="mt-8 flex flex-wrap items-center gap-6 rounded-[2rem] bg-primary p-6 text-primary-foreground md:p-8">
                <p className="display-md">{p.investment.yield}%</p>
                <div>
                  <p className="text-lg">Estimated annual rental yield</p>
                  <p className="opacity-75">{p.investment.label}</p>
                </div>
              </div>
            )}

            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="rounded-[1.5rem] bg-primary/[0.06] p-5" data-reveal>
                  <f.icon className="h-6 w-6 text-primary" />
                  <p className="mt-5 text-lg font-medium">{f.value}</p>
                  <p className="text-sm text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>

            <Block title="About" rest=" this home">
              <p className="text-lg leading-relaxed text-muted-foreground">{p.description}</p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Built by {d.developer} and completed to {p.status === "Ready" ? "move-in condition" : `handover in ${p.year}`}, the home faces {d.facing.toLowerCase()} for balanced daylight through the day. It comes {d.furnishing.toLowerCase()}, with {d.parking} covered parking spaces and a verified title deed ({d.deed}).
              </p>
            </Block>

            <Block title="Space" rest=" & layout">
              <div className="overflow-hidden rounded-[2rem] bg-primary/[0.06]">
                {d.rooms.map(([r, v], i) => (
                  <div key={r} className={`flex items-center justify-between px-6 py-4 text-lg ${i % 2 ? "bg-background/60" : ""}`}>
                    <span>{r}</span><span className="font-medium text-primary">{v}</span>
                  </div>
                ))}
              </div>
            </Block>

            <Block title="Amenities">
              <ul className="grid gap-3 sm:grid-cols-2">
                {p.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 rounded-2xl bg-cream px-5 py-4 text-lg"><Check className="h-5 w-5 text-primary" />{a}</li>
                ))}
              </ul>
            </Block>

            <Block title="Costs" rest=" & payment">
              <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
                <div className="rounded-[2rem] bg-cream p-6">
                  {costs.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 py-3 text-base md:text-lg">
                      <span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span>
                    </div>
                  ))}
                  <p className="mt-2 text-sm text-muted-foreground">*80% financing over 25 years at 5.5%. Indicative only.</p>
                </div>
                <div className="rounded-[2rem] bg-primary p-6 text-primary-foreground">
                  <p className="text-lg opacity-80">{p.status === "Off-plan" ? "Developer payment plan" : "Typical purchase structure"}</p>
                  <div className="mt-4 space-y-3">
                    {d.plan.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 px-5 py-4">
                        <span>{k}</span><span className="text-2xl font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Block>

            <Block title="Location">
              <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
                <div className="relative h-[380px] overflow-hidden rounded-[2rem] bg-cream">
                  <iframe
                    title={`Map of ${p.district}, ${p.city}`}
                    src={`https://maps.google.com/maps?q=${d.lat},${d.lng}&z=14&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full grayscale-[35%]"
                  />
                </div>
                <div className="rounded-[2rem] bg-primary/[0.06] p-6">
                  <p className="flex items-center gap-2 text-lg font-medium"><MapPin className="h-5 w-5 text-primary" />{p.district}, {p.city}</p>
                  <ul className="mt-4">
                    {d.nearby.map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between py-2.5 text-base">
                        <span className="text-muted-foreground">{k}</span><span className="font-medium text-primary">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Block>

            <button onClick={downloadBrochure} className="mt-14 flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-lg text-primary-foreground transition-colors hover:bg-ink">
              <Download className="h-5 w-5" /> Download brochure
            </button>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[2.5rem] bg-background shadow-soft">
              <div className="bg-primary p-8 text-primary-foreground">
                <h2 className="display-md"><span className="fancy !text-primary-foreground">Enquire</span></h2>
                <p className="mt-3 text-lg opacity-80">Arrange a private viewing or request the full information pack.</p>
              </div>
              <div className="p-8">
                <EnquiryForm cta="Request viewing" defaultMessage={`I'm interested in ${p.title}.`} />
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-28">
          <h2 className="display-lg"><span className="fancy">Similar</span> homes</h2>
          <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {PROPERTIES.filter((x) => x.id !== p.id).slice(0, 3).map((x) => <PropertyCard key={x.id} p={x} />)}
          </div>
        </section>
      </div>
    </main>
  );
}

function Block({ title, rest = "", children }: { title: string; rest?: string; children: React.ReactNode }) {
  return (
    <section className="mt-16" data-reveal>
      <h2 className="display-md mb-6"><span className="fancy">{title}</span>{rest}</h2>
      {children}
    </section>
  );
}
