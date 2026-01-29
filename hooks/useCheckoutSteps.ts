"use client";

import { useState, useCallback } from "react";
import type { CheckoutStepId } from "@/lib/checkout/constants";
import { CHECKOUT_STEPS } from "@/lib/checkout/constants";

export function useCheckoutSteps(initialStep: CheckoutStepId = "shipping") {
  const [currentStep, setCurrentStep] = useState<CheckoutStepId>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<CheckoutStepId[]>([]);

  const stepIndex = CHECKOUT_STEPS.indexOf(currentStep);

  const goNext = useCallback(() => {
    if (stepIndex < CHECKOUT_STEPS.length - 1) {
      const next = CHECKOUT_STEPS[stepIndex + 1];
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );
      setCurrentStep(next);
    }
  }, [currentStep, stepIndex]);

  const goTo = useCallback((step: CheckoutStepId) => {
    setCurrentStep(step);
  }, []);

  const isComplete = (step: CheckoutStepId) => completedSteps.includes(step);
  const canProceed = stepIndex < CHECKOUT_STEPS.length - 1;

  return {
    currentStep,
    completedSteps,
    stepIndex,
    goNext,
    goTo,
    isComplete,
    canProceed,
  };
}
