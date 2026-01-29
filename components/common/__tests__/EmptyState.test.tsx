import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/common/EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No items" description="Add something." />);
    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByText("Add something.")).toBeInTheDocument();
  });
});
