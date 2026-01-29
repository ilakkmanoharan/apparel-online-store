"use client";

import RedeemForm from "@/components/giftcard/RedeemForm";

export default function GiftCardRedeemPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Redeem gift card</h1>
      <RedeemForm />
    </div>
  );
}
