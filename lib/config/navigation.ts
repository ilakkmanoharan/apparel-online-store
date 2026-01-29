export type NavChildItem = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  children?: NavChildItem[];
  badge?: string;
};

export const mainNavItems: NavItem[] = [
  {
    label: "Women",
    href: "/category/women",
    children: [
      {
        label: "New Arrivals",
        href: "/(static)/women",
        description: "Latest trends and seasonal drops.",
        badge: "New",
      },
      {
        label: "Dresses",
        href: "/category/women?section=dresses",
        description: "Work, casual, and occasion dresses.",
      },
      {
        label: "Tops",
        href: "/category/women?section=tops",
        description: "Tees, blouses, and more.",
      },
      {
        label: "Jeans",
        href: "/category/women?section=jeans",
        description: "Skinny, straight, and relaxed fits.",
      },
    ],
  },
  {
    label: "Men",
    href: "/category/men",
    children: [
      {
        label: "New Arrivals",
        href: "/(static)/men",
        description: "Fresh styles for every day.",
        badge: "New",
      },
      {
        label: "Shirts",
        href: "/category/men?section=shirts",
        description: "Casual and dress shirts.",
      },
      {
        label: "Pants",
        href: "/category/men?section=pants",
        description: "Chinos, joggers, and more.",
      },
      {
        label: "Outerwear",
        href: "/category/men?section=outerwear",
        description: "Jackets and coats for all seasons.",
      },
    ],
  },
  {
    label: "Kids",
    href: "/category/kids",
    children: [
      {
        label: "Girls",
        href: "/category/kids?section=girls",
      },
      {
        label: "Boys",
        href: "/category/kids?section=boys",
      },
      {
        label: "Baby",
        href: "/category/kids?section=baby",
      },
    ],
  },
  {
    label: "Sale",
    href: "/(static)/sale",
    children: [
      {
        label: "Women&apos;s Sale",
        href: "/category/women?section=sale",
      },
      {
        label: "Men&apos;s Sale",
        href: "/category/men?section=sale",
      },
      {
        label: "Kids&apos; Sale",
        href: "/category/kids?section=sale",
      },
    ],
    badge: "Sale",
  },
];

