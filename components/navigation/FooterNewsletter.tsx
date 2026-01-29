"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { cn } from "@/lib/utils";

interface FooterNewsletterProps {
  title?: string;
  description?: string;
  onSubmit?: (email: string) => Promise<void>;
  className?: string;
}

export default function FooterNewsletter({
  title = "Stay in the loop",
  description = "Get updates on new arrivals and exclusive offers.",
  onSubmit,
  className,
}: FooterNewsletterProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    setMessage(null);
    try {
      await onSubmit?.(trimmed);
      setEmail("");
      setMessage({ type: "success", text: "Thanks for subscribing." });
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("", className)}>
      <h4 className="font-semibold mb-2 text-white">{title}</h4>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      {onSubmit ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "…" : "Subscribe"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">Newsletter signup coming soon.</p>
      )}
      {message && (
        <p className={cn("mt-2 text-sm", message.type === "success" ? "text-green-400" : "text-amber-400")}>
          {message.text}
        </p>
      )}
    </div>
  );
}
