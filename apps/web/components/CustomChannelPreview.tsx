"use client";
import { Hash, Lock } from "lucide-react";
import type { Channel } from "stream-chat";

type Props = {
  channel: Channel;
  activeChannel: Channel | null;
  setActiveChannel: (c: Channel) => void;
};

export default function CustomChannelPreview({ channel, activeChannel, setActiveChannel }: Props) {
  const isActive = activeChannel?.id === channel.id;
  const channelId = (channel?.data?.id as string) || channel?.id || "";
  const isPrivate = (channel.data as any)?.private || (channel.data as any)?.visibility === "private";
  const isDM = channelId.startsWith("user_") || channelId.startsWith("ai_tools");
  if (isDM) return null;

  const unread = (channel as any).countUnread?.() ?? 0;
  const hasUnread = unread > 0;

  return (
    <button
      onClick={() => setActiveChannel(channel)}
      className={`channel-preview-btn ${isActive ? "channel-preview-btn--active" : ""} ${hasUnread && !isActive ? "font-medium" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="channel-preview-btn__icon">
        {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />}
      </span>
      <span className="channel-preview-btn__name">{(channel.data as any)?.name ?? channelId}</span>
      {hasUnread && (
        <span className="unread-badge">{unread > 99 ? "99+" : unread}</span>
      )}
    </button>
  );
}
