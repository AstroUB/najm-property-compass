import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { BUDGETS, CITIES, PROPERTIES, TYPES } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { useReveal } from "@/components/site/motion";

type Search = { city?: string; type?: string; budget?: string; beds?: string; status?: string; sort?: string };

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

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/properties/" });
  const set = (k: keyof Search, v: string) => navigate({ search: (prev) => ({ ...prev, [k]: v || undefined }), replace: true });

  const list = useMemo(() => {
    let r = PROPERTIES.filter((p) => {
      if (search.city && p.city !== search.city) return false;
      if (search.type && p.type !== search.type) return false;
      if (search.status && p.status !== search.status) return false;
      if (search.beds && p.beds < Number(search.beds)) return false;
      if (search.budget) {
        const [min, max] = search.budget.split("-").map(Number);
        if (p.price < min || p.price > max) return false;
      }
      return true;
    });
    if (search.sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (search.sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (search.sort === "area") r = [...r].sort((a, b) => b.area - a.area);
    return r;
  }, [search]);

  useReveal([list.length, JSON.stringify(search)]);
  const hasFilters = Object.values(search).some(Boolean);

  return (
    <main className="px-6 pb-28 pt-40">
      <div className="mx-auto max-w-7xl">
        <h1 className="display-xl"><span className="fancy">P</span>roperties</h1>
        <p className="mt-6 max-w-xl text-xl text-muted-foreground">
          {list.length} curated {list.length === 1 ? "residence" : "residences"} across the Kingdom.
        </p>

        <div className="sticky top-24 z-30 mt-12 rounded-[2.5rem] bg-background/90 py-3 backdrop-blur-xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Select label="Location" value={search.city} onChange={(v) => set("city", v)} options={CITIES.map((c) => [c, c])} placeholder="Any location" />
            <Select label="Type" value={search.type} onChange={(v) => set("type", v)} options={TYPES.map((c) => [c, c])} placeholder="Any type" />
            <Select label="Budget" value={search.budget} onChange={(v) => set("budget", v)} options={BUDGETS.map((b) => [b.value, b.label])} placeholder="Any budget" />
            <Select label="Bedrooms" value={search.beds} onChange={(v) => set("beds", v)} options={[["1", "1+ beds"], ["3", "3+ beds"], ["4", "4+ beds"], ["5", "5+ beds"]]} placeholder="Any bedrooms" />
            <Select label="Status" value={search.status} onChange={(v) => set("status", v)} options={[["Ready", "Ready to move"], ["Off-plan", "Off-plan"]]} placeholder="Any status" />
            <Select label="Sort" value={search.sort} onChange={(v) => set("sort", v)} options={[["low", "Price: low to high"], ["high", "Price: high to low"], ["area", "Largest first"]]} placeholder="Recommended" />
          </div>
        </div>
        {hasFilters && (
          <button onClick={() => navigate({ search: {} })} className="mt-4 px-2 text-lg text-primary hover:underline">
            Clear all filters
          </button>
        )}

        {list.length ? (
          <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="mt-14 rounded-[2.5rem] bg-cream p-16 text-center">
            <p className="display-md">No matches — yet.</p>
            <p className="mt-4 text-xl text-muted-foreground">Try widening your filters, or ask us about off-market homes.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value?: string; onChange: (v: string) => void; options: (readonly [string, string])[] | string[][]; placeholder: string }) {
  return (
    <select aria-label={label} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="field">
      <option value="">{placeholder}</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
