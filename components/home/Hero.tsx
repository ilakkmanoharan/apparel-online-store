"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "@/hooks/useTranslations";

export default function Hero() {
  const t = useTranslations();

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t("home.heroTitle")}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">{t("home.heroSubtitle")}</p>
          <LocaleLink
            href="/category/women"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t("home.shopNow")}
            <ArrowRightIcon className="w-5 h-5" />
          </LocaleLink>
        </motion.div>
      </div>
    </section>
  );
}
