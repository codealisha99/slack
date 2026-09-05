"use client";
/* eslint-disable @next/next/no-img-element */
import { X, Pin } from "lucide-react";

export default function PinnedMessagesModal({ pinnedMessages, onClose }: { pinnedMessages: any[]; onClose: () => void }) {
  return (
    <div className="create-channel-modal-overlay" onClick={onClose}>
      <div className="create-channel-modal max-w-[560px]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="create-channel-modal__header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Pin className="w-4 h-4" />
            </div>
            <div>
              <h2>Pinned messages</h2>
              <p className="text-xs text-zinc-500 font-normal">{pinnedMessages.length} pinned</p>
            </div>
          </div>
          <button onClick={onClose} className="create-channel-modal__close" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-4 py-3 max-h-[420px] overflow-y-auto">
          {pinnedMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-3">
                <Pin className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900">No pinned messages</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-[280px] mx-auto">Pin important messages to keep them handy for everyone in the channel.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pinnedMessages.map((msg: any) => (
                <div key={msg.id} className="flex gap-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white transition-colors">
                  <img src={msg.user.image} alt={msg.user.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-900">{msg.user.name}</div>
                    <div className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed mt-1">{msg.text}</div>
                    <div className="text-xs text-zinc-500 mt-2">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-zinc-200 flex justify-end">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}
