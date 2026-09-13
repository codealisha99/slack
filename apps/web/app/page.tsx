import HomeClient from "@/components/HomeClient";
import MarketingLanding from "@/components/MarketingLanding";

export default async function HomePage() {
  const isPreview =
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("dummy");

  if (isPreview) return <MarketingLanding />;

  // Dynamic import to avoid Clerk error in preview bundle
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return <MarketingLanding />;
  return <HomeClient />;
}
