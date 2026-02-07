export interface Department {
  id: string;
  name: string;
  slug: string;
  href: string;
  description?: string;
  order: number;
}

export function getDepartments(t: (key: string) => string): Department[] {
  return [
    { id: "women", name: t("nav.women"), slug: "women", href: "/category/women", order: 1 },
    { id: "men", name: t("nav.men"), slug: "men", href: "/category/men", order: 2 },
    { id: "kids", name: t("nav.kids"), slug: "kids", href: "/category/kids", order: 3 },
    { id: "home", name: t("nav.home"), slug: "home", href: "/category/home", order: 4 },
    { id: "beauty", name: t("nav.beauty"), slug: "beauty", href: "/category/beauty", order: 5 },
    { id: "sale", name: t("nav.sale"), slug: "sale", href: "/sale", order: 6 },
  ];
}

export function getDepartmentBySlug(slug: string, t: (key: string) => string): Department | undefined {
  return getDepartments(t).find((d) => d.slug === slug);
}

export function getDepartmentById(id: string, t: (key: string) => string): Department | undefined {
  return getDepartments(t).find((d) => d.id === id);
}
