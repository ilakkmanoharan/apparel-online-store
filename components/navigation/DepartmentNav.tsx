"use client";

import Link from "next/link";
import { departments } from "@/lib/config/departments";

export default function DepartmentNav() {
  return (
    <nav aria-label="Departments" className="flex flex-wrap gap-4">
      {departments.map((d) => (
        <Link key={d.id} href={d.href} className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline">
          {d.name}
        </Link>
      ))}
    </nav>
  );
}
