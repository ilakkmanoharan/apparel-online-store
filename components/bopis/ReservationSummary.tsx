"use client";

import Link from "next/link";

interface ReservationSummaryProps {
  reservationId: string;
  storeName: string;
  storeId: string;
  expiresAt: Date | string;
  onCancel?: (reservationId: string) => void;
  cancelLoading?: boolean;
}

export default function ReservationSummary({
  reservationId,
  storeName,
  storeId,
  expiresAt,
  onCancel,
  cancelLoading,
}: ReservationSummaryProps) {
  const expires = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-2">Pickup reservation</h3>
      <p className="text-sm text-gray-600">
        <strong>Store:</strong>{" "}
        <Link href={`/stores/${storeId}`} className="text-blue-600 hover:underline">
          {storeName}
        </Link>
      </p>
      <p className="text-sm text-gray-600">
        <strong>Reservation ID:</strong> {reservationId}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Expires:</strong> {expires.toLocaleString()}
      </p>
      {onCancel && (
        <button
          type="button"
          onClick={() => onCancel(reservationId)}
          disabled={cancelLoading}
          className="mt-3 text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {cancelLoading ? "Cancelling..." : "Cancel reservation"}
        </button>
      )}
    </div>
  );
}
