"use client";

interface ReturnShippingLabelProps {
  labelUrl?: string | null;
  trackingNumber?: string | null;
}

export default function ReturnShippingLabel({ labelUrl, trackingNumber }: ReturnShippingLabelProps) {
  if (!labelUrl && !trackingNumber) return null;
  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-2">
      {labelUrl && (
        <a
          href={labelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 font-medium underline"
        >
          Print return label
        </a>
      )}
      {trackingNumber && (
        <p className="text-sm text-gray-600">
          Tracking: <span className="font-mono">{trackingNumber}</span>
        </p>
      )}
    </div>
  );
}
