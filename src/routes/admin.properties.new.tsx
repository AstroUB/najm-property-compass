import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PropertyEditor, blankProperty } from "@/components/admin/PropertyEditor";
import { Panel } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/properties/new")({ component: NewProperty });

function NewProperty() {
  const { can } = useAdmin();
  const [initial] = useState(blankProperty);
  if (!can.edit) return <Panel>Your role can't add properties.</Panel>;
  return <PropertyEditor initial={initial} />;
}
