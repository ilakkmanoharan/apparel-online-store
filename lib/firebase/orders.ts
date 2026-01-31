import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type Stripe from "stripe";
import { Order, CartItem, Address, Product } from "@/types";
import { getProductById } from "./products";

const ordersCollection = collection(db, "orders");

// Compact item format from checkout metadata (Stripe 500-char limit strategy).
// Webhook expands these by fetching product details from DB.
interface CompactCartItem {
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  price: number; // Price at checkout time
}

export async function getOrderById(id: string): Promise<Order | null> {
  const ref = doc(ordersCollection, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;

  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Order;
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const q = query(
    ordersCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as any;
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Order;
  });
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await createOrUpdateOrderFromCheckoutSession(session);
  }
}

/**
 * Expand compact cart items from metadata by fetching product details.
 * Compact items contain: productId, quantity, selectedSize, selectedColor, price.
 * We fetch the full product from DB; if not found, create a placeholder product
 * using the price stored at checkout time.
 */
async function expandCompactItems(
  compactItems: CompactCartItem[]
): Promise<CartItem[]> {
  const cartItems: CartItem[] = [];

  for (const item of compactItems) {
    const product = await getProductById(item.productId);

    if (product) {
      // Use the price from checkout time (stored in compact item) to preserve paid amount
      cartItems.push({
        product: {
          ...product,
          price: item.price, // Override with checkout-time price
        },
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    } else {
      // Product not found in DB - create placeholder with checkout-time data.
      // This can happen if product was deleted after checkout.
      console.warn(
        `[orders] Product not found: ${item.productId}; using placeholder`
      );
      const placeholderProduct: Product = {
        id: item.productId,
        name: `[Deleted Product] ${item.productId}`,
        description: "This product is no longer available",
        price: item.price,
        images: [],
        category: "unknown",
        sizes: [item.selectedSize],
        colors: [item.selectedColor],
        inStock: false,
        stockCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      cartItems.push({
        product: placeholderProduct,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    }
  }

  return cartItems;
}

/**
 * Check if parsed items are in compact format (have productId) or full format (have product).
 */
function isCompactFormat(items: unknown[]): items is CompactCartItem[] {
  return (
    items.length > 0 &&
    typeof items[0] === "object" &&
    items[0] !== null &&
    "productId" in items[0] &&
    !("product" in items[0])
  );
}

async function createOrUpdateOrderFromCheckoutSession(
  session: Stripe.Checkout.Session
) {
  const orderId = session.id;
  const ref = doc(ordersCollection, orderId);
  const snap = await getDoc(ref);

  const amountTotal = (session.amount_total ?? 0) / 100;
  const userId = (session.metadata?.userId as string) || "guest";

  const now = new Date();

  // Parse items from metadata; support both compact and full formats.
  // Compact format: [{ productId, quantity, selectedSize, selectedColor, price }]
  // Full format (legacy): [{ product, quantity, selectedSize, selectedColor }]
  let items: CartItem[] = [];
  if (session.metadata?.items) {
    const parsedItems = JSON.parse(session.metadata.items) as unknown[];
    if (isCompactFormat(parsedItems)) {
      items = await expandCompactItems(parsedItems);
    } else {
      // Legacy full format - use as-is
      items = parsedItems as CartItem[];
    }
  }

  const baseData = {
    userId,
    items,
    total: amountTotal,
    shippingAddress: (session.metadata?.shippingAddress
      ? (JSON.parse(session.metadata.shippingAddress) as Address)
      : null) as Address | null,
    status: "processing",
    paymentMethod: "stripe",
    paymentStatus: session.payment_status === "paid" ? "paid" : "pending",
    stripeSessionId: session.id,
    stripeCustomerId: session.customer as string | null,
    createdAt: snap.exists() ? snap.data().createdAt : now,
    updatedAt: now,
  };

  await setDoc(ref, baseData, { merge: true });
}

