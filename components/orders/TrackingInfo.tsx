"use client";

import { useMemo } from "react";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import Spinner from "@/components/common/Spinner";
import OrderStatusBadge from "./OrderStatusBadge";

interface TrackingInfoProps {
  orderId: string;
}

export default function TrackingInfo({ orderId }: TrackingInfoProps) {
  const { tracking, loading, error, refresh } = useOrderTracking({ orderId });

  const estimatedLabel = useMemo(() => {
    if (!tracking?.estimatedDelivery) return null;
    return tracking.estimatedDelivery.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }, [tracking?.estimatedDelivery]);

  if (loading && !tracking) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Spinner size="sm" />
        <span>Loading tracking…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-1 text-xs font-medium text-gray-900 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!tracking) {
    return <p className="text-sm text-gray-500">Tracking details not available yet.</p>;
  }

  const currentEvent = tracking.events.find((e) => e.status === "current");

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Status</span>
          <OrderStatusBadge status={tracking.status} />
        </div>
        {estimatedLabel && (
          <span className="text-gray-700">
            Est. delivery <span className="font-medium">{estimatedLabel}</span>
          </span>
        )}
      </div>
      {tracking.carrier && tracking.trackingNumber && (
        <p className="text-gray-600">
          {tracking.carrier} •{" "}
          <span className="font-mono text-xs">{tracking.trackingNumber}</span>
        </p>
      )}
      {currentEvent && (
        <p className="text-gray-700">
          <span className="font-medium">{currentEvent.label}</span>
          {currentEvent.timestamp && (
            <>
              {" "}
              •{" "}
              <span className="text-gray-500">
                {currentEvent.timestamp.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </p>
      )}
      <ol className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        {tracking.events.map((event) => (
          <li key={event.id} className="flex items-center gap-1">
            <span
              className={[
                "inline-flex h-1.5 w-1.5 rounded-full",
                event.status === "past"
                  ? "bg-emerald-500"
                  : event.status === "current"
                  ? "bg-gray-900"
                  : "bg-gray-300",
              ].join(" ")}
            />
            <span>{event.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

