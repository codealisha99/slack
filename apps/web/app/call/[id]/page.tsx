import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CallClient from "@/components/CallClient";

export default async function CallPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const { id } = await params;

  return (
    <CallClient
      callId={id}
      user={{
        id: userId,
        name: user?.fullName ?? user?.username ?? userId,
        image: user?.imageUrl ?? "",
      }}
    />
  );
}
