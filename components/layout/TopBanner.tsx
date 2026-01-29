"use client";

import Link from "next/link";

export default function TopBanner() {
  return (
    <div className="bg-gray-900 text-white text-xs sm:text-sm py-2">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-medium">
          Free shipping on orders over $50 &amp; free returns in-store.
        </p>
        <Link
          href="/(static)/sale"
          className="underline underline-offset-4"
        >
          Shop Today&apos;s Deals
        </Link>
      </div>
    </div>
  );
}

