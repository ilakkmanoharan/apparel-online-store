import { renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

describe("AuthContext", () => {
  it("throws if used outside provider", () => {
    expect(() => renderHook(() => useAuth())).toThrow();
  });

  it("provides default value inside provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toHaveProperty("user");
  });
});

