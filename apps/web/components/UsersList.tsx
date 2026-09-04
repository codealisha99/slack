"use client";
/* eslint-disable @next/next/no-img-element */

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useChatContext } from "stream-chat-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import type { Channel } from "stream-chat";

export default function UsersList({ activeChannel }: { activeChannel: Channel | null }) {
  const { client } = useChatContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchUsers = useCallback(async () => {
    if (!client?.user) return [];
    const res = await client.queryUsers({ id: { $ne: client.user.id } } as any, { name: 1 }, { limit: 20 });
    return res.users.filter((u) => !u.id.startsWith("recording-"));
  }, [client]);

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users-list", client?.user?.id],
    queryFn: fetchUsers,
    enabled: !!client?.user,
    staleTime: 1000 * 60 * 5,
  });

  const startDM = async (targetUser: any) => {
    if (!targetUser || !client?.user) return;
    try {
      const id = [client.user.id, targetUser.id].sort().join("-").slice(0, 64);
      const ch = client.channel("messaging", id, { members: [client.user.id, targetUser.id] });
      await ch.watch();
      const params = new URLSearchParams(searchParams.toString());
      params.set("channel", ch.id!);
      router.push(`?${params.toString()}`);
    } catch (e) {
      Sentry.captureException(e, { tags: { component: "UsersList" } });
    }
  };

  if (isLoading) return <div className="team-channel-list__message">Loading…</div>;
  if (isError) return <div className="team-channel-list__message">Failed to load</div>;
  if (!users.length) return <div className="team-channel-list__message">No teammates yet</div>;

  return (
    <div className="team-channel-list__users">
      {users.map((u: any) => {
        const channelId = [client.user!.id, u.id].sort().join("-").slice(0, 64);
        const ch = client.channel("messaging", channelId, { members: [client.user!.id, u.id] });
        const unread = (ch as any).countUnread?.() ?? 0;
        const isActive = activeChannel?.id === channelId;
        const initials = (u.name ?? u.id).charAt(0).toUpperCase();
        return (
          <button
            key={u.id}
            onClick={() => startDM(u)}
            className={`channel-preview-btn ${isActive ? "channel-preview-btn--active" : ""}`}
          >
            <span className="relative flex-shrink-0">
              {u.image ? (
                <img src={u.image} alt={u.name ?? u.id} className="w-6 h-6 rounded-full object-cover border border-white/20" />
              ) : (
                <span className="w-6 h-6 rounded-full bg-white/15 border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white">
                  {initials}
                </span>
              )}
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#350D36] ${u.online ? "bg-emerald-500" : "bg-zinc-400"}`} />
            </span>
            <span className="channel-preview-btn__name">{u.name ?? u.id}</span>
            {unread > 0 && <span className="unread-badge">{unread > 9 ? "9+" : unread}</span>}
            {u.online && !unread && <span className="text-[11px] opacity-60 hidden lg:inline">online</span>}
          </button>
        );
      })}
    </div>
  );
}
