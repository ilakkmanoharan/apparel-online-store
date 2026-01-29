import { headers, cookies } from "next/headers";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import type { AuthProfile } from "@/types/auth";

function extractToken(): string | null {
  const hdrs = headers();
  const authHeader = hdrs.get("authorization") || hdrs.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookieStore = cookies();
  const cookieToken =
    cookieStore.get("firebaseIdToken")?.value ??
    cookieStore.get("session")?.value ??
    null;
  return cookieToken ?? null;
}

export async function getServerAuthProfile(): Promise<AuthProfile | null> {
  const token = extractToken();
  if (!token) return null;

  const firebaseAdmin = await getFirebaseAdmin();
  if (!firebaseAdmin) return null;

  try {
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: (decoded as any).name ?? null,
      photoURL: (decoded as any).picture ?? null,
      emailVerified: !!decoded.email_verified,
    };
  } catch (err) {
    console.error("[auth/session] verifyIdToken failed", err);
    return null;
  }
}

export async function requireServerAuthProfile(): Promise<AuthProfile> {
  const profile = await getServerAuthProfile();
  if (!profile) {
    throw new Error("Unauthorized: no valid Firebase ID token found.");
  }
  return profile;
}

