import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bath, BedDouble, Calendar, Check, Download, Home, Maximize, MapPin } from "lucide-react";
import { PROPERTIES, formatSAR } from "@/data/properties";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PropertyCard } from "@/components/site/PropertyCard";
import { useReveal } from "@/components/site/motion";

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
  const [active, setActive] = useState(0);
  useReveal([p.id]);

  const downloadBrochure = () => {
    const text = `NAJM ESTATE — PROPERTY BROCHURE\n\n${p.title}\n${p.district}, ${p.city}\n\nPrice: ${formatSAR(p.price)}\nType: ${p.type}\nArea: ${p.area} m²\nBedrooms: ${p.beds}\nBathrooms: ${p.baths}\nStatus: ${p.status}\nCompletion: ${p.year}\n\n${p.description}\n\nAmenities:\n${p.amenities.map((a) => "• " + a).join("\n")}\n\nhello@najmestate.sa · +966 11 000 0000`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.id}-brochure.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const facts = [
    { icon: Maximize, label: "Area", value: `${p.area} m²` },
    { icon: BedDouble, label: "Bedrooms", value: p.beds || "—" },
    { icon: Bath, label: "Bathrooms", value: p.baths },
    { icon: Home, label: "Type", value: p.type },
    { icon: Calendar, label: "Completion", value: p.year },
    { icon: Check, label: "Status", value: p.status },
  ];

  return (
    <main className="px-6 pb-28 pt-32">
      <div className="mx-auto max-w-7xl">
        <Link to="/properties" className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" /> All properties
        </Link>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_200px]">
          <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-cream">
            <img key={active} src={p.images[active]} alt={p.title} className="h-full w-full object-cover animate-in fade-in duration-700" />
          </div>
          <div className="flex gap-4 lg:flex-col">
            {p.images.map((img, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`aspect-square flex-1 overflow-hidden rounded-[1.5rem] transition-opacity lg:flex-none ${i === active ? "opacity-100" : "opacity-50 hover:opacity-100"}`}>
                <img src={img} alt={`${p.title} view ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="flex items-center gap-2 text-lg text-muted-foreground"><MapPin className="h-5 w-5 text-primary" />{p.district}, {p.city}</p>
            <h1 className="display-lg mt-4"><span className="fancy">{p.title.split(" ")[0]}</span> {p.title.split(" ").slice(1).join(" ")}</h1>
            <p className="mt-6 text-3xl font-medium tracking-tight text-primary md:text-4xl">{formatSAR(p.price)}</p>
            {p.investment && (
              <p className="mt-3 text-lg text-muted-foreground">Est. annual yield {p.investment.yield}% · {p.investment.label}</p>
            )}

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="rounded-[1.75rem] bg-cream p-6" data-reveal>
                  <f.icon className="h-7 w-7 text-primary" />
                  <p className="mt-6 text-xl font-medium">{f.value}</p>
                  <p className="text-base text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>

            <h2 className="display-md mt-16">About this home</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{p.description}</p>

            <h2 className="display-md mt-16">Amenities</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {p.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 text-lg"><Check className="h-5 w-5 text-primary" />{a}</li>
              ))}
            </ul>

            <button onClick={downloadBrochure} className="mt-14 flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-lg text-ink-foreground transition-colors hover:bg-primary">
              <Download className="h-5 w-5" /> Download brochure
            </button>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2.5rem] bg-background p-8 shadow-soft">
              <h2 className="display-md"><span className="fancy">Enquire</span></h2>
              <p className="mb-8 mt-3 text-lg text-muted-foreground">Arrange a private viewing or request more details.</p>
              <EnquiryForm cta="Request viewing" defaultMessage={`I'm interested in ${p.title}.`} />
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
