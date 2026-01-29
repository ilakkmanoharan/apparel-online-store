import { render, screen } from "@testing-library/react";
import AddressList from "@/components/account/AddressList";

describe("AddressList", () => {
  it("renders empty state when no addresses", () => {
    render(<AddressList addresses={[]} loading={false} userId={null} />);
    expect(screen.getByText(/no saved addresses/i)).toBeInTheDocument();
  });
});
