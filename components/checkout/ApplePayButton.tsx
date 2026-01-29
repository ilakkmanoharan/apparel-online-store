"use client";

/** Placeholder for Apple Pay. Requires Apple Pay JS and merchant validation in production. */
interface ApplePayButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  disabled?: boolean;
}

export default function ApplePayButton({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  disabled,
}: ApplePayButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    if (typeof window !== "undefined" && (window as unknown as { ApplePaySession?: unknown }).ApplePaySession) {
      // TODO: ApplePaySession.requestPayment()
      onSuccess?.();
    } else {
      onError?.(new Error("Apple Pay not available"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="px-4 py-2 bg-black text-white rounded font-medium disabled:opacity-50"
    >
      Apple Pay ({currency} {amount.toFixed(2)})
    </button>
  );
}
