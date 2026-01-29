import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({ title, description, actionLabel, actionHref, onAction, className = "" }: EmptyStateProps) {
  return (
    <div className={"text-center py-12 px-4 " + className}>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-2 text-gray-600 max-w-sm mx-auto">{description}</p>}
      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-4">
          {actionHref ? (
            <Link href={actionHref} className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
              {actionLabel}
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
