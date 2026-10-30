import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Eye, ImagePlus, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { CITIES, TYPES, formatSAR, type Property } from "@/data/properties";
import { newId, useAdmin, type AdminProperty } from "@/lib/admin-store";
import { PageHeader, Panel } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/properties")({ component: PropertiesAdmin });

const blank = (): AdminProperty => ({
  id: newId(), title: "", city: "Riyadh", district: "", type: "Villa", price: 0, area: 0, beds: 0, baths: 0,
  short: "", description: "", images: [], status: "Ready", year: new Date().getFullYear(), amenities: [], views: 0, published: true,
});

/** Shrink uploaded photos so the demo fits in browser storage. */
function compress(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1200 / img.width);
      const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.72)); URL.revokeObjectURL(img.src);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

function PropertiesAdmin() {
  const { properties, saveProperty, deleteProperty, can } = useAdmin();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [edit, setEdit] = useState<AdminProperty | null>(null);

  const list = useMemo(() => properties.filter((p) => (!city || p.city === city) && `${p.title} ${p.district} ${p.type}`.toLowerCase().includes(q.toLowerCase())), [properties, q, city]);
  const isNew = edit ? !properties.some((p) => p.id === edit.id) : false;
  const set = <K extends keyof AdminProperty>(k: K, v: AdminProperty[K]) => setEdit((e) => (e ? { ...e, [k]: v } : e));

  const save = () => {
    if (!edit) return;
    if (!edit.title.trim() || !edit.district.trim() || edit.price <= 0) { toast.error("Title, district and price are required"); return; }
    if (edit.images.length === 0) { toast.error("Add at least one photo"); return; }
    saveProperty({ ...edit, description: edit.description || edit.short });
    toast.success(isNew ? "Property added" : "Property updated");
    setEdit(null);
  };

  return (
    <div>
      <PageHeader title="Properties" sub={`${properties.length} listings · ${properties.filter((p) => p.published).length} live on the site`} action={
        can.edit && <button onClick={() => setEdit(blank())} className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground"><Plus className="h-4 w-4" />Add property</button>
      } />
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings" className="field !bg-background pl-10" />
        </label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="field !w-auto !bg-background"><option value="">All cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <Panel key={p.id} className="!p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem]">
              <img src={p.images[0]} alt={p.title} className={`h-full w-full object-cover ${p.published ? "" : "opacity-40 grayscale"}`} />
              {p.featured && <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary"><Star className="h-4 w-4 fill-current" /></span>}
            </div>
            <div className="p-3">
              <p className="text-xl font-medium">{formatSAR(p.price)}</p>
              <p className="mt-1 truncate font-medium">{p.title}</p>
              <p className="text-sm text-muted-foreground">{p.district}, {p.city} · {p.type} · {p.status}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Eye className="h-4 w-4" />{p.views.toLocaleString("en")}</span>
                <label className="ml-auto flex items-center gap-2 text-sm">{p.published ? "Live" : "Hidden"}
                  <Switch checked={p.published} disabled={!can.edit} onCheckedChange={(v) => saveProperty({ ...p, published: v })} />
                </label>
                {can.edit && <button aria-label="Edit" onClick={() => setEdit(p)} className="rounded-full bg-cream p-2.5"><Pencil className="h-4 w-4" /></button>}
                {can.delete && <button aria-label="Delete" onClick={() => { if (confirm(`Delete "${p.title}"?`)) { deleteProperty(p.id); toast.success("Property deleted"); } }} className="rounded-full bg-cream p-2.5 text-destructive"><Trash2 className="h-4 w-4" /></button>}
              </div>
            </div>
          </Panel>
        ))}
      </div>
      {list.length === 0 && <Panel>No properties match.</Panel>}

      <Sheet open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <SheetContent className="w-full overflow-y-auto border-none sm:max-w-xl">
          <SheetHeader><SheetTitle className="text-2xl font-medium">{isNew ? "Add property" : "Edit property"}</SheetTitle></SheetHeader>
          {edit && (
            <form className="grid gap-4 p-4" onSubmit={(e) => { e.preventDefault(); save(); }}>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Photos (first one is the cover)</p>
                <div className="grid grid-cols-3 gap-2">
                  {edit.images.map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" aria-label="Remove photo" onClick={() => set("images", edit.images.filter((_, j) => j !== i))} className="absolute right-1.5 top-1.5 rounded-full bg-background p-1"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-cream text-sm text-muted-foreground hover:bg-muted">
                    <ImagePlus className="h-6 w-6" />Upload
                    <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                      const files = Array.from(e.target.files ?? []);
                      const urls = await Promise.all(files.map(compress));
                      setEdit((cur) => (cur ? { ...cur, images: [...cur.images, ...urls] } : cur));
                      e.target.value = "";
                    }} />
                  </label>
                </div>
              </div>
              <Field label="Title"><input className="field" value={edit.title} onChange={(e) => set("title", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City"><select className="field" value={edit.city} onChange={(e) => set("city", e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
                <Field label="District"><input className="field" value={edit.district} onChange={(e) => set("district", e.target.value)} /></Field>
                <Field label="Type"><select className="field" value={edit.type} onChange={(e) => set("type", e.target.value as Property["type"])}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
                <Field label="Status"><select className="field" value={edit.status} onChange={(e) => set("status", e.target.value as Property["status"])}><option>Ready</option><option>Off-plan</option></select></Field>
                <Field label="Price (SAR)"><input className="field" type="number" min={0} value={edit.price || ""} onChange={(e) => set("price", Number(e.target.value))} /></Field>
                <Field label="Area (m²)"><input className="field" type="number" min={0} value={edit.area || ""} onChange={(e) => set("area", Number(e.target.value))} /></Field>
                <Field label="Bedrooms"><input className="field" type="number" min={0} value={edit.beds} onChange={(e) => set("beds", Number(e.target.value))} /></Field>
                <Field label="Bathrooms"><input className="field" type="number" min={0} value={edit.baths} onChange={(e) => set("baths", Number(e.target.value))} /></Field>
                <Field label="Year"><input className="field" type="number" value={edit.year} onChange={(e) => set("year", Number(e.target.value))} /></Field>
                <Field label="Rental yield % (optional)"><input className="field" type="number" step="0.1" min={0} value={edit.investment?.yield ?? ""} onChange={(e) => set("investment", e.target.value ? { yield: Number(e.target.value), label: edit.investment?.label ?? "Investment ready" } : undefined)} /></Field>
              </div>
              <Field label="Short description"><input className="field" value={edit.short} onChange={(e) => set("short", e.target.value)} /></Field>
              <Field label="Full description"><textarea className="field resize-none rounded-[1.5rem]" rows={4} value={edit.description} onChange={(e) => set("description", e.target.value)} /></Field>
              <Field label="Amenities (comma separated)"><input className="field" value={edit.amenities.join(", ")} onChange={(e) => set("amenities", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
              <div className="flex flex-wrap gap-6 rounded-2xl bg-cream p-4">
                <label className="flex items-center gap-3"><Switch checked={!!edit.featured} onCheckedChange={(v) => set("featured", v)} />Featured on home</label>
                <label className="flex items-center gap-3"><Switch checked={edit.published} onCheckedChange={(v) => set("published", v)} />Live on site</label>
              </div>
              <div className="sticky bottom-0 flex gap-2 bg-background py-3">
                <button type="button" onClick={() => setEdit(null)} className="flex-1 rounded-full bg-cream py-3.5">Cancel</button>
                <button className="flex-1 rounded-full bg-primary py-3.5 text-primary-foreground">{isNew ? "Add property" : "Save changes"}</button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex flex-col gap-1.5"><span className="px-1 text-sm text-muted-foreground">{label}</span>{children}</label>;
}
