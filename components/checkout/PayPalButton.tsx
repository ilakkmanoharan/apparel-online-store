"use client";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: (details: unknown) => void;
  onError?: (err: Error) => void;
  disabled?: boolean;
}

export default function PayPalButton({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  disabled,
}: PayPalButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      onSuccess?.({});
    } else {
      onError?.(new Error("PayPal not configured"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="px-4 py-2 bg-[#0070ba] text-white rounded font-medium disabled:opacity-50"
    >
      Pay with PayPal ({currency} {amount.toFixed(2)})
    </button>
  );
}
