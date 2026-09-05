"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatContext } from "stream-chat-react";
import * as Sentry from "@sentry/nextjs";
import toast from "react-hot-toast";
import { Hash, Lock, Users, X, AlertCircle } from "lucide-react";

export default function CreateChannelModal({ onClose }: { onClose: () => void }) {
  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState<"public" | "private">("public");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { client, setActiveChannel } = useChatContext();

  useEffect(() => {
    const run = async () => {
      if (!client?.user) return;
      setLoadingUsers(true);
      try {
        const res = await client.queryUsers({ id: { $ne: client.user.id } } as any, { name: 1 }, { limit: 100 });
        setUsers(res.users.filter((u) => !u.id.startsWith("recording-")) ?? []);
      } catch (e) {
        Sentry.captureException(e);
        setUsers([]);
      } finally { setLoadingUsers(false); }
    };
    run();
  }, [client]);

  useEffect(() => {
    if (channelType === "public") setSelectedMembers(users.map((u) => u.id));
    else setSelectedMembers([]);
  }, [channelType, users]);

  const validate = (name: string) => {
    if (!name.trim()) return "Channel name is required";
    if (name.length < 3) return "At least 3 characters";
    if (name.length > 22) return "Max 22 characters";
    if (!/^[a-z0-9-_ ]+$/i.test(name)) return "Letters, numbers, hyphens only";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ve = validate(channelName);
    if (ve) return setError(ve);
    if (isCreating || !client?.user) return;
    setIsCreating(true); setError("");
    try {
      const channelId = channelName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").slice(0, 20);
      const data: any = { name: channelName.trim(), created_by_id: client.user.id, members: [client.user.id, ...selectedMembers] };
      if (description) data.description = description;
      if (channelType === "private") { data.private = true; data.visibility = "private"; } else { data.visibility = "public"; data.discoverable = true; }
      const ch = client.channel("messaging", channelId, data);
      await ch.watch();
      setActiveChannel(ch);
      const params = new URLSearchParams(searchParams.toString());
      params.set("channel", channelId);
      router.push(`?${params.toString()}`);
      toast.success(`#${channelName} created`);
      onClose();
    } catch (err) { setError("Couldn’t create channel — name may be taken"); }
    finally { setIsCreating(false); }
  };

  const slug = channelName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");

  return (
    <div className="create-channel-modal-overlay" onClick={onClose}>
      <div className="create-channel-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="create-channel-modal__header">
          <div>
            <h2>Create a channel</h2>
            <p className="text-xs text-zinc-500 font-normal mt-0.5">Channels keep conversations organized</p>
          </div>
          <button onClick={onClose} className="create-channel-modal__close" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="create-channel-modal__form">
          {error && <div className="form-error"><AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span></div>}

          <div className="form-group">
            <label htmlFor="channelName">Name</label>
            <div className="input-with-icon">
              <Hash className="w-4 h-4 input-icon" />
              <input id="channelName" value={channelName} onChange={(e) => { setChannelName(e.target.value); setError(validate(e.target.value)); }} placeholder="e.g. product-updates" className={`form-input ${error ? "form-input--error" : ""}`} autoFocus maxLength={22} />
            </div>
            {channelName && <div className="form-hint">ID: #{slug || "…"}</div>}
            <p className="text-xs text-zinc-500">Keep it short and descriptive. Lowercase, hyphens allowed.</p>
          </div>

          <div className="form-group">
            <label>Visibility</label>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" value="public" checked={channelType === "public"} onChange={(e) => setChannelType(e.target.value as any)} />
                <div className="radio-content"><Hash className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /><div><div className="radio-title">Public — anyone in workspace</div><div className="radio-description">Discoverable in channel browser, anyone can join</div></div></div>
              </label>
              <label className="radio-option">
                <input type="radio" value="private" checked={channelType === "private"} onChange={(e) => setChannelType(e.target.value as any)} />
                <div className="radio-content"><Lock className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /><div><div className="radio-title">Private — invite only</div><div className="radio-description">Only invited members can see and join</div></div></div>
              </label>
            </div>
          </div>

          {channelType === "private" && (
            <div className="form-group">
              <label>Members</label>
              <div className="member-selection-header">
                <button type="button" className="btn btn-secondary btn-small" onClick={() => setSelectedMembers(users.map((u) => u.id))} disabled={loadingUsers || !users.length}>
                  <Users className="w-3.5 h-3.5" /> Select all
                </button>
                <span className="selected-count">{selectedMembers.length} / {users.length} selected</span>
              </div>
              <div className="members-list">
                {loadingUsers ? <p className="text-sm text-zinc-500 text-center py-6">Loading teammates…</p> : users.length === 0 ? <p className="text-sm text-zinc-500 text-center py-6">No teammates found</p> : users.map((u) => (
                  <label key={u.id} className="member-item">
                    <input type="checkbox" checked={selectedMembers.includes(u.id)} onChange={() => setSelectedMembers((prev) => prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id])} className="member-checkbox" />
                    {u.image ? <img src={u.image} alt={u.name ?? u.id} className="member-avatar" /> : <div className="member-avatar member-avatar-placeholder">{(u.name ?? u.id).charAt(0).toUpperCase()}</div>}
                    <span className="member-name">{u.name ?? u.id}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">Topic <span className="font-normal text-zinc-500">(optional)</span></label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this channel about?" className="form-textarea" rows={3} maxLength={160} />
            <span className="text-xs text-zinc-500 text-right">{description.length}/160</span>
          </div>

          <div className="create-channel-modal__actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={!channelName.trim() || isCreating} className="btn btn-primary">{isCreating ? "Creating…" : "Create channel"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
