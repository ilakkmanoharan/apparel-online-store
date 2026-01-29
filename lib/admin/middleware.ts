import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const ADMIN_USERS_COLLECTION = "adminUsers";

export type AdminRole = "admin" | "super_admin" | "support";

export interface AdminUserRecord {
  uid: string;
  email: string;
  role: AdminRole;
  createdAt: Date;
}

/**
 * Check if a user UID is an admin. Reads from Firestore collection "adminUsers".
 * Seed admin users by creating a document with id = uid and fields: email, role, createdAt.
 */
export async function isAdminUser(uid: string): Promise<AdminUserRecord | null> {
  const ref = doc(db, ADMIN_USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: snap.id,
    email: d.email ?? "",
    role: (d.role as AdminRole) ?? "admin",
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
  };
}

/**
 * Optional: allow list from env for development when Firestore adminUsers is empty.
 * Set NEXT_PUBLIC_ADMIN_EMAILS=email1@example.com,email2@example.com (client) or ADMIN_EMAILS (server).
 */
export function getAdminEmailsFromEnv(): string[] {
  if (typeof process === "undefined") return [];
  const raw =
    (typeof window !== "undefined"
      ? (process.env as Record<string, string>).NEXT_PUBLIC_ADMIN_EMAILS
      : process.env?.ADMIN_EMAILS) ?? "";
  return raw.split(",").map((e) => e.trim()).filter(Boolean);
}
