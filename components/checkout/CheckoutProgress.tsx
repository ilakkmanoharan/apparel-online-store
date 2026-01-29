"use client";

import { CHECKOUT_STEPS, STEP_LABELS } from "@/lib/checkout/constants";
import type { CheckoutStepId } from "@/lib/checkout/constants";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  currentStep: CheckoutStepId;
  completedSteps?: CheckoutStepId[];
  className?: string;
}

export default function CheckoutProgress({
  currentStep,
  completedSteps = [],
  className,
}: CheckoutProgressProps) {
  const stepIndex = CHECKOUT_STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Checkout progress" className={cn("mb-8", className)}>
      <ol className="flex items-center justify-between">
        {CHECKOUT_STEPS.map((stepId, index) => {
          const isActive = stepId === currentStep;
          const isComplete = completedSteps.includes(stepId) || index < stepIndex;
          const stepNum = index + 1;
          return (
            <li
              key={stepId}
              className={cn(
                "flex flex-1 items-center",
                index < CHECKOUT_STEPS.length - 1 &&
                  "after:content-[''] after:flex-1 after:border-t after:border-gray-200 after:mx-2"
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
                {isComplete ? "✓" : stepNum}
              </span>
              <span
                className={cn(
                  "ml-2 text-sm font-medium hidden sm:inline",
                  isActive ? "text-gray-900" : "text-gray-500"
                )}
              >
                {STEP_LABELS[stepId]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
