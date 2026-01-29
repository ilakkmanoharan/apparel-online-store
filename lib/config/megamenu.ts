export interface MegaMenuItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  featured?: boolean;
}

export interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuConfig {
  label: string;
  href: string;
  sections: MegaMenuSection[];
  badge?: string;
}

export const megaMenuConfig: MegaMenuConfig[] = [
  {
    label: "Women",
    href: "/category/women",
    badge: "New",
    sections: [
      {
        title: "Shop by category",
        items: [
          { label: "New Arrivals", href: "/category/women?section=new", badge: "New" },
          { label: "Dresses", href: "/category/women?section=dresses" },
          { label: "Tops", href: "/category/women?section=tops" },
          { label: "Jeans", href: "/category/women?section=jeans" },
        ],
      },
      {
        title: "Shop by trend",
        items: [
          { label: "Best Sellers", href: "/category/women?sort=rating" },
          { label: "Sale", href: "/category/women?section=sale" },
        ],
      },
    ],
  },
  {
    label: "Men",
    href: "/category/men",
    sections: [
      {
        title: "Shop by category",
        items: [
          { label: "New Arrivals", href: "/category/men?section=new" },
          { label: "Shirts", href: "/category/men?section=shirts" },
          { label: "Pants", href: "/category/men?section=pants" },
          { label: "Outerwear", href: "/category/men?section=outerwear" },
        ],
      },
    ],
  },
  {
    label: "Kids",
    href: "/category/kids",
    sections: [
      {
        title: "Shop",
        items: [
          { label: "Girls", href: "/category/kids?section=girls" },
          { label: "Boys", href: "/category/kids?section=boys" },
          { label: "Baby", href: "/category/kids?section=baby" },
        ],
      },
    ],
  },
];

export function getMegaMenuByLabel(label: string): MegaMenuConfig | undefined {
  return megaMenuConfig.find((m) => m.label.toLowerCase() === label.toLowerCase());
}
