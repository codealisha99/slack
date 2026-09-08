"use client";

import { X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KeyboardHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const shortcuts = [
    { keys: ["⌘", "K"], desc: "Jump to channel or person" },
    { keys: ["⌘", "↵"], desc: "Send message" },
    { keys: ["Esc"], desc: "Close modal / leave call" },
    { keys: ["?"], desc: "Show this help" },
    { keys: ["↑", "↓"], desc: "Navigate command palette" },
  ];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40" onClick={onClose} />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-[420px] bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              <div className="flex items-center justify-between px-5 h-14 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center"><Command className="w-4 h-4" /></div>
                  <div><div className="text-sm font-semibold">Keyboard shortcuts</div><div className="text-xs text-zinc-500">Work faster in Slacki</div></div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-2">
                {shortcuts.map((s) => (
                  <div key={s.desc} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-50">
                    <span className="text-sm text-zinc-700">{s.desc}</span>
                    <span className="flex items-center gap-1">
                      {s.keys.map((k) => (
                        <kbd key={k} className="px-1.5 py-1 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 shadow-sm min-w-[22px] text-center">{k}</kbd>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50 text-xs text-zinc-500">Press <kbd className="px-1 py-0.5 rounded border border-zinc-200 bg-white">?</kbd> anytime to toggle this help</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
