"use client";

import { useState, useRef } from "react";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface ProductBulkUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMb?: number;
  className?: string;
}

export default function ProductBulkUpload({
  onFileSelect,
  accept = ".csv,.json",
  maxSizeMb = 5,
  className,
}: ProductBulkUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File must be under ${maxSizeMb}MB`;
    }
    return null;
  };

  const handleFile = (file: File | null) => {
    setError(null);
    if (!file) return;
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    onFileSelect?.(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          handleFile(file ?? null);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-sm text-gray-500 transition-colors",
          dragOver ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <p>Drop a CSV or JSON file here, or click to browse.</p>
        <p className="mt-1 text-xs">Max {maxSizeMb}MB</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
