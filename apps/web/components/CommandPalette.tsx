"use client";

import { useEffect, useState, useMemo } from "react";
import { useChatContext } from "stream-chat-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Hash, Lock, User, MessageSquare, Video, X, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectChannel: (c: any) => void;
};

export default function CommandPalette({ open, onClose, onSelectChannel }: Props) {
  const { client } = useChatContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(0);
  const [channels, setChannels] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !client?.user) return;
    const load = async () => {
      try {
        const [chRes, uRes] = await Promise.all([
          client.queryChannels({ members: { $in: [client.user!.id] } } as any, {}, { limit: 30 }),
          client.queryUsers({ id: { $ne: client.user!.id } } as any, { name: 1 }, { limit: 20 }),
        ]);
        setChannels(chRes);
        setUsers(uRes.users.filter((u: any) => !u.id.startsWith("recording-")));
      } catch {}
    };
    load();
  }, [open, client]);

  // Reset on open
  useEffect(() => {
    if (open) { setQ(""); setSelected(0); }
  }, [open]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); const item = filtered[selected]; if (item) handleSelect(item); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    const ch = channels
      .filter((c) => {
        const id = (c.data?.id ?? c.id ?? "").toLowerCase();
        const name = (c.data?.name ?? "").toLowerCase();
        return !id.startsWith("user_") && (!needle || id.includes(needle) || name.includes(needle));
      })
      .map((c) => ({ kind: "channel" as const, id: c.id, label: c.data?.name ?? c.id, sub: (c.data as any)?.description ?? `${Object.keys(c.state.members).length} members`, obj: c, private: (c.data as any)?.private }));
    const us = users
      .filter((u) => !needle || (u.name ?? u.id).toLowerCase().includes(needle))
      .map((u) => ({ kind: "dm" as const, id: u.id, label: u.name ?? u.id, sub: u.online ? "Online" : "Offline", obj: u }));
    return [...ch, ...us].slice(0, 12);
  }, [q, channels, users]);

  const handleSelect = async (item: any) => {
    if (item.kind === "channel") {
      onSelectChannel(item.obj);
      onClose();
    } else {
      // DM
      const id = [client.user!.id, item.obj.id].sort().join("-").slice(0, 64);
      const ch = client.channel("messaging", id, { members: [client.user!.id, item.obj.id] });
      await ch.watch();
      const params = new URLSearchParams(searchParams.toString());
      params.set("channel", ch.id!);
      router.push(`?${params.toString()}`);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40" onClick={onClose} />
          <div className="fixed inset-0 z-40 flex items-start justify-center pt-[18vh] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[560px] bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[60vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 h-14 border-b border-zinc-200 flex-shrink-0">
                <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSelected(0); }} placeholder="Jump to channel or person…" className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-400" />
                <button onClick={onClose} className="w-7 h-7 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><X className="w-3.5 h-3.5" /></button>
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-3"><Search className="w-4 h-4 text-zinc-400" /></div>
                    <p className="text-sm font-medium text-zinc-900">No results</p>
                    <p className="text-xs text-zinc-500 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filtered.map((item, idx) => (
                      <button
                        key={`${item.kind}-${item.id}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelected(idx)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border ${idx === selected ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-200"}`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${idx === selected ? "bg-white/15 border-white/20 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-600"}`}>
                          {item.kind === "channel" ? (item.private ? <Lock className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />) : <User className="w-3.5 h-3.5" />}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`text-sm font-medium truncate block ${idx === selected ? "text-white" : "text-zinc-900"}`}>{item.label}</span>
                          <span className={`text-xs truncate block ${idx === selected ? "text-white/60" : "text-zinc-500"}`}>{item.sub}</span>
                        </span>
                        <span className={`hidden sm:flex items-center gap-1 text-xs ${idx === selected ? "text-white/60" : "text-zinc-400"}`}>
                          {idx === selected && <CornerDownLeft className="w-3 h-3" />} Jump
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-3 py-2.5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500 flex-shrink-0">
                <span className="flex items-center gap-3"><span className="hidden sm:inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-white text-zinc-700">↑↓</kbd> Navigate</span><span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-white text-zinc-700">↵</kbd> Select</span></span>
                <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> {channels.length} channels · <Video className="w-3 h-3" /> {users.length} people</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
