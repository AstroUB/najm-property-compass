import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminProvider } from "@/lib/admin-store";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Najm Estate" },
      { name: "description", content: "Najm Estate staff admin panel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — Najm Estate" },
      { property: "og:description", content: "Najm Estate staff admin panel." },
    ],
  }),
  ssr: false,
  component: () => (
    <AdminProvider>
      <AdminShell><Outlet /></AdminShell>
    </AdminProvider>
  ),
});
