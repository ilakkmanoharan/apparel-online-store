"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const t = useTranslations();
  const steps = [t("checkout.shipping"), t("checkout.payment"), t("checkout.review")];

  return (
    <nav aria-label={t("checkout.progress")} className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <li
              key={label}
              className={cn(
                "flex flex-1 items-center",
                index < steps.length - 1 && "after:content-[''] after:flex-1 after:border-t after:border-gray-200 after:mx-2"
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
                {isComplete ? "\u2713" : step}
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
