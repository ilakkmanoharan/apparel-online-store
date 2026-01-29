interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return <div className={"rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin " + s + " " + className} role="status" aria-label="Loading" />;
}
