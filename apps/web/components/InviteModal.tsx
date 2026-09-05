"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { X, UserPlus, Search } from "lucide-react";

export default function InviteModal({ channel, onClose }: { channel: any; onClose: () => void }) {
  const { client } = useChatContext();
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true); setError("");
      try {
        const members = Object.keys(channel.state.members);
        const res = await client.queryUsers({ id: { $nin: members } } as any, { name: 1 }, { limit: 30 });
        setUsers(res.users);
      } catch { setError("Failed to load teammates"); }
      finally { setLoading(false); }
    };
    run();
  }, [channel, client]);

  const filtered = users.filter((u) => (u.name ?? u.id).toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleInvite = async () => {
    if (!selected.length) return;
    setInviting(true); setError("");
    try { await channel.addMembers(selected); onClose(); } catch { setError("Couldn’t add members — try again"); } finally { setInviting(false); }
  };

  return (
    <div className="create-channel-modal-overlay" onClick={onClose}>
      <div className="create-channel-modal max-w-[520px]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="create-channel-modal__header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center"><UserPlus className="w-4 h-4" /></div>
            <div>
              <h2>Add people</h2>
              <p className="text-xs text-zinc-500 font-normal">Invite teammates to #{(channel.data as any)?.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="create-channel-modal__close" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name" className="form-input !pl-9" />
          </div>
        </div>

        <div className="px-2 py-3 max-h-[320px] overflow-y-auto">
          {loading && <p className="text-sm text-zinc-500 text-center py-8">Loading teammates…</p>}
          {error && <div className="form-error mx-2">{error}</div>}
          {!loading && filtered.length === 0 && <p className="text-sm text-zinc-500 text-center py-8">No teammates found</p>}
          {!loading && filtered.map((u) => {
            const checked = selected.includes(u.id);
            return (
              <label key={u.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border transition-colors ${checked ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200 hover:bg-zinc-50"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(u.id)} className="accent-zinc-900" />
                {u.image ? <img src={u.image} alt={u.name} className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${checked ? "border border-white/20" : "border border-zinc-200"}`} /> : <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${checked ? "bg-white/15 text-white border border-white/20" : "bg-zinc-900 text-white"}`}>{(u.name ?? u.id).charAt(0).toUpperCase()}</div>}
                <span className={`text-sm font-medium truncate flex-1 ${checked ? "text-white" : "text-zinc-900"}`}>{u.name ?? u.id}</span>
                {checked && <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full">Selected</span>}
              </label>
            );
          })}
        </div>

        <div className="p-3 border-t border-zinc-200 flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-500">{selected.length} selected</span>
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={onClose} disabled={inviting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleInvite} disabled={!selected.length || inviting}>{inviting ? "Adding…" : `Add ${selected.length ? `(${selected.length})` : ""}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
