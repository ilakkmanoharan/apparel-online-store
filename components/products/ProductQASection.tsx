"use client";

import { useProductQA } from "@/hooks/useProductQA";
import QAList from "@/components/qa/QAList";
import QAForm from "@/components/qa/QAForm";

interface ProductQASectionProps {
  productId: string;
  className?: string;
}

export default function ProductQASection({
  productId,
  className = "",
}: ProductQASectionProps) {
  const { items, loading, error, submitQuestion } = useProductQA({
    productId,
    limit: 20,
  });

  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Customer questions & answers
      </h2>
      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}
      <QAForm
        productId={productId}
        onSubmit={submitQuestion}
        className="mb-6"
      />
      <QAList items={items} loading={loading} />
    </section>
  );
}
