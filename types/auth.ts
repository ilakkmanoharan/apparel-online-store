export interface AuthProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthPreferences {
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
}
