"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { isAdminUser, getAdminEmailsFromEnv, type AdminUserRecord } from "@/lib/admin/middleware";

interface AdminAuthContextType {
  user: User | null;
  adminRecord: AdminUserRecord | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminRecord, setAdminRecord] = useState<AdminUserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (uid: string) => {
    const record = await isAdminUser(uid);
    if (record) {
      setAdminRecord(record);
      return;
    }
    const allowedEmails = getAdminEmailsFromEnv();
    if (typeof window === "undefined" && allowedEmails.length) {
      const firebaseUser = auth.currentUser;
      if (firebaseUser?.email && allowedEmails.includes(firebaseUser.email)) {
        setAdminRecord({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: "admin",
          createdAt: new Date(),
        });
        return;
      }
    }
    setAdminRecord(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await checkAdmin(firebaseUser.uid);
      } else {
        setAdminRecord(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [checkAdmin]);

  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const record = await isAdminUser(cred.user.uid);
    const allowedEmails = getAdminEmailsFromEnv();
    const allowedByEnv = allowedEmails.length > 0 && allowedEmails.includes(email);
    if (!record && !allowedByEnv) {
      await firebaseSignOut(auth);
      throw new Error("Not authorized as admin. Add this user to Firestore adminUsers or set ADMIN_EMAILS.");
    }
    setAdminRecord(
      record ?? {
        uid: cred.user.uid,
        email: cred.user.email ?? email,
        role: "admin",
        createdAt: new Date(),
      }
    );
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAdminRecord(null);
  };

  const isAdmin = !!adminRecord || (!!user && getAdminEmailsFromEnv().includes(user.email ?? ""));

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminRecord,
        loading,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (ctx === undefined) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
