"use client";

import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onExportSelected?: () => void;
  onDeleteSelected?: () => void;
  loading?: boolean;
  className?: string;
}

export default function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onExportSelected,
  onDeleteSelected,
  loading = false,
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm",
        className
      )}
    >
      <span className="font-medium text-gray-700">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClearSelection} disabled={loading}>
          Clear
        </Button>
        {onExportSelected && (
          <Button variant="outline" size="sm" onClick={onExportSelected} disabled={loading}>
            Export
          </Button>
        )}
        {onDeleteSelected && (
          <Button variant="outline" size="sm" onClick={onDeleteSelected} disabled={loading}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
