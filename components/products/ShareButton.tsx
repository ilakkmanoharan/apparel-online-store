"use client";

import { useState } from "react";
import { ShareIcon, CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  className?: string;
}

export default function ShareButton({
  url,
  title,
  text,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: text ?? title,
          url,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
        className
      )}
      aria-label="Share"
    >
      {copied ? (
        <>
          <CheckIcon className="w-5 h-5 text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <ShareIcon className="w-5 h-5" />
          Share
        </>
      )}
    </button>
  );
}
