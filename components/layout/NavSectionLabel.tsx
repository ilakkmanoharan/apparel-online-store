"use client";

interface NavSectionLabelProps {
  label: string;
}

export default function NavSectionLabel({ label }: NavSectionLabelProps) {
  return (
    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
      {label}
    </div>
  );
}

