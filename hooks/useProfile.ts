"use client";

import { useState, useEffect, useCallback } from "react";
import { getProfile, updateProfile } from "@/lib/firebase/userProfile";
import type { UserProfileData } from "@/lib/firebase/userProfile";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getProfile(userId);
      setProfile(data);
    } catch (e) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const update = useCallback(
    async (data: Partial<Pick<UserProfileData, "displayName" | "phone" | "avatarUrl">>) => {
      if (!userId) return;
      const updated = await updateProfile(userId, data);
      setProfile((p) => (p ? { ...p, ...updated } : null));
      return updated;
    },
    [userId]
  );

  return { profile, loading, refetch, update };
}
