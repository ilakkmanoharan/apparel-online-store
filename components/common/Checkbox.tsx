"use client";

import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={inputId}
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900",
          className
        )}
        {...props}
      />
      {label && (
        <label htmlFor={inputId} className="text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
}
