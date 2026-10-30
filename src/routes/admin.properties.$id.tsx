import { createFileRoute, Link } from "@tanstack/react-router";
import { PropertyEditor } from "@/components/admin/PropertyEditor";
import { Panel } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/properties/$id")({ component: EditProperty });

function EditProperty() {
  const { id } = Route.useParams();
  const { properties, can } = useAdmin();
  const p = properties.find((x) => x.id === id);
  if (!can.edit) return <Panel>Your role can't edit properties.</Panel>;
  if (!p) return <Panel>That property no longer exists. <Link to="/admin/properties" className="text-primary">Back to properties</Link></Panel>;
  return <PropertyEditor key={p.id} initial={p} />;
}
