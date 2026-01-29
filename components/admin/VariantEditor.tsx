"use client";

import Input from "@/components/common/Input";
import type { ProductVariant } from "@/lib/admin/variants";
import { cn } from "@/lib/utils";

interface VariantEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  className?: string;
}

export default function VariantEditor({
  variants,
  onChange,
  className,
}: VariantEditorProps) {
  const update = (index: number, updates: Partial<ProductVariant>) => {
    const next = [...variants];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-gray-600">Edit stock and optional SKU per variant.</p>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Size</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Color</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Stock</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">SKU</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {variants.map((v, i) => (
              <tr key={v.id}>
                <td className="px-3 py-2 text-gray-900">{v.size}</td>
                <td className="px-3 py-2 text-gray-900">{v.color}</td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    min={0}
                    value={v.stockCount}
                    onChange={(e) => update(i, { stockCount: parseInt(e.target.value, 10) || 0 })}
                    className="w-20"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={v.sku ?? ""}
                    onChange={(e) => update(i, { sku: e.target.value || undefined })}
                    placeholder="Optional"
                    className="w-32"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
