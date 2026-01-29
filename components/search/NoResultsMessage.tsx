import Link from "next/link";

interface NoResultsMessageProps {
  query?: string;
  className?: string;
}

export default function NoResultsMessage({ query, className = "" }: NoResultsMessageProps) {
  return (
    <div className={"text-center py-12 px-4 " + className}>
      <h2 className="text-lg font-semibold text-gray-900">No results found</h2>
      {query && <p className="mt-2 text-gray-600">We couldn&apos;t find anything for &quot;{query}&quot;</p>}
      <p className="mt-4 text-sm text-gray-600">Try different keywords or browse our categories.</p>
      <Link href="/category/women" className="mt-4 inline-block text-blue-600 font-medium hover:underline">
        Browse Women
      </Link>
      <span className="mx-2 text-gray-400">|</span>
      <Link href="/category/men" className="text-blue-600 font-medium hover:underline">
        Browse Men
      </Link>
    </div>
  );
}
