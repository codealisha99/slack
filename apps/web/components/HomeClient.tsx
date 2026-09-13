"use client";
/* eslint-disable @next/next/no-img-element */

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStreamChat } from "@/hooks/useStreamChat";
import PageLoader from "./PageLoader";
import { Chat, Channel, ChannelList, MessageList, MessageInput, Thread, Window } from "stream-chat-react";
import { HashIcon, PlusIcon, UsersIcon, Search, Settings, HelpCircle, MoreHorizontal, ChevronDown, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import CustomChannelPreview from "./CustomChannelPreview";
import UsersList from "./UsersList";
import CustomChannelHeader from "./CustomChannelHeader";
import OfflineBanner from "./OfflineBanner";
import { ChannelSkeleton } from "./ui/skeleton";
import type { Channel as ChannelType } from "stream-chat";

const CreateChannelModal = dynamic(() => import("./CreateChannelModal"), { ssr: false });
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });
const KeyboardHelp = dynamic(() => import("./KeyboardHelp"), { ssr: false });

export default function HomeClient() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<ChannelType | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { chatClient, error, isLoading } = useStreamChat();
  const { user } = useUser();

  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const ch = chatClient.channel("messaging", channelId);
        setActiveChannel(ch as any);
      }
    }
  }, [chatClient, searchParams]);

  // ⌘K + ?
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((v) => !v);
      }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsHelpOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSetActiveChannel = (channel: ChannelType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("channel", channel.id!);
    router.push(`?${params.toString()}`);
    setIsSidebarOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md w-full bg-white border border-zinc-200 rounded-xl p-6 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3 text-red-600">!</div>
          <h2 className="text-sm font-semibold">Something went wrong</h2>
          <p className="text-sm text-zinc-600 mt-1">{(error as Error).message}</p>
          <button onClick={() => window.location.reload()} className="mt-4 w-full bg-zinc-900 text-white text-sm font-medium rounded-lg py-2.5 hover:bg-black">Retry</button>
        </div>
      </div>
    );
  }
  if (isLoading || !chatClient) return <PageLoader />;

  return (
    <div className="chat-wrapper">
      <OfflineBanner />
      {/* Top bar */}
      <div className="workspace-topbar">
        <div className="workspace-topbar__left">
          <button className="lg:hidden w-8 h-8 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-white/90 hover:bg-white/15 transition-colors" onClick={() => setIsSidebarOpen((v) => !v)} aria-label="Toggle sidebar">
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <button className="hidden lg:flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <span className="w-7 h-7 rounded-md bg-white/15 border border-white/10 flex items-center justify-center text-xs font-bold">S</span>
            <span className="text-sm font-semibold">Slacki</span>
          </button>
          <span className="hidden lg:inline text-xs text-white/50">/</span>
          <span className="hidden lg:inline text-xs text-white/70 truncate max-w-[240px]">
            {activeChannel ? `#${(activeChannel.data as any)?.id ?? "channel"}` : "Select a conversation"}
          </span>
        </div>

        <button className="workspace-topbar__search" onClick={() => setIsCommandOpen(true)}>
          <Search className="w-3.5 h-3.5 opacity-70" />
          <span>Search by channel or member</span>
          <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-[11px] opacity-60 border border-white/20 rounded px-1.5 py-0.5">⌘ K</span>
        </button>

        <div className="workspace-topbar__actions">
          <button onClick={() => setIsHelpOpen(true)} className="hidden sm:inline-flex w-8 h-8 rounded-md bg-white/10 border border-white/10 items-center justify-center text-white/80 hover:bg-white/15 hover:text-white transition-colors" title="Keyboard shortcuts (?)">
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-md overflow-hidden border border-white/15 bg-white/10 flex items-center justify-center">
            {user?.imageUrl ? <img src={user.imageUrl} alt={user.fullName ?? "You"} className="w-full h-full object-cover" /> : <span className="text-xs font-semibold text-white">{(user?.fullName ?? "U").charAt(0)}</span>}
          </div>
        </div>
      </div>

      <Chat client={chatClient}>
        <div className="chat-container relative">
          {/* Mobile overlay */}
          {isSidebarOpen && <button className="absolute inset-0 bg-black/40 z-10 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar" />}
          {/* Sidebar */}
          <div className={`str-chat__channel-list ${isSidebarOpen ? "str-chat__channel-list--open !translate-x-0 z-20 shadow-2xl" : ""}`}>
            <div className="team-channel-list">
              <div className="team-channel-list__header">
                <button className="workspace-name">
                  <span className="workspace-name__title">Acme Workspace</span>
                  <ChevronDown className="w-4 h-4 workspace-name__chevron" />
                </button>
                <div className="flex items-center gap-1">
                  <Link href="/settings" className="w-7 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/15 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7",
                        userButtonAvatarBox: "w-7 h-7",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button onClick={() => setIsCreateModalOpen(true)} className="create-channel-btn">
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>New channel</span>
                    <MoreHorizontal className="w-3.5 h-3.5 ml-auto opacity-60" />
                  </button>
                  <p className="text-[11px] leading-relaxed text-white/50 mt-2 px-1">Channels organize conversations by topic. Create one for your team.</p>
                </div>

                <ChannelList
                  filters={{ members: { $in: [chatClient.user!.id] } }}
                  channelRenderFilterFn={(channels: any[]) =>
                    channels.filter((c) => {
                      const id = c?.data?.id || c?.id || "";
                      const name = c?.data?.name || "";
                      return !id.startsWith("user_") && !name.startsWith("user_");
                    })
                  }
                  options={{ state: true, watch: true }}
                  Preview={({ channel }: any) => (
                    <CustomChannelPreview channel={channel} activeChannel={activeChannel} setActiveChannel={handleSetActiveChannel} />
                  )}
                  List={({ children, loading, error }: any) => (
                    <div className="channel-sections">
                      <div className="section-header">
                        <button className="section-title">
                          <HashIcon className="w-3.5 h-3.5" />
                          <span>Channels</span>
                          <span className="ml-auto text-[11px] font-normal opacity-60">{loading ? "…" : ""}</span>
                        </button>
                      </div>
                      {loading && <ChannelSkeleton />}
                      {error && <div className="error-message">Couldn’t load channels</div>}
                      {!loading && !error && <div className="channels-list">{children}</div>}

                      <div className="section-header direct-messages">
                        <button className="section-title">
                          <UsersIcon className="w-3.5 h-3.5" />
                          <span>Direct messages</span>
                        </button>
                      </div>
                      <UsersList activeChannel={activeChannel} />
                    </div>
                  )}
                />
              </div>

              <div className="p-3 border-t border-white/10">
                <div className="rounded-lg bg-white/[0.06] border border-white/10 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">✓</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white leading-none">All caught up</div>
                    <div className="text-[11px] text-white/60 leading-none mt-1">No new mentions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="chat-main">
            {activeChannel ? (
              <Channel
                channel={activeChannel as any}
                doSendMessageRequest={async (_channelId: any, message: any) => {
                  const { pending, ...rest } = message;
                  return (activeChannel as any).sendMessage(rest);
                }}
              >
                <Window>
                  <CustomChannelHeader />
                  <MessageList />
                  <MessageInput />
                  <div className="px-4 pb-3 text-[11px] text-zinc-500 flex items-center gap-2 border-t border-zinc-100 bg-white">
                    <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 rounded border border-zinc-200 bg-zinc-50">↵</kbd> to send · <kbd className="px-1 py-0.5 rounded border border-zinc-200 bg-zinc-50">⇧↵</kbd> new line · Drag files to share</span>
                    <span className="sm:hidden">Tip: drag files to share</span>
                    <button onClick={() => setIsHelpOpen(true)} className="ml-auto text-zinc-600 hover:text-zinc-900 underline decoration-zinc-300 underline-offset-2">Shortcuts ?</button>
                  </div>
                </Window>
                <Thread />
              </Channel>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="empty-state">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }} className="empty-state__icon">
                  <HashIcon className="w-5 h-5" />
                </motion.div>
                <div className="empty-state__title">Welcome to Slacki</div>
                <p className="empty-state__desc">Select a channel from the sidebar or create a new one to start collaborating. Your messages, files, and calls live here.</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setIsCreateModalOpen(true)} className="bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black transition-all hover:shadow hover:-translate-y-px inline-flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" /> New channel
                  </button>
                  <button onClick={() => setIsCommandOpen(true)} className="bg-white border border-zinc-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                    Jump to… ⌘K
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-4">Tip: Press <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700">⌘ K</kbd> to quickly jump to any conversation</p>
              </motion.div>
            )}
          </div>
        </div>

        {isCreateModalOpen && <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />}
        <CommandPalette open={isCommandOpen} onClose={() => setIsCommandOpen(false)} onSelectChannel={handleSetActiveChannel} />
        <KeyboardHelp open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </Chat>
    </div>
  );
}
