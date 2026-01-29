import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, UserCredential } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export interface GoogleSignInOptions {
  /**
   * Use redirect-based sign-in instead of popup.
   * Useful for mobile Safari or when popups are blocked.
   */
  useRedirect?: boolean;
}

/**
 * Starts a Google sign-in flow using Firebase client SDK.
 * Must be called from a client component / browser environment.
 */
export async function signInWithGoogle(
  options: GoogleSignInOptions = {}
): Promise<UserCredential | void> {
  if (options.useRedirect) {
    await signInWithRedirect(auth, provider);
    return;
  }
  return signInWithPopup(auth, provider);
}

export function getGoogleAuthProvider(): GoogleAuthProvider {
  return provider;
}

