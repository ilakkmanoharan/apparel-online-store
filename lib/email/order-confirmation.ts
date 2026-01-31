/**
 * Order Confirmation Email Module
 *
 * Sends order confirmation emails after successful checkout.
 * Uses Resend as the email provider (requires RESEND_API_KEY env var).
 *
 * ## Setup
 * 1. Install Resend: `npm install resend`
 * 2. Get API key from https://resend.com
 * 3. Set RESEND_API_KEY in .env.local
 * 4. Optionally set EMAIL_FROM (defaults to "onboarding@resend.dev")
 *
 * ## Development Mode
 * If RESEND_API_KEY is not set, emails are logged to console instead of sent.
 * This allows development without email credentials.
 *
 * @see lib/firebase/orders.ts - Called from webhook after order creation
 */

import type { CartItem, Address } from "@/types";

export interface OrderEmailData {
  items: CartItem[];
  total: number;
  shippingAddress: Address | null;
  orderDate?: Date;
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Format currency for display in email.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Build HTML email content for order confirmation.
 */
function buildEmailHtml(orderId: string, data: OrderEmailData): string {
  const { items, total, shippingAddress, orderDate = new Date() } = data;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.product.name}
          <br><small style="color: #666;">Size: ${item.selectedSize} | Color: ${item.selectedColor}</small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.product.price * item.quantity)}</td>
      </tr>
    `
    )
    .join("");

  const shippingHtml = shippingAddress
    ? `
    <div style="margin-top: 24px;">
      <h3 style="color: #333; margin-bottom: 8px;">Shipping Address</h3>
      <p style="color: #666; line-height: 1.6;">
        ${shippingAddress.fullName}<br>
        ${shippingAddress.street}<br>
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
        ${shippingAddress.country}
      </p>
    </div>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; margin-bottom: 8px;">Order Confirmed!</h1>
        <p style="color: #666; margin-bottom: 24px;">Thank you for your order. We'll send you a shipping confirmation once your items are on the way.</p>

        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0; color: #666;">
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Date:</strong> ${orderDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <h3 style="color: #333; margin-bottom: 16px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #eee;">
              <th style="padding: 12px; text-align: left; color: #666;">Item</th>
              <th style="padding: 12px; text-align: center; color: #666;">Qty</th>
              <th style="padding: 12px; text-align: right; color: #666;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 16px 12px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 16px 12px; text-align: right; font-weight: bold; font-size: 18px;">${formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>

        ${shippingHtml}

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

        <p style="color: #999; font-size: 14px; margin: 0;">
          If you have any questions about your order, please contact our support team.
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Build plain text email content for order confirmation.
 */
function buildEmailText(orderId: string, data: OrderEmailData): string {
  const { items, total, shippingAddress, orderDate = new Date() } = data;

  const itemsList = items
    .map(
      (item) =>
        `- ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity}: ${formatCurrency(item.product.price * item.quantity)}`
    )
    .join("\n");

  const shippingText = shippingAddress
    ? `
Shipping Address:
${shippingAddress.fullName}
${shippingAddress.street}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
${shippingAddress.country}
`
    : "";

  return `
Order Confirmed!

Thank you for your order. We'll send you a shipping confirmation once your items are on the way.

Order ID: ${orderId}
Date: ${orderDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

Order Summary:
${itemsList}

Total: ${formatCurrency(total)}
${shippingText}
If you have any questions about your order, please contact our support team.
`.trim();
}

/**
 * Send order confirmation email.
 *
 * @param orderId - The order ID (Stripe session ID)
 * @param email - Customer email address
 * @param data - Order data (items, total, shippingAddress)
 * @returns SendResult with success status
 *
 * @example
 * await sendOrderConfirmationEmail("cs_test_123", "customer@example.com", {
 *   items: cartItems,
 *   total: 99.99,
 *   shippingAddress: address,
 * });
 */
export async function sendOrderConfirmationEmail(
  orderId: string,
  email: string,
  data: OrderEmailData
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  // Development mode: log email instead of sending
  if (!apiKey) {
    console.log("[email] RESEND_API_KEY not set; logging email instead of sending");
    console.log("[email] To:", email);
    console.log("[email] Subject: Order Confirmation -", orderId);
    console.log("[email] Items:", data.items.length);
    console.log("[email] Total:", formatCurrency(data.total));
    return { success: true, messageId: "dev-mode-no-send" };
  }

  const html = buildEmailHtml(orderId, data);
  const text = buildEmailText(orderId, data);

  try {
    // Dynamic import to avoid build errors if resend is not installed
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const response = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Order Confirmation - ${orderId.slice(0, 20)}...`,
      html,
      text,
    });

    if (response.error) {
      console.error("[email] Resend API error:", response.error);
      return { success: false, error: response.error.message };
    }

    console.log("[email] Order confirmation sent:", response.data?.id);
    return { success: true, messageId: response.data?.id };
  } catch (error) {
    // Handle case where resend is not installed
    if (error instanceof Error && error.message.includes("Cannot find module")) {
      console.warn("[email] Resend package not installed; run: npm install resend");
      return { success: false, error: "Resend package not installed" };
    }

    console.error("[email] Failed to send order confirmation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
