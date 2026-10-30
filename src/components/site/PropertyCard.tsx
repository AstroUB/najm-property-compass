import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bath, BedDouble, Maximize } from "lucide-react";
import { formatSAR, type Property } from "@/data/properties";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link to="/properties/$id" params={{ id: p.id }} className="group block" data-reveal>
      <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] bg-secondary">
        <img
          src={p.images[0]}
          alt={p.title}
          loading="lazy"
          width={1024}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute bottom-4 right-4 flex h-14 w-14 translate-y-4 scale-75 items-center justify-center rounded-full bg-ink text-ink-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="h-6 w-6" />
        </span>
      </div>
      <div className="px-2 pt-6">
        <p className="text-2xl font-medium tracking-tight text-primary">{formatSAR(p.price)}</p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight">{p.title}</h3>
        <p className="mt-1 text-base text-muted-foreground">{p.district}, {p.city}</p>
        <p className="mt-3 line-clamp-2 text-base text-muted-foreground">{p.short}</p>
        <div className="mt-5 flex items-center gap-6 text-base">
          <span className="flex items-center gap-2"><Maximize className="h-5 w-5 text-primary" />{p.area} m²</span>
          {p.beds > 0 && <span className="flex items-center gap-2"><BedDouble className="h-5 w-5 text-primary" />{p.beds}</span>}
          <span className="flex items-center gap-2"><Bath className="h-5 w-5 text-primary" />{p.baths}</span>
        </div>
      </div>
    </Link>
  );
}
