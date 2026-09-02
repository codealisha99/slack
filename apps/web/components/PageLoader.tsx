"use client";
import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shadow-sm">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-900">Loading workspace</p>
          <p className="text-xs text-zinc-500 mt-1">Connecting to Slacki…</p>
        </div>
      </motion.div>
    </div>
  );
}
