import { describe, expect, it } from "vitest";
import { roles } from "@/content/site";
import { isRoleOpen } from "@/lib/desk-clock";
import { filterRoles, relatedRoles } from "@/lib/role-desk";

describe("role search", () => {
  it("matches backend and austin across fields", () => {
    const hits = filterRoles(roles, { q: "backend francisco", region: "", engagement: "", city: "" });
    expect(hits.some((role) => role.city === "San Francisco")).toBe(true);
  });

  it("drops a closed role from the open list", () => {
    const closed = { ...roles[0], closesOn: "2020-01-01", slug: "closed-fixture" };
    const hits = filterRoles([closed, roles[0]], {
      q: "",
      region: "",
      engagement: "",
      city: "",
    });
    expect(hits.some((role) => role.slug === "closed-fixture")).toBe(false);
    expect(isRoleOpen(closed, new Date())).toBe(false);
  });

  it("does not return a role as related to itself", () => {
    const role = roles[0];
    expect(relatedRoles(role).some((item) => item.slug === role.slug)).toBe(false);
  });
});
