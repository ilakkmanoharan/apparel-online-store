"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class CheckoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CheckoutErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className={cn(
            "rounded-lg border border-red-200 bg-red-50 p-6 text-center",
            this.props.className
          )}
        >
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-red-700 mb-4">
            We couldn&apos;t complete your checkout. Please try again or contact support.
          </p>
          <Link
            href="/cart"
            className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to cart
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
