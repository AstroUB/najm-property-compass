import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Building2, Eye, Inbox, Wallet } from "lucide-react";
import { formatSAR } from "@/data/properties";
import { fmtDate, useAdmin } from "@/lib/admin-store";
import { PageHeader, Panel, STATUS_STYLE } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

const C = ["var(--primary)", "var(--ink)", "oklch(0.75 0.06 85)", "oklch(0.62 0.07 158)", "oklch(0.85 0.03 85)"];

function Dashboard() {
  const { properties, enquiries, contacts, user } = useAdmin();

  const stats = useMemo(() => {
    const views = properties.reduce((s, p) => s + p.views, 0);
    const value = properties.reduce((s, p) => s + p.price, 0);
    const fresh = enquiries.filter((e) => e.status === "New").length;
    const closed = enquiries.filter((e) => e.status === "Closed").length;
    return [
      { label: "Total listing views", value: views.toLocaleString("en"), icon: Eye },
      { label: "New enquiries", value: String(fresh), icon: Inbox },
      { label: "Active listings", value: String(properties.filter((p) => p.published).length), icon: Building2 },
      { label: "Portfolio value", value: `SAR ${Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`, icon: Wallet },
      { label: "Conversion", value: `${enquiries.length ? Math.round((closed / enquiries.length) * 100) : 0}%`, icon: ArrowUpRight },
    ];
  }, [properties, enquiries]);

  const trend = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const key = d.toDateString();
    return { day: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), enquiries: enquiries.filter((e) => new Date(e.date).toDateString() === key).length, views: 180 + ((i * 53) % 120) + i * 9 };
  }), [enquiries]);

  const byCity = useMemo(() => Object.entries(properties.reduce<Record<string, number>>((a, p) => ((a[p.city] = (a[p.city] ?? 0) + 1), a), {})).map(([name, value]) => ({ name, value })), [properties]);
  const bySource = useMemo(() => Object.entries(enquiries.reduce<Record<string, number>>((a, e) => ((a[e.source] = (a[e.source] ?? 0) + 1), a), {})).map(([name, value]) => ({ name, value })), [enquiries]);
  const topViewed = [...properties].sort((a, b) => b.views - a.views).slice(0, 5);
  const recent = [...enquiries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const maxViews = topViewed[0]?.views ?? 1;

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.name.split(" ")[0]}`} sub="Here's how Najm Estate is performing." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s, i) => (
          <Panel key={s.label} className={i === 0 ? "bg-primary text-primary-foreground" : ""}>
            <s.icon className="h-6 w-6 opacity-80" />
            <p className="mt-6 text-3xl font-medium tracking-tight">{s.value}</p>
            <p className="mt-1 text-sm opacity-70">{s.label}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Panel>
          <p className="text-xl font-medium">Traffic & enquiries · last 14 days</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid vertical={false} stroke="var(--cream)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis yAxisId="v" tickLine={false} axisLine={false} fontSize={12} width={36} />
                <YAxis yAxisId="e" orientation="right" tickLine={false} axisLine={false} fontSize={12} width={24} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "none" }} />
                <Area yAxisId="v" type="monotone" dataKey="views" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.12} strokeWidth={2} />
                <Area yAxisId="e" type="monotone" dataKey="enquiries" stroke="var(--ink)" fill="var(--ink)" fillOpacity={0.06} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <p className="text-xl font-medium">Enquiry sources</p>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {bySource.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 16, border: "none" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {bySource.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: C[i % C.length] }} />{s.name}<span className="ml-auto font-medium">{s.value}</span></li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">Recent enquiries</p>
            <Link to="/admin/enquiries" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-cream">
            {recent.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-medium">{e.name[0]}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{e.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{e.message}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs ${STATUS_STYLE[e.status]}`}>{e.status}</span>
                  <p className="mt-1 text-xs text-muted-foreground">{fmtDate(e.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <p className="text-xl font-medium">Most viewed properties</p>
          <ul className="mt-4 space-y-4">
            {topViewed.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-cream"><div className="h-full rounded-full bg-primary" style={{ width: `${(p.views / maxViews) * 100}%` }} /></div>
                </div>
                <span className="text-sm text-muted-foreground">{p.views.toLocaleString("en")}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <p className="text-xl font-medium">Listings by city</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCity}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis hide allowDecimals={false} />
                <Tooltip cursor={{ fill: "var(--cream)" }} contentStyle={{ borderRadius: 16, border: "none" }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{contacts.length} contacts in your address book</p>
        </Panel>
      </div>
    </div>
  );
}
