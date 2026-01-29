interface Props {
  query: string;
  count: number;
}

export default function SearchResultSummary({ query, count }: Props) {
  if (!query) return null;

  return (
    <div className="mb-2 text-sm text-gray-600">
      Found <span className="font-semibold">{count}</span> result
      {count === 1 ? "" : "s"} for &quot;{query}&quot;
    </div>
  );
}

