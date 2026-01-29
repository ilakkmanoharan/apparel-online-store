"use client";

interface SimpleBarChartProps {
  data: { label: string; value: number }[];
  valueLabel?: string;
  maxValue?: number;
  className?: string;
}

export default function SimpleBarChart({ data, valueLabel, maxValue, className = "" }: SimpleBarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`space-y-2 ${className}`}>
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-24 text-sm text-gray-600 truncate">{d.label}</span>
          <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded transition-all"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          {valueLabel === "currency" && (
            <span className="text-sm font-medium text-gray-900 w-20 text-right">
              ${d.value.toFixed(0)}
            </span>
          )}
          {valueLabel !== "currency" && (
            <span className="text-sm font-medium text-gray-900 w-12 text-right">{d.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
