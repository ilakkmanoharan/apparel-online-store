"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { signInWithGoogle } from "@/lib/firebase/auth-google";

interface GoogleSignInButtonProps {
  label?: string;
  useRedirect?: boolean;
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
}

export default function GoogleSignInButton({
  label = "Continue with Google",
  useRedirect,
  onError,
  onSuccess,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await signInWithGoogle({ useRedirect });
      onSuccess?.();
    } catch (err) {
      console.error("[GoogleSignInButton]", err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
      onClick={handleClick}
      disabled={loading}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-white">
        <span className="text-lg leading-none">G</span>
      </span>
      <span>{loading ? "Connecting…" : label}</span>
    </Button>
  );
}

