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
        <div className="absolute bottom-3 left-3 right-16 h-11">
          <span aria-hidden className="lg-card glass-clear pointer-events-none absolute inset-0 rounded-full" />
          <p className="relative z-10 flex h-full items-center px-4 text-base font-semibold tracking-tight text-ink-foreground drop-shadow-[0_1px_6px_oklch(0_0_0/0.5)]">{formatSAR(p.price)}</p>
        </div>
        <span className="absolute bottom-3 right-3 bg-primary text-primary-foreground flex h-11 w-11 translate-y-3 scale-75 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="px-1 pt-4 transition-transform duration-500 group-hover:translate-x-1">
        <h3 className="text-lg font-medium tracking-tight">{p.title}</h3>
        <p className="text-sm text-muted-foreground">{p.district}, {p.city}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.short}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 whitespace-nowrap text-[13px]">
          <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4 text-primary" />{p.area} m²</span>
          {p.beds > 0 && <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-primary" />{p.beds} Beds</span>}
          <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary" />{p.baths} Baths</span>
        </div>
      </div>
    </Link>
  );
}
