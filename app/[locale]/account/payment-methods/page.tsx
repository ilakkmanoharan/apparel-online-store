"use client";

import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import SavedCards from "@/components/checkout/SavedCards";
import Spinner from "@/components/common/Spinner";
import LocaleLink from "@/components/common/LocaleLink";

export default function PaymentMethodsPage() {
  const { methods, loading, error } = usePaymentMethods();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment methods</h1>
      {error && <p className="text-red-600">{error}</p>}
      <SavedCards methods={methods} />
      {methods.length === 0 && !error && (
        <p className="text-gray-600">No saved payment methods. Add one at checkout.</p>
      )}
      <LocaleLink href="/account" className="text-blue-600 hover:underline">
        Back to account
      </LocaleLink>
    </div>
  );
}
