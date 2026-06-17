import { describe, expect, it } from "vitest";
import { buildBreadcrumbs } from "@/shell/navigation/breadcrumbs";

describe("buildBreadcrumbs", () => {
  it("builds incremental hrefs from a pathname", () => {
    expect(buildBreadcrumbs("/modules/module-a")).toEqual([
      { label: "modules", href: "/modules" },
      { label: "module a", href: "/modules/module-a" },
    ]);
  });
});
