import { render, screen } from "@testing-library/react";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";

describe("CheckoutSteps", () => {
  it("renders step labels", () => {
    render(<CheckoutSteps currentStep={1} />);
    expect(screen.getByText("Shipping")).toBeInTheDocument();
  });
});
