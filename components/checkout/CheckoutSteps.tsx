"use client";

import { cn } from "@/lib/utils";

const STEPS = ["Shipping", "Payment", "Review"] as const;

interface CheckoutStepsProps {
  currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;
          return (
            <li
              key={label}
              className={cn(
                "flex flex-1 items-center",
                index < STEPS.length - 1 && "after:content-[''] after:flex-1 after:border-t after:border-gray-200 after:mx-2"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  isComplete && "bg-gray-900 text-white",
                  isActive && "bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2",
                  !isComplete && !isActive && "bg-gray-200 text-gray-500"
                )}
              >
                {isComplete ? "✓" : step}
              </span>
              <span
                className={cn(
                  "ml-2 text-sm font-medium hidden sm:inline",
                  isActive ? "text-gray-900" : "text-gray-500"
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
