import { useEffect, useState, useCallback } from "react";
import { getProfile, updateProfile, type UserProfileData } from "@/lib/firebase/userProfile";

interface UseProfileUpdateOptions {
  userId: string | null | undefined;
}

export function useProfileUpdate({ userId }: UseProfileUpdateOptions) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getProfile(userId)
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((err) => {
        console.error("[useProfileUpdate] load", err);
        if (!cancelled) setError("Failed to load profile.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const save = useCallback(
    async (updates: Partial<Pick<UserProfileData, "displayName" | "phone" | "avatarUrl">>) => {
      if (!userId) return;
      setSaving(true);
      setError(null);
      try {
        const updated = await updateProfile(userId, updates);
        setProfile((prev) => ({ ...(prev ?? { updatedAt: updated.updatedAt }), ...updated }));
      } catch (err) {
        console.error("[useProfileUpdate] save", err);
        setError("Failed to save profile.");
      } finally {
        setSaving(false);
      }
    },
    [userId]
  );

  return {
    profile,
    loading,
    saving,
    error,
    save,
  };
}

