import { auth } from "@clerk/nextjs/server";
import HomeClient from "@/components/HomeClient";
import MarketingLanding from "@/components/MarketingLanding";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) return <MarketingLanding />;
  return <HomeClient />;
}
