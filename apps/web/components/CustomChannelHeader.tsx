"use client";
/* eslint-disable @next/next/no-img-element */

import { Hash, Lock, Users, Pin, Video, MoreHorizontal, Search } from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import MembersModal from "./MembersModal";
import PinnedMessagesModal from "./PinnedMessagesModal";
import InviteModal from "./InviteModal";

export default function CustomChannelHeader() {
  const { channel } = useChannelStateContext();
  const { user } = useUser();
  const memberCount = Object.keys(channel.state.members).length;
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);

  const otherUser = Object.values(channel.state.members).find((m: any) => m.user.id !== user?.id) as any;
  const isDM = (channel.data as any)?.member_count === 2 && (channel.data as any)?.id?.includes("user_");
  const isPrivate = (channel.data as any)?.private;
  const title = isDM ? otherUser?.user?.name ?? otherUser?.user?.id : (channel.data as any)?.name ?? (channel.data as any)?.id;
  const topic = (channel.data as any)?.description;

  const handleShowPinned = async () => {
    const state = await channel.query();
    setPinnedMessages((state as any).pinned_messages ?? []);
    setShowPinned(true);
  };

  const handleVideoCall = async () => {
    if (!channel) return;
    const url = `${window.location.origin}/call/${channel.id}`;
    await channel.sendMessage({ text: `Started a video call — join here: ${url}` });
  };

  return (
    <>
      <div className="channel-header">
        <div className="channel-header__left">
          <div className="channel-header__title">
            {isDM ? (
              <>
                {otherUser?.user?.image ? (
                  <img src={otherUser.user.image} alt={otherUser.user.name} className="w-6 h-6 rounded-full object-cover border border-zinc-200" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                    {(otherUser?.user?.name ?? "U").charAt(0).toUpperCase()}
                  </span>
                )}
                <span>{title}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" title="Online" />
              </>
            ) : (
              <>
                {isPrivate ? <Lock className="w-4 h-4 text-zinc-500" /> : <Hash className="w-4 h-4 text-zinc-500" />}
                <span>{title}</span>
              </>
            )}
          </div>
          {topic && <span className="channel-header__meta hidden lg:inline">— {topic}</span>}
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-500 border-l border-zinc-200 pl-3 ml-1">
            <Users className="w-3.5 h-3.5" /> {memberCount}
          </span>
        </div>

        <div className="channel-header__actions">
          <button className="member-count-btn hidden sm:inline-flex" onClick={() => setShowMembers(true)}>
            <Users className="w-3.5 h-3.5" />
            {memberCount}
          </button>
          <button className="icon-btn" onClick={handleVideoCall} title="Start video call" aria-label="Start video call">
            <Video className="w-4 h-4" />
          </button>
          <button className="icon-btn" onClick={handleShowPinned} title="Pinned messages" aria-label="Pinned messages">
            <Pin className="w-4 h-4" />
          </button>
          <button className="icon-btn hidden sm:inline-flex" title="Search in channel" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
          {isPrivate && (
            <button className="icon-btn--primary hidden sm:inline-flex" onClick={() => setShowInvite(true)}>
              Invite
            </button>
          )}
          <button className="icon-btn" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showMembers && <MembersModal members={Object.values(channel.state.members) as any} onClose={() => setShowMembers(false)} />}
      {showPinned && <PinnedMessagesModal pinnedMessages={pinnedMessages} onClose={() => setShowPinned(false)} />}
      {showInvite && <InviteModal channel={channel as any} onClose={() => setShowInvite(false)} />}
    </>
  );
}
