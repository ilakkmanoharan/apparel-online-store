"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { validateQuestion } from "@/lib/qa/validation";

interface QAFormProps {
  productId: string;
  onSubmit: (question: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function QAForm({
  productId,
  onSubmit,
  disabled = false,
  className = "",
}: QAFormProps) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validation = validateQuestion(question);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid question");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(question.trim());
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ask a question
      </label>
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Does this run true to size?"
        disabled={disabled}
        className="w-full"
      />
      <p className="mt-1 text-xs text-gray-500">Min 10 characters, max 500.</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <Button
        type="submit"
        disabled={disabled || loading || question.trim().length < 10}
        className="mt-2"
      >
        {loading ? "Submitting…" : "Submit question"}
      </Button>
    </form>
  );
}
