import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bath, BedDouble, Maximize } from "lucide-react";
import { formatSAR, type Property } from "@/data/properties";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link to="/properties/$id" params={{ id: p.id }} className="group block" data-reveal>
      <div className="relative aspect-[4/3.2] overflow-hidden rounded-[1.5rem] bg-secondary">
        <img
          src={p.images[0]}
          alt={p.title}
          loading="lazy"
          width={1024}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="glass absolute bottom-3 right-3 flex h-11 w-11 translate-y-3 scale-75 items-center justify-center rounded-full text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="px-1 pt-4">
        <p className="text-lg font-semibold tracking-tight text-primary">{formatSAR(p.price)}</p>
        <h3 className="mt-1 text-lg font-medium tracking-tight">{p.title}</h3>
        <p className="text-sm text-muted-foreground">{p.district}, {p.city}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.short}</p>
        <div className="mt-4 flex items-center gap-5 text-sm">
          <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4 text-primary" />{p.area} m²</span>
          {p.beds > 0 && <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-primary" />{p.beds} Beds</span>}
          <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary" />{p.baths} Baths</span>
        </div>
      </div>
    </Link>
  );
}
