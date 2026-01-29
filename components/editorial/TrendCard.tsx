"use client";

import Link from "next/link";

interface TrendCardProps {
  slug: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function TrendCard({ slug, title, description, imageUrl }: TrendCardProps) {
  return (
    <Link href={"/trends/" + slug} className="block border rounded-lg overflow-hidden hover:bg-gray-50">
      {imageUrl && <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />}
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </Link>
  );
}
