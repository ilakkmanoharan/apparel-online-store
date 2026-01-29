"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FooterLinkItem {
  name: string;
  href: string;
}

export interface FooterLinksProps {
  title: string;
  links: FooterLinkItem[];
  className?: string;
}

export default function FooterLinks({
  title,
  links,
  className,
}: FooterLinksProps) {
  return (
    <div className={cn("", className)}>
      <h4 className="font-semibold mb-4 text-white">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
