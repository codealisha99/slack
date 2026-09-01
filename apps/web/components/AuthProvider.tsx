"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

// No-op today — kept for parity with legacy AuthProvider (which attached axios interceptor)
// In Next.js we use fetch + Clerk auth() server-side; client fetch uses cookies automatically.
// We keep the component so Providers tree stays identical.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    // Optionally prime token cache — no axios needed
    if (isSignedIn) getToken().catch(() => {});
  }, [getToken, isSignedIn]);

  return <>{children}</>;
}
