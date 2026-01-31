/**
 * @jest-environment node
 */

/**
 * Tests for order confirmation email functionality.
 *
 * Phase 17: Order confirmation email / receipt
 * - sendOrderConfirmationEmail function
 * - Integration with webhook (orders.ts)
 */

import type { CartItem, Product, Address } from "@/types";

// Mock Resend as virtual module (not installed in project)
const mockSend = jest.fn();
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: (...args: unknown[]) => mockSend(...args),
    },
  })),
}), { virtual: true });

// Import after mock setup
import { sendOrderConfirmationEmail, OrderEmailData } from "@/lib/email/order-confirmation";

// Helper to create test data
function createTestProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "prod_123",
    name: "Test Product",
    description: "A test product",
    price: 29.99,
    images: ["https://example.com/image.jpg"],
    category: "test",
    sizes: ["S", "M", "L"],
    colors: ["Red", "Blue"],
    inStock: true,
    stockCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createTestCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    product: createTestProduct(),
    quantity: 1,
    selectedSize: "M",
    selectedColor: "Red",
    ...overrides,
  };
}

function createTestAddress(overrides: Partial<Address> = {}): Address {
  return {
    id: "addr_123",
    fullName: "Jane Doe",
    street: "123 Main St",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    country: "US",
    isDefault: true,
    ...overrides,
  };
}

describe("sendOrderConfirmationEmail", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("development mode (no API key)", () => {
    it("logs email instead of sending when RESEND_API_KEY is not set", async () => {
      delete process.env.RESEND_API_KEY;
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const result = await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: createTestAddress(),
        }
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("dev-mode-no-send");
      expect(consoleSpy).toHaveBeenCalledWith(
        "[email] RESEND_API_KEY not set; logging email instead of sending"
      );
      expect(mockSend).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("production mode (with API key)", () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = "re_test_123";
    });

    it("sends email successfully", async () => {
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      const result = await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: createTestAddress(),
        }
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg_123");
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "customer@example.com",
          subject: expect.stringContaining("Order Confirmation"),
        })
      );
    });

    it("uses default from email when EMAIL_FROM is not set", async () => {
      delete process.env.EMAIL_FROM;
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: null,
        }
      );

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "onboarding@resend.dev",
        })
      );
    });

    it("uses custom from email when EMAIL_FROM is set", async () => {
      process.env.EMAIL_FROM = "orders@mystore.com";
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: null,
        }
      );

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "orders@mystore.com",
        })
      );
    });

    it("includes HTML and text content", async () => {
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem({ quantity: 2 })],
          total: 59.98,
          shippingAddress: createTestAddress(),
        }
      );

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).toContain("Order Confirmed!");
      expect(callArgs.html).toContain("Test Product");
      expect(callArgs.html).toContain("Jane Doe");
      expect(callArgs.html).toContain("123 Main St");
      expect(callArgs.text).toContain("Order Confirmed!");
      expect(callArgs.text).toContain("Test Product");
    });

    it("handles multiple items", async () => {
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      const items: CartItem[] = [
        createTestCartItem({
          product: createTestProduct({ id: "prod_1", name: "Shirt", price: 25 }),
          quantity: 1,
        }),
        createTestCartItem({
          product: createTestProduct({ id: "prod_2", name: "Pants", price: 45 }),
          quantity: 2,
        }),
      ];

      await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items,
          total: 115,
          shippingAddress: createTestAddress(),
        }
      );

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).toContain("Shirt");
      expect(callArgs.html).toContain("Pants");
      expect(callArgs.text).toContain("Shirt");
      expect(callArgs.text).toContain("Pants");
    });

    it("handles null shipping address", async () => {
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: null,
        }
      );

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).not.toContain("Shipping Address");
    });

    it("handles Resend API error", async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: "Invalid API key" },
      });

      const result = await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: null,
        }
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid API key");
    });

    it("handles Resend send exception", async () => {
      mockSend.mockRejectedValue(new Error("Network error"));

      const result = await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: null,
        }
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });

    it("truncates long order ID in subject", async () => {
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      const longOrderId = "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0";

      await sendOrderConfirmationEmail(
        longOrderId,
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: null,
        }
      );

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.subject).toBe("Order Confirmation - cs_test_a1b2c3d4e5f6...");
    });

    it("includes order date in email", async () => {
      mockSend.mockResolvedValue({
        data: { id: "msg_123" },
        error: null,
      });

      const orderDate = new Date("2026-01-15T10:30:00Z");

      await sendOrderConfirmationEmail(
        "order_123",
        "customer@example.com",
        {
          items: [createTestCartItem()],
          total: 29.99,
          shippingAddress: null,
          orderDate,
        }
      );

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).toContain("January 15, 2026");
      expect(callArgs.text).toContain("January 15, 2026");
    });
  });
});
