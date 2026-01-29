import Link from "next/link";

interface Props {
  query: string;
}

export default function SearchResultEmpty({ query }: Props) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-xl font-semibold mb-2">No results</h2>
      <p className="text-gray-600 mb-4">
        We couldn&apos;t find any matches for &quot;{query}&quot;.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Try a different term, or browse our categories.
      </p>
      <Link
        href="/"
        className="inline-block bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

