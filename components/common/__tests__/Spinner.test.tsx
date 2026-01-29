import { render, screen } from "@testing-library/react";
import Spinner from "@/components/common/Spinner";

describe("Spinner", () => {
  it("renders", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
