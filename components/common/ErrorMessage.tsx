interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ message, onRetry, className = "" }: ErrorMessageProps) {
  return (
    <div className={"rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 " + className}>
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-2 text-sm font-medium text-red-600 hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}
