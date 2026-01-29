"use client";

import { cn } from "@/lib/utils";

interface FitInfoProps {
  /** e.g. "Regular fit", "Slim fit" */
  fit?: string;
  /** Optional description */
  description?: string;
  className?: string;
}

export default function FitInfo({ fit, description, className }: FitInfoProps) {
  if (!fit && !description) return null;

  return (
    <div className={cn("text-sm text-gray-600", className)}>
      {fit && <p className="font-medium text-gray-900">{fit}</p>}
      {description && <p className="mt-1">{description}</p>}
    </div>
  );
}
