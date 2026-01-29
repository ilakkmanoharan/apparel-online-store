import Link from "next/link";

export default function GiftCardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Gift Cards</h1>
      <p className="text-gray-600 mb-6 max-w-xl">
        Give the gift of style. Our gift cards can be used on any purchase. Redeem your gift card below or continue shopping.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link href="/gift-cards/redeem" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">Redeem a gift card</Link>
        <Link href="/" className="inline-block px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
