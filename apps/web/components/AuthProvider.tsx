"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

// Preview-safe: don't call useAuth outside ClerkProvider
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const isPreview =
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("dummy");

  if (isPreview) return <>{children}</>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getToken, isSignedIn } = useAuth();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isSignedIn) getToken().catch(() => {});
  }, [getToken, isSignedIn]);

  return <>{children}</>;
}
