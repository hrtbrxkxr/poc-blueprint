export interface Breadcrumb {
  label: string;
  href: string;
}

export function buildBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment.replace(/-/g, " "),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));
}
