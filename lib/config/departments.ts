export interface Department {
  id: string;
  name: string;
  slug: string;
  href: string;
  description?: string;
  order: number;
}

export const departments: Department[] = [
  { id: "women", name: "Women", slug: "women", href: "/category/women", order: 1 },
  { id: "men", name: "Men", slug: "men", href: "/category/men", order: 2 },
  { id: "kids", name: "Kids", slug: "kids", href: "/category/kids", order: 3 },
  { id: "home", name: "Home", slug: "home", href: "/category/home", order: 4 },
  { id: "beauty", name: "Beauty", slug: "beauty", href: "/category/beauty", order: 5 },
  { id: "sale", name: "Sale", slug: "sale", href: "/(static)/sale", order: 6 },
];

export function getDepartmentBySlug(slug: string): Department | undefined {
  return departments.find((d) => d.slug === slug);
}

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}
