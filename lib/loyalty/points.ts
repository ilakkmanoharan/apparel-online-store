import { getTierForPoints } from "./tiers";
import type { PointsBalance, LoyaltyTierId } from "@/types/loyalty";

// Mock; replace with Firestore when loyalty collection exists
const MOCK_BALANCES: Record<string, { points: number; lifetimePoints: number }> = {};

export async function getPointsBalance(userId: string): Promise<PointsBalance | null> {
  const data = MOCK_BALANCES[userId] ?? { points: 0, lifetimePoints: 0 };
  const tier = getTierForPoints(data.lifetimePoints);
  return {
    userId,
    points: data.points,
    tierId: tier.id,
    lifetimePoints: data.lifetimePoints,
    updatedAt: new Date(),
  };
}

export async function addPoints(
  userId: string,
  points: number,
  _orderId?: string,
  _description?: string
): Promise<void> {
  const current = MOCK_BALANCES[userId] ?? { points: 0, lifetimePoints: 0 };
  MOCK_BALANCES[userId] = {
    points: current.points + points,
    lifetimePoints: current.lifetimePoints + points,
  };
}

export async function redeemPoints(userId: string, points: number): Promise<{ success: boolean; message?: string }> {
  const balance = await getPointsBalance(userId);
  if (!balance) return { success: false, message: "User not found." };
  if (balance.points < points) return { success: false, message: "Insufficient points." };
  const current = MOCK_BALANCES[userId] ?? { points: 0, lifetimePoints: 0 };
  MOCK_BALANCES[userId] = { ...current, points: current.points - points };
  return { success: true };
}
