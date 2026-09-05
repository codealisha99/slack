"use client";
/* eslint-disable @next/next/no-img-element */
import { X, Crown, Shield } from "lucide-react";

export default function MembersModal({ members, onClose }: { members: any[]; onClose: () => void }) {
  return (
    <div className="create-channel-modal-overlay" onClick={onClose}>
      <div className="create-channel-modal max-w-[480px]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Channel members">
        <div className="create-channel-modal__header">
          <div>
            <h2>Members</h2>
            <p className="text-xs text-zinc-500 font-normal mt-0.5">{members.length} people in this channel</p>
          </div>
          <button onClick={onClose} className="create-channel-modal__close" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-2 py-2 max-h-[420px] overflow-y-auto">
          {members.map((m: any, idx: number) => (
            <div key={m.user.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 rounded-lg transition-colors">
              {m.user?.image ? (
                <img src={m.user.image} alt={m.user.name} className="w-9 h-9 rounded-full object-cover border border-zinc-200" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">
                  {(m.user.name ?? m.user.id).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-900 truncate flex items-center gap-1.5">
                  {m.user.name ?? m.user.id}
                  {idx === 0 && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <div className="text-xs text-zinc-500 truncate">{m.user.id}</div>
              </div>
              <span className={`w-2 h-2 rounded-full ${m.user.online ? "bg-emerald-500" : "bg-zinc-300"}`} />
              {m.role === "owner" && <Shield className="w-3.5 h-3.5 text-zinc-400" />}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-zinc-200 flex justify-end">
          <button onClick={onClose} className="btn btn-secondary">Done</button>
        </div>
      </div>
    </div>
  );
}
