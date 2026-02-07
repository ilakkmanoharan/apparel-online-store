"use client";

import Link, { type LinkProps } from "next/link";
import { localizeHref } from "@/lib/i18n/path";
import { useI18n } from "@/components/common/I18nProvider";

type LocaleLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & LinkProps;

export default function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const { locale } = useI18n();

  return <Link href={localizeHref(href, locale)} {...props} />;
}
