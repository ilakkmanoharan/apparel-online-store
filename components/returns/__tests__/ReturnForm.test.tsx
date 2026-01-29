import { render, fireEvent, screen } from "@testing-library/react";
import ReturnForm from "@/components/returns/ReturnForm";
import type { Order } from "@/types";

jest.mock("@/lib/returns/firebase", () => ({
  createReturn: jest.fn().mockResolvedValue("return-id"),
}));

const baseOrder: Order = {
  id: "order1",
  userId: "user1",
  items: [],
  total: 100,
  shippingAddress: {
    id: "addr1",
    fullName: "Test User",
    street: "123 Main St",
    city: "City",
    state: "CA",
    zipCode: "12345",
    country: "US",
    isDefault: true,
  },
  status: "delivered",
  paymentMethod: "card",
  paymentStatus: "paid",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ReturnForm", () => {
  it("renders submit and cancel buttons", () => {
    const onSuccess = jest.fn();
    const onCancel = jest.fn();
    render(<ReturnForm order={baseOrder} onSuccess={onSuccess} onCancel={onCancel} />);

    expect(
      screen.getByRole("button", { name: /submit return request/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onSuccess = jest.fn();
    const onCancel = jest.fn();
    render(<ReturnForm order={baseOrder} onSuccess={onSuccess} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});

