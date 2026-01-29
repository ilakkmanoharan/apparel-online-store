import type { firestore } from "firebase-admin";
import { getAdminDb } from "@/lib/firebase/admin";
import type { AuditLogEntry } from "@/types/admin";

const COLLECTION = "auditLog";

export async function addAuditLog(entry: Omit<AuditLogEntry, "id" | "createdAt">): Promise<string> {
  const db = await getAdminDb();
  if (!db) return "";

  const ref = await db.collection(COLLECTION).add({
    ...entry,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function getAuditLogs(opts: {
  limit?: number;
  resource?: string;
  userId?: string;
}): Promise<AuditLogEntry[]> {
  const db = await getAdminDb();
  if (!db) return [];

  let ref: firestore.Query = db.collection(COLLECTION).orderBy("createdAt", "desc");
  if (opts.resource) ref = ref.where("resource", "==", opts.resource);
  if (opts.userId) ref = ref.where("userId", "==", opts.userId);
  const limit = opts.limit ?? 100;
  const snap = await ref.limit(limit).get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      userId: data.userId,
      userEmail: data.userEmail,
      details: data.details,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    } as AuditLogEntry;
  });
}
