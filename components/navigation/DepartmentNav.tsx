"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { getDepartments } from "@/lib/config/departments";
import { useTranslations } from "@/hooks/useTranslations";

export default function DepartmentNav() {
  const t = useTranslations();
  const departments = getDepartments(t);

  return (
    <nav aria-label={t("nav.departments")} className="flex flex-wrap gap-4">
      {departments.map((department) => (
        <LocaleLink
          key={department.id}
          href={department.href}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
        >
          {department.name}
        </LocaleLink>
      ))}
    </nav>
  );
}
