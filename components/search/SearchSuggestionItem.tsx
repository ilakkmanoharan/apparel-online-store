"use client";

import Link from "next/link";

interface Props {
  label: string;
  href: string;
}

export default function SearchSuggestionItem({ label, href }: Props) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {label}
    </Link>
  );
}

