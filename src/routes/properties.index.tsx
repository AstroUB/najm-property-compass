import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { BUDGETS, CITIES, PROPERTIES, TYPES } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { useReveal } from "@/components/site/motion";

type Search = { city?: string | undefined; type?: string | undefined; budget?: string | undefined; beds?: string | undefined; status?: string | undefined; sort?: string | undefined };

export const Route = createFileRoute("/properties/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const pick = (k: string) => (typeof s[k] === "string" && s[k] ? (s[k] as string) : undefined);
    return { city: pick("city"), type: pick("type"), budget: pick("budget"), beds: pick("beds"), status: pick("status"), sort: pick("sort") };
  },
  head: () => ({
    meta: [
      { title: "Properties for Sale in Saudi Arabia — Najm Estate" },
      { name: "description", content: "Browse villas, penthouses, apartments and commercial property for sale in Riyadh, Jeddah, Dammam and AlUla." },
      { property: "og:title", content: "Properties for Sale — Najm Estate" },
      { property: "og:description", content: "Filter premium Saudi properties by city, type, budget and bedrooms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertiesPage,
});

function filterProperties(search: Search) {
  let r = PROPERTIES.filter((p) => {
    if (search.city && p.city !== search.city) return false;
    if (search.type && p.type !== search.type) return false;
    if (search.status && p.status !== search.status) return false;
    if (search.beds && p.beds < Number(search.beds)) return false;
    if (search.budget) {
      const [min = 0, max = Infinity] = search.budget.split("-").map(Number);
      if (p.price < min || p.price > max) return false;
    }
    return true;
  });
  if (search.sort === "low") r = [...r].sort((a, b) => a.price - b.price);
  if (search.sort === "high") r = [...r].sort((a, b) => b.price - a.price);
  if (search.sort === "area") r = [...r].sort((a, b) => b.area - a.area);
  return r;
}

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/properties/" });
  const [mobileOpen, setMobileOpen] = useState(false);
  const set = (k: keyof Search, v: string) =>
    navigate({ search: (prev) => ({ ...prev, [k]: prev[k] === v ? undefined : v || undefined }), replace: true });

  const list = useMemo(() => filterProperties(search), [search]);
  useReveal([list.length, JSON.stringify(search)]);
  const hasFilters = Object.values(search).some(Boolean);

  return (
    <main className="px-4 pb-20 pt-28 md:px-6">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="display-xl"><span className="fancy">P</span>roperties</h1>
            <p className="mt-3 text-base text-muted-foreground">
              {list.length} curated {list.length === 1 ? "residence" : "residences"} across the Kingdom
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select aria-label="Sort" value={search.sort ?? ""} onChange={(e) => navigate({ search: (p) => ({ ...p, sort: e.target.value || undefined }), replace: true })} className="field w-auto pr-10 text-sm">
              <option value="">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="area">Largest first</option>
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className={`${mobileOpen ? "fixed inset-0 z-[60] overflow-y-auto bg-background p-6" : "hidden"} lg:sticky lg:top-24 lg:block lg:self-start`}>
            <div className="rounded-[1.5rem] bg-cream p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">Filters</p>
                {hasFilters ? (
                  <button onClick={() => navigate({ search: {} })} className="text-sm text-primary hover:underline">Reset</button>
                ) : null}
                <button onClick={() => setMobileOpen(false)} className="lg:hidden" aria-label="Close filters"><X className="h-5 w-5" /></button>
              </div>

              <Group title="Location">
                {CITIES.map((c) => <Chip key={c} active={search.city === c} onClick={() => set("city", c)}>{c}</Chip>)}
              </Group>
              <Group title="Property type">
                {TYPES.map((c) => <Chip key={c} active={search.type === c} onClick={() => set("type", c)}>{c}</Chip>)}
              </Group>
              <Group title="Budget" column>
                {BUDGETS.map((b) => <Chip key={b.value} active={search.budget === b.value} onClick={() => set("budget", b.value)} wide>{b.label}</Chip>)}
              </Group>
              <Group title="Bedrooms">
                {["1", "2", "3", "4", "5"].map((n) => <Chip key={n} active={search.beds === n} onClick={() => set("beds", n)}>{n}+</Chip>)}
              </Group>
              <Group title="Status">
                <Chip active={search.status === "Ready"} onClick={() => set("status", "Ready")}>Ready</Chip>
                <Chip active={search.status === "Off-plan"} onClick={() => set("status", "Off-plan")}>Off-plan</Chip>
              </Group>
              <button onClick={() => setMobileOpen(false)} className="mt-6 w-full rounded-full bg-ink py-3 text-sm text-ink-foreground lg:hidden">
                Show {list.length} results
              </button>
            </div>
          </aside>

          <section>
            {list.length ? (
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                {list.map((p) => <PropertyCard key={p.id} p={p} />)}
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-cream p-12 text-center">
                <p className="display-md">No matches — yet.</p>
                <p className="mt-3 text-base text-muted-foreground">Try widening your filters, or ask us about off-market homes.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Group({ title, children, column }: { title: string; children: React.ReactNode; column?: boolean }) {
  return (
    <div className="mt-6">
      <p className="mb-3 text-sm text-muted-foreground">{title}</p>
      <div className={column ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children, wide }: { active: boolean; onClick: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${wide ? "text-left" : ""} ${active ? "bg-primary text-primary-foreground" : "bg-background hover:bg-background/60"}`}
    >
      {children}
    </button>
  );
}
