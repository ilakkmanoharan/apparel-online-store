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

export function getMainNavItems(t: (key: string) => string): NavItem[] {
  return [
    {
      label: t("nav.women"),
      href: "/category/women",
      children: [
        {
          label: t("nav.newArrivals"),
          href: "/women",
          description: t("nav.womenNewArrivalsDescription"),
          badge: t("common.new"),
        },
        {
          label: t("nav.dresses"),
          href: "/category/women?section=dresses",
          description: t("nav.dressesDescription"),
        },
        {
          label: t("nav.tops"),
          href: "/category/women?section=tops",
          description: t("nav.topsDescription"),
        },
        {
          label: t("nav.jeans"),
          href: "/category/women?section=jeans",
          description: t("nav.jeansDescription"),
        },
      ],
    },
    {
      label: t("nav.men"),
      href: "/category/men",
      children: [
        {
          label: t("nav.newArrivals"),
          href: "/men",
          description: t("nav.menNewArrivalsDescription"),
          badge: t("common.new"),
        },
        {
          label: t("nav.shirts"),
          href: "/category/men?section=shirts",
          description: t("nav.shirtsDescription"),
        },
        {
          label: t("nav.pants"),
          href: "/category/men?section=pants",
          description: t("nav.pantsDescription"),
        },
        {
          label: t("nav.outerwear"),
          href: "/category/men?section=outerwear",
          description: t("nav.outerwearDescription"),
        },
      ],
    },
    {
      label: t("nav.kids"),
      href: "/category/kids",
      children: [
        {
          label: t("nav.girls"),
          href: "/category/kids?section=girls",
        },
        {
          label: t("nav.boys"),
          href: "/category/kids?section=boys",
        },
        {
          label: t("nav.baby"),
          href: "/category/kids?section=baby",
        },
      ],
    },
    {
      label: t("nav.sale"),
      href: "/sale",
      children: [
        {
          label: t("nav.womensSale"),
          href: "/category/women?section=sale",
        },
        {
          label: t("nav.mensSale"),
          href: "/category/men?section=sale",
        },
        {
          label: t("nav.kidsSale"),
          href: "/category/kids?section=sale",
        },
      ],
      badge: t("nav.sale"),
    },
  ];
}
