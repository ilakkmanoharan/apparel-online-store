"use client";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

interface SocialSignInButtonsProps {
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
}

export default function SocialSignInButtons(props: SocialSignInButtonsProps) {
  return (
    <div className="space-y-2">
      <GoogleSignInButton {...props} />
      {/* Future providers (Apple, Facebook, etc.) can be added here */}
    </div>
  );
}

