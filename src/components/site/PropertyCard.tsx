import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import { formatSAR, type Property } from "@/data/properties";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link to="/properties/$id" params={{ id: p.id }} className="group flex flex-col rounded-[1.75rem] bg-background p-2 transition-shadow duration-500 hover:shadow-soft" data-reveal>
      <div className="relative aspect-[4/3.3] overflow-hidden rounded-[1.4rem] bg-secondary">
        <img src={p.images[0]} alt={p.title} loading="lazy" width={1024} height={800}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        <p className="absolute left-3 top-3 rounded-full bg-ink/35 px-4 py-2 text-sm font-semibold tracking-tight text-ink-foreground backdrop-blur-md">
          {formatSAR(p.price)}
        </p>
        <span className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-3 scale-75 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
        <h3 className="text-lg font-medium leading-snug tracking-tight">{p.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{p.district}, {p.city}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.short}</p>
        <div className="mt-4 flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-full bg-cream px-4 py-2.5 text-[13px]">
          <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4 text-primary" />{p.area} m²</span>
          {p.beds > 0 && <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-primary" />{p.beds} Beds</span>}
          <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary" />{p.baths} Baths</span>
        </div>
      </div>
    </Link>
  );
}
