import { render, fireEvent } from "@testing-library/react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

jest.mock("@/lib/firebase/auth-google", () => ({
  signInWithGoogle: jest.fn().mockResolvedValue(undefined),
}));

describe("GoogleSignInButton", () => {
  it("renders with default label", () => {
    const { getByText } = render(<GoogleSignInButton />);
    expect(getByText("Continue with Google")).toBeInTheDocument();
  });

  it("calls sign-in on click", async () => {
    const { getByRole } = render(<GoogleSignInButton />);
    const button = getByRole("button");
    fireEvent.click(button);
  });
});

