"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";

export default function Footer() {
  const t = useTranslations();

  const footerLinks = {
    shop: [
      { name: t("nav.women"), href: "/category/women" },
      { name: t("nav.men"), href: "/category/men" },
      { name: t("nav.kids"), href: "/category/kids" },
      { name: t("nav.sale"), href: "/sale" },
    ],
    help: [
      { name: t("footer.contactUs"), href: "/contact" },
      { name: t("footer.shipping"), href: "/shipping" },
      { name: t("footer.returns"), href: "/returns" },
      { name: t("footer.faq"), href: "/faq" },
    ],
    about: [
      { name: t("footer.aboutUs"), href: "/about" },
      { name: t("footer.careers"), href: "/careers" },
      { name: t("footer.sustainability"), href: "/sustainability" },
      { name: t("footer.press"), href: "/press" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{t("brand.name")}</h3>
            <p className="text-gray-400">{t("footer.brandDescription")}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.shop")}</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <LocaleLink
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.help")}</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <LocaleLink
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.about")}</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <LocaleLink
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
