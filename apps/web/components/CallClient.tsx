"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getStreamToken } from "@/lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Video, ArrowLeft, Copy, Check } from "lucide-react";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export default function CallClient({ callId, user }: { callId: string; user: { id: string; name: string; image: string } }) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const { data: tokenData } = useQuery({ queryKey: ["streamToken"], queryFn: getStreamToken, enabled: !!user.id });

  useEffect(() => {
    const init = async () => {
      if (!tokenData?.token || !user || !callId) return;
      try {
        const videoClient = new StreamVideoClient({ apiKey: STREAM_API_KEY, user: { id: user.id, name: user.name, image: user.image }, token: tokenData.token });
        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        setClient(videoClient);
        setCall(callInstance);
      } catch (e) {
        console.error(e);
        toast.error("Couldn’t join call");
      } finally {
        setIsConnecting(false);
      }
    };
    init();
    return () => {
      // cleanup video client on unmount
      client?.disconnectUser?.().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData, user, callId]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied");
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <p className="text-sm font-medium">Joining call…</p>
        <p className="text-xs text-white/60 mt-1">#{callId}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/15 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-white text-zinc-900 flex items-center justify-center"><Video className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-semibold leading-none">Call — #{callId}</div>
              <div className="text-xs text-white/60 leading-none mt-1">End-to-end encrypted · {user.name}</div>
            </div>
          </div>
          <span className="sm:hidden text-sm font-medium text-white truncate max-w-[160px]">#{callId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live
          </span>
          <button onClick={copyLink} className="inline-flex items-center gap-2 text-xs font-medium bg-white text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>

      {/* Video */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="w-full max-w-6xl aspect-[16/10] lg:aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl flex flex-col">
          {client && call ? (
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                <Video className="w-7 h-7 text-white/80" />
              </div>
              <p className="text-sm font-semibold">Couldn’t start call</p>
              <p className="text-xs text-white/60 mt-1 max-w-sm">Check your camera/mic permissions and try again. The link is still valid — share it with teammates.</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => window.location.reload()} className="text-sm font-medium bg-white text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-100">Retry</button>
                <button onClick={() => router.push("/")} className="text-sm font-medium bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/15">Back to workspace</button>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-white/40 mt-4 text-center">Press <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/10 text-white/70">Esc</kbd> to leave · Camera and mic are off by default until you enable them</p>
      </div>
    </div>
  );
}

function CallContent() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();
  if (callingState === CallingState.LEFT) router.push("/");
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 bg-zinc-900">
        <SpeakerLayout />
      </div>
      <div className="border-t border-white/10 bg-zinc-950 p-3 flex justify-center">
        <StreamTheme>
          <CallControls onLeave={() => router.push("/")} />
        </StreamTheme>
      </div>
    </div>
  );
}
