"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "@/lib/api";
import * as Sentry from "@sentry/nextjs";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export function useStreamChat() {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!tokenData?.token || !user?.id || !STREAM_API_KEY) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);
    let cancelled = false;

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: user.id,
            name: user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? user.id,
            image: user.imageUrl ?? undefined,
          },
          tokenData.token
        );
        if (!cancelled) setChatClient(client);
      } catch (err) {
        console.error("[useStreamChat] connect failed", err);
        Sentry.captureException(err, {
          tags: { component: "useStreamChat" },
          extra: { userId: user?.id, hasKey: !!STREAM_API_KEY },
        });
      }
    };

    connect();
    return () => {
      cancelled = true;
      client.disconnectUser().catch(() => {});
    };
  }, [tokenData?.token, user?.id, user?.fullName, user?.username, user?.imageUrl, user?.primaryEmailAddress?.emailAddress]);

  return { chatClient, isLoading, error };
}
