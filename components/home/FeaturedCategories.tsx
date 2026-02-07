"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

const CATEGORY_SLUGS = ["women", "men", "kids"] as const;

export default function FeaturedCategories() {
  const t = useTranslations();

  const categories = CATEGORY_SLUGS.map((slug) => ({
    slug,
    name: t(`home.categories.${slug}.name`),
    description: t(`home.categories.${slug}.description`),
  }));

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t("home.shopByCategory")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <LocaleLink
                href={`/category/${category.slug}`}
                className="block group relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-200">{category.description}</p>
                </div>
                <motion.div
                  className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"
                  whileHover={{ opacity: 0.1 }}
                />
              </LocaleLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
