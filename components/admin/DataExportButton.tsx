"use client";

interface DataExportButtonProps {
  data: unknown[];
  filename: string;
  label?: string;
  className?: string;
}

export default function DataExportButton({ data, filename, label = "Export CSV", className = "" }: DataExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;
    const keys = Object.keys(data[0] as Record<string, unknown>);
    const header = keys.join(",");
    const rows = (data as Record<string, unknown>[]).map((row) =>
      keys.map((k) => {
        const v = row[k];
        if (v instanceof Date) return v.toISOString();
        if (typeof v === "string" && v.includes(",")) return `"${v}"`;
        return String(v ?? "");
      }).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={data.length === 0}
      className={`px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </button>
  );
}
