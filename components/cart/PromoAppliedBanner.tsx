"use client";

interface PromoAppliedBannerProps {
  code: string;
  discountLabel: string;
  onRemove: () => void;
  className?: string;
}

export default function PromoAppliedBanner({
  code,
  discountLabel,
  onRemove,
  className = "",
}: PromoAppliedBannerProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span>
        <strong className="font-mono">{code}</strong> applied — {discountLabel}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="font-medium text-emerald-700 underline hover:no-underline"
      >
        Remove
      </button>
    </div>
  );
}
