import Link from "next/link";

interface DidYouMeanProps {
  original: string;
  suggested: string;
  searchBasePath?: string;
  className?: string;
}

export default function DidYouMean({ original, suggested, searchBasePath = "/search", className = "" }: DidYouMeanProps) {
  const href = `${searchBasePath}?q=${encodeURIComponent(suggested)}`;
  return (
    <p className={"text-sm text-gray-600 " + className}>
      Did you mean{" "}
      <Link href={href} className="font-medium text-blue-600 hover:underline">
        {suggested}
      </Link>
      ?
    </p>
  );
}
