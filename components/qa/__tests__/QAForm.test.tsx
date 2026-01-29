import { render, screen, fireEvent } from "@testing-library/react";
import QAForm from "@/components/qa/QAForm";

const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

describe("QAForm", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders submit button and input", () => {
    render(<QAForm productId="p1" onSubmit={mockOnSubmit} />);
    expect(screen.getByPlaceholderText(/true to size/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit question/i })).toBeInTheDocument();
  });

  it("disables submit when question is too short", () => {
    render(<QAForm productId="p1" onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText(/true to size/i);
    fireEvent.change(input, { target: { value: "Short" } });
    expect(screen.getByRole("button", { name: /submit question/i })).toBeDisabled();
  });

  it("calls onSubmit with trimmed question on submit", async () => {
    render(<QAForm productId="p1" onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText(/true to size/i);
    fireEvent.change(input, { target: { value: "  Does this run true to size?  " } });
    fireEvent.click(screen.getByRole("button", { name: /submit question/i }));
    await screen.findByText(/submitting/i).catch(() => {});
    expect(mockOnSubmit).toHaveBeenCalledWith("Does this run true to size?");
  });
});
