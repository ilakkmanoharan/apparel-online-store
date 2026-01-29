"use client";

interface SimpleLineChartProps {
  data: { date: string; value: number }[];
  valueLabel?: string;
  className?: string;
}

export default function SimpleLineChart({ data, valueLabel, className = "" }: SimpleLineChartProps) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-end gap-0.5 h-32">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-900 rounded-t min-w-[4px] transition-all"
            style={{
              height: `${((d.value - min) / (max - min || 1)) * 100}%`,
            }}
            title={`${d.date}: ${valueLabel === "currency" ? "$" : ""}${d.value}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
