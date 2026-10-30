import { describe, expect, it } from "vitest";
import { PERMS } from "@/lib/admin-store";

describe("admin roles", () => {
  it("admins can delete and manage staff", () => expect(PERMS.Admin).toEqual({ edit: true, delete: true, staff: true }));
  it("agents can edit but not delete or manage staff", () => expect(PERMS.Agent).toEqual({ edit: true, delete: false, staff: false }));
  it("viewers are read only", () => expect(PERMS.Viewer).toEqual({ edit: false, delete: false, staff: false }));
});
